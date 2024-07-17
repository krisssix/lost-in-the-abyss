import * as THREE from 'three';

AFRAME.registerComponent('zombie', {

    schema: {
        target: { type: 'selector' }, // Target entity (the character)
        speed: { type: 'number', default: 4 }, // Movement speed
        detectDistance: { type: 'number', default: 10 }, // Distance to detect the character
        fovAngle: { type: 'number', default: 45 }
    },


    init: function () {
        console.log('Hello, you zombie');

        // Initialize variables
        this.target = this.data.target;
        this.speed = this.data.speed;
        this.detectDistance = this.data.detectDistance;
        this.visibleTarget = false;

        this.velocity = null;
        this.animation = 'idle';

        this.zombieModel = this.el.children[0];
        this.characterModel = this.target.children[0];

        this.collisionBodies = [];
        this.soundPlayed = false;

        this.stun = 0;

        // Safely add the event listener
        if (this.target) {
            this.target.addEventListener('visible', event => {
                this.visibleTarget = event.detail.visible;
            });
        } else {
            console.warn("Target not found yet, retrying...");
            setTimeout(() => {
                if (this.target) {
                    this.target.addEventListener('visible', event => {
                        this.visibleTarget = event.detail.visible;
                    });
                }
            }, 100); // Retry after a short delay
        }

    },


    tick: function (time, timeDelta) {
        if (!this.target) {
            console.error("Target not found.");
            return;
        } else {
            this.fovCheck();


            // Zombie in flashlight light
            const directionFromTarget = new THREE.Vector3()
                .subVectors(this.target.object3D.position, this.el.object3D.position)
                .normalize();

            const characterForward = new THREE.Vector3(0, 0, -1).applyQuaternion( this.characterModel.object3D.quaternion);
            const angleBetween = Math.acos(characterForward.dot(directionFromTarget)) * 180 / Math.PI;

            const flashlightConeAngle = 45;

            // Check if the flashlight is pointing at the zombie
            if (angleBetween <= flashlightConeAngle / 2 && this.characterModel.children[0].getAttribute('visible')) {
                console.log('zombie in light');
                this.inLight(); // Stop the zombie
            } else {
                if (this.stun > 0) {
                    this.stun--;
                } else {

                    const distanceToTarget = this.el.object3D.position.distanceTo(this.target.object3D.position);

                    //console.log(distanceToTarget);
                    //console.log(this.visibleTarget);
                    if (distanceToTarget <= 0.5) {
                        this.velocity = null;
                        if (this.attacked) {
                            return;
                        }

                        if (this.collisionBodies.includes(this.target)) {
                            return;
                        }

                        this.collisionBodies.push(this.target);

                        clearTimeout(this.collisionTimeout);
                        this.collisionTimeout = setTimeout(
                            () => this.collisionBodies.splice(this.collisionBodies.indexOf(this.target)),
                            500
                        );

                        this.target.emit('zombie-attack');
                    } else if ((this.visibleTarget && distanceToTarget <= 15) || distanceToTarget <= 4) {
                        this.moveTowardsTarget();
                    } else {
                        this.velocity = null;
                        this.animation = 'idle';
                        this.zombieModel.setAttribute('animation-mixer', {
                            clip: 'idle',
                            crossFadeDuration: 0.2,
                        });
                    }
                }


                if (this.el.body && this.velocity) {
                    this.el.body.velocity.copy(this.velocity);
                }


            }
        }


    },




    fovCheck: function() {
        // Calculate the direction to the target
        const directionToTarget = new THREE.Vector3()
            .subVectors(this.target.object3D.position, this.el.object3D.position)
            .normalize();

        // Adjust the zombie's forward direction to match the model's orientation
        const zombieForward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.zombieModel.object3D.quaternion);

        // Calculate the angle between the forward direction and the direction to the target
        const angleBetween = Math.acos(zombieForward.dot(directionToTarget)) * 180 / Math.PI;

        // Check if the target is within the FOV
        if (angleBetween <= this.data.fovAngle) {
            const raycaster = new THREE.Raycaster();

            // Cast a ray from the zombie towards the target
            raycaster.set(this.el.object3D.position, directionToTarget);

            // Use A-Frame's query system to find collidable objects
            const collidableObjects = this.el.sceneEl.querySelectorAll('.collidable');
            const objectsArray = Array.from(collidableObjects).map(el => el.object3D);

            // Explicitly include the target in the array of objects to test against
            const objectsToTest = [this.target.object3D].concat(objectsArray);

            // Perform raycasting
            let intersects = raycaster.intersectObjects(objectsToTest, true);

            // Sort intersections by distance
            intersects.sort((a, b) => a.distance - b.distance);

            // Calculate the distance to the target for comparison
            const distanceToTarget = this.el.object3D.position.distanceTo(this.target.object3D.position);

            // Filter intersections to only include those closer than the target
            const relevantIntersects = intersects.filter(intersection => (intersection.distance <= distanceToTarget));

            // Determine if the path is clear to the target
            const isClearPath = relevantIntersects.length === 0 || (relevantIntersects[0] && relevantIntersects[0].object === this.target.object3D);

            // If the path is clear and the target is within the FOV, set visibleTarget to true
            if (isClearPath) {
                this.visibleTarget = true;
                console.log('can see target');
                if (!this.soundPlayed) {
                    var soundEntity = document.querySelector('#zombie-sound-entity');
                    if (soundEntity) {
                        soundEntity.components.sound.playSound();
                        this.soundPlayed = true; // Set the flag to true after playing the sound
                    }
                }
            } else {
                    this.visibleTarget = false;
                    this.soundPlayed = false;
            }
        } else {
            this.visibleTarget = false;
            this.soundPlayed = false;
        }

    },


        moveTowardsTarget: function () {
        if (!this.target ||!this.el.body) {
            console.log("No target or body");
            return;
        }

        // Calculate the direction to the target
        const direction = new THREE.Vector3()
            .subVectors(this.target.object3D.position, this.el.object3D.position)
            .normalize();

        //console.log(direction);

        if (this.animation !== 'run') {
            this.zombieModel.setAttribute('animation-mixer', {
                clip: 'run',
                crossFadeDuration: 0.2,
            });
            this.animation = 'run';
        }

        // Apply a force in the direction of the target
        //const forceMagnitude = this.speed * this.el.body.mass; // Example force magnitude, adjust as needed
        this.velocity = direction.multiplyScalar(3.5);

        // Calculate the angle to rotate the zombie to face the direction of movement
        const angleRadians = Math.atan2(direction.x, direction.z);
        const angleDegrees = THREE.MathUtils.radToDeg(angleRadians) + 90; // Convert to degrees and adjust for A-Frame's Y-up system

        // Set the zombie's Y rotation to face the direction of movement
        //this.el.setAttribute('rotation', { y: angleDegrees + 90 });
        this.zombieModel.setAttribute('rotation', { y: angleDegrees + 90 });

    },

    inLight() {
        this.velocity = null;
        this.stun = 100;
        if (this.animation !== 'block') {
            this.zombieModel.setAttribute('animation-mixer', {
                clip: 'block',
                crossFadeDuration: 0.2,
            });
            this.animation = 'block';
        }
    },

    stop() {
        this.velocity = null;
        if (this.animation !== 'idle') {
            this.zombieModel.setAttribute('animation-mixer', {
                clip: 'idle',
                crossFadeDuration: 0.2,
            });
            this.animation = 'idle';
        }
    }

});
