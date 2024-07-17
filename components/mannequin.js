import * as THREE from 'three';

AFRAME.registerComponent('mannequin', {
    schema: {
        target: { type: 'selector' }, // Target entity (the character)
    },
    init: function () {

        this.target = this.data.target;
        this.characterModel = this.target.children[0];
        this.mannequinModel = this.el.children[0];

        this.lastExecutionTime = 0;

    },


    tick: function (time, timeDelta) {

        if (time - this.lastExecutionTime < 1000) {
            return;
        }

        // Update the last execution time
        this.lastExecutionTime = time;

        const directionFromTarget = new THREE.Vector3()
            .subVectors(this.target.object3D.position, this.el.object3D.position)
            .normalize();

        const characterForward = new THREE.Vector3(0, 0, -1).applyQuaternion( this.characterModel.object3D.quaternion);
        const angleBetween = Math.acos(characterForward.dot(directionFromTarget)) * 180 / Math.PI;

        const distanceToTarget = this.el.object3D.position.distanceTo(this.target.object3D.position);

        // Check if the flashlight is pointing at the zombie
        if (angleBetween >= 90 && distanceToTarget >= 4) {
            //console.log('behind');

            const direction = new THREE.Vector3()
                .subVectors(this.target.object3D.position, this.el.object3D.position)
                .normalize();

            this.velocity = direction.multiplyScalar(5);


            const angleRadians = Math.atan2(direction.x, direction.z);
            const angleDegrees = THREE.MathUtils.radToDeg(angleRadians) + 90; // Convert to degrees and adjust for A-Frame's Y-up system

            // Set the zombie's Y rotation to face the direction of movement
            //this.el.setAttribute('rotation', { y: angleDegrees + 90 });
            this.mannequinModel.setAttribute('rotation', { y: angleDegrees + 90 });

            let randomNumber = Math.floor(Math.random() * 12) + 1;
            //console.log(randomNumber);
            if (randomNumber === 1) {
                //console.log('change');
                randomNumber = Math.floor(Math.random() * 8) + 1;

                this.mannequinModel.setAttribute('animation-mixer', {
                    clip: randomNumber.toString(),
                    crossFadeDuration: 0.2,
                });

                if (distanceToTarget <= 12) {
                    var soundEntity
                    randomNumber = Math.floor(Math.random() * 2) + 1;
                    if (randomNumber === 1) {
                        soundEntity = document.querySelector('#bones-sound-entity');
                    } else if (randomNumber === 2) {
                        soundEntity = document.querySelector('#rattling-sound-entity');
                    }
                    if (soundEntity) {
                        soundEntity.components.sound.playSound();
                        this.soundPlayed = true; // Set the flag to true after playing the sound
                    }
                }

            }

        } else {
            this.velocity = null;
        }

        if (this.el.body && this.velocity) {
            this.el.body.velocity.copy(this.velocity);
        }

    },

});
