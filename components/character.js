import * as THREE from 'three';

AFRAME.registerComponent('character', {
    init() {
        this.isFlashlightOn = false;
        this.flashlightBattery = 100;

        this.health = 100;
        this.keys = 2;
        this.isWalking = false;
        this.isBacking = false;
        this.turning = 'not';
        this.isSprinting = false;
        this.stamina = 100;

        this.collisionBodies = [];
        this.velocity = null;
        this.rotationY = 0;
        this.characterModel = this.el.children[0];
        this.camera = this.characterModel.children[1];
        this.collidedItem = null; // Keep track of the collided item
        this.isPlayingGrab = false; // Track if grab animation is playing
        this.isFalling = false; // Add this line

        this.disabledControls = false;
        this.pickedUpItems = new Set(); // Track picked-up items


        document.addEventListener('keydown',(event) => {
            if(this.disabledControls) return;

            console.log(`Key pressed: ${event.key}`);
            if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') {
                this.turn('left');
            } else if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') {
                this.turn('right');
            } else if (event.key === 'w' || event.key === 'W' || event.key === 'ArrowUp') {
                this.startWalking('front');
                this.isWalking = true;
            } else if (event.key === 's' || event.key === 'S' || event.key === 'ArrowDown') {
                this.startWalking('back');
                this.isBacking = true;
            }
            if (event.shiftKey) {
                if (this.stamina > 10) {
                    this.isSprinting = true;
                    if (this.isWalking) {
                        this.updateAnimation('run')
                    }
                }
            }
            if (event.key === 'l' || event.key === 'L') {
                this.toggleFlashlight();
            }
            if (event.key === 'p' || event.key === 'P') {
                this.handlePickup();
            }
            if (event.key === 'e' || event.key === 'E') {
                this.handleDoorUnlock();
            }


        });

        document.addEventListener('keyup', (event) => {
            if(this.disabledControls) return;
            if (!this.isPlayingGrab) {
                if (event.key === 'w' || event.key === 'W' || event.key === 'ArrowUp' ||
                    event.key === 's' || event.key === 'S' || event.key === 'ArrowDown'
                ) {
                    this.isWalking = false;
                    this.isBacking = false;
                    this.stop();
                }

                if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft' ||
                    event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight'
                ) {
                    this.turning = 'not';
                    if (!(this.isWalking || this.isBacking)) {
                        this.updateAnimation('idle');
                    }
                }

                // Always check for the Shift key to stop sprinting
                if (!event.shiftKey) {
                    this.isSprinting = false;
                    if (this.isWalking) {
                        this.updateAnimation('walk');
                    } else if (this.isBacking) {
                        this.updateAnimation('walk-back');
                    } else {
                        this.updateAnimation('idle');
                    }
                }
            }
        });

        this.el.addEventListener('collide', (event) => {
            const otherEntity = event.detail.body.el;
            const itemType = otherEntity.getAttribute('item');
            console.log(`Collided with item: ${itemType}`);

            if (itemType) {
                this.collidedItem = otherEntity;
                const doorMessage = document.querySelector('#doorMessage');
                const pickupMessage = document.querySelector('#pickup');

                if (itemType === 'door') {
                    if (this.keys === 3) {
                        doorMessage.textContent = `Press E to open the door`;
                    } else {
                        doorMessage.textContent = `You haven't obtained all keys yet.`;
                    }
                    doorMessage.style.display = 'block';
                    pickupMessage.style.display = 'none'; // Hide the pickup message
                    setTimeout(() => {
                        doorMessage.style.display = 'none';
                    }, 2000);
                } else if (itemType === 'hole') {
                    this.fallIntoHole();
                } else {
                    pickupMessage.textContent = `Press P to pick up the ${itemType}`;
                    pickupMessage.style.display = 'block'; // Show pickup instruction.

                    // Hide the message after 3 seconds
                    this.pickupTimeout = setTimeout(() => {
                        pickupMessage.style.display = 'none';
                    }, 2000);

                    // Add an event listener to hide the message when moving away
                    this.el.addEventListener('body-removed', this.hidePickupMessage);
                }
            } else {
                //this.processCollision(event);
            }
        });

        this.el.addEventListener('zombie-attack', event => {
            // The collision affects the character's health
            this.health = Math.max(this.health - 20, 0);
            console.log('Health', this.health);
            this.updateHealthDisplay();

            if (this.health <= 0) {
                this.disabledControls = true;

                this.updateAnimation('death');

                var soundEntity = document.querySelector('#scream-sound-entity');
                if (soundEntity) {
                    soundEntity.components.sound.playSound();
                }


                setTimeout(() => {
                    this.pauseAnimation()
                    this.checkGameOver();
                }, 3000);
            }
        });

        setTimeout(() => {
            var scene = document.querySelector('#scene');

                var soundEntity = document.querySelector('#night-sound-entity');
                console.log('Scene loaded');

                // Check if sound entity is available
                if (soundEntity) {
                    console.log('soundEntity loaded');
                    soundEntity.components.sound.playSound();
                } else {
                    console.error('Sound entity not found');
                }
        }, 5000);

    },

    handleDoorUnlock() {
        if (this.collidedItem) {
            const itemType = this.collidedItem.getAttribute('item');
            console.log(`Attempting to unlock item: ${itemType}`);

            if (itemType === 'door' && this.keys === 3) {
                // Mark the item as picked up to prevent further presses
                if (this.collidedItem.getAttribute('data-picked-up') === 'true') {
                    console.log("This item has already been picked up.");
                    return;
                }
                this.collidedItem.setAttribute('data-picked-up', 'true');

                this.isPlayingGrab = true;
                this.updateAnimation('grab');

                setTimeout(() => {
                    console.log('Door unlocked!');
                    this.collidedItem.parentNode.removeChild(this.collidedItem);
                    this.collidedItem = null;
                    document.querySelector('#doorMessage').style.display = 'none';
                    this.isPlayingGrab = false;
                    this.updateAnimation('idle');

                    // Show the victory screen
                    document.getElementById('victory').style.display = 'flex';
                    //this.disabledControls = true; // Disable controls on victory

                }, 1000);
            } else {
                console.log("No item to pick up or not enough keys.");
            }
        } else {
            console.log("No item to pick up.");
        }
    },


    fallIntoHole() {
        this.disabledControls = true;
        this.turning = 'not';
        this.velocity = null;

        if (this.isFalling) return;
        this.isFalling = true;

        const currentPosition = this.characterModel.getAttribute('position');
        this.characterModel.setAttribute('position', {x: currentPosition.x, y: currentPosition.y - 1.6, z: currentPosition.z});

        const cameraPosition = this.camera.getAttribute('position');
        this.camera.setAttribute('position', {x: cameraPosition.x, y: cameraPosition.y + 2, z: cameraPosition.z});

        // Update the animation to 'fall'
        this.updateAnimation('fall');


        setTimeout(() => {
            this.pauseAnimation()
            this.health = 0;
            this.updateHealthDisplay();
            this.checkGameOver();
        }, 1800); // Match this duration to the animation duration

    },


    turn(direction) {
        if (this.isPlayingGrab) return; // Don't turn if grab animation is playing

        switch (direction) {
            case 'left':
                //this.rotationY = this.rotationY + 5;
                this.turning = direction;
                if (!(this.isWalking || this.isBacking)) {
                    this.updateAnimation('turn-left');
                }
                break;

            case 'right':
                //this.rotationY = this.rotationY - 5;
                this.turning = direction;
                if (!(this.isWalking || this.isBacking)) {
                    this.updateAnimation('turn-right');
                }
                break;
            default:
                this.turning = 'not';
                break;
        }


    },



    handlePickup() {
        if (this.collidedItem) {
            const itemType = this.collidedItem.getAttribute('item');

            // Check if the item has already been picked up
            if (this.collidedItem.getAttribute('data-picked-up') === 'true') {
                console.log("This item has already been picked up.");
                return;
            }

            // Mark the item as picked up to prevent further presses
            this.collidedItem.setAttribute('data-picked-up', 'true');

            this.isPlayingGrab = true;
            this.updateAnimation('grab');

            let entity;
            switch (itemType) {
                case 'battery':
                    entity = this.collidedItem.closest('a-entity[item="battery"]');
                    break;
                case 'health potion':
                    entity = this.collidedItem.closest('a-entity[item="health potion"]');
                    break;
                case 'key':
                    entity = this.collidedItem.closest('a-entity[item="key"]');
                    break;
                default:
                    console.log('Unknown item type:', itemType);
            }

            if (entity) {
                entity.setAttribute('visible', false); // Set the entity to invisible
            }

            setTimeout(() => {
                switch (itemType) {
                    case 'battery':
                        console.log('Battery picked up!');
                        this.flashlightBattery = 100;
                        this.updateBatteryDisplay();
                        break;
                    case 'health potion':
                        console.log('Health Potion picked up!');
                        this.health = Math.min(this.health + 20, 100);
                        this.updateHealthDisplay();
                        break;
                    case 'key':
                        console.log('Key picked up!');
                        this.keys = Math.min(this.keys + 1, 3);
                        this.updateKeyDisplay();
                        this.updateKeyImageDisplay();
                        break;
                    default:
                        console.log('Unknown item type:', itemType);
                }

                this.collidedItem.parentNode.removeChild(this.collidedItem);
                this.collidedItem = null;

                document.querySelector('#pickup').style.display = 'none';
                this.isPlayingGrab = false;
                this.updateAnimation('idle');
            }, 1000);
        } else {
            console.log("No item to pick up.");
        }
    },


    updateKeyImageDisplay() {
        if (this.keys === 3) {
            this.toggleKeyFoundImage(true); // Show the "key found" image
            this.toggleKeyNotFoundImage(false); // Hide the "key not found" image
        } else {
            this.toggleKeyFoundImage(false); // Hide the "key found" image
            this.toggleKeyNotFoundImage(true); // Show the "key not found" image
        }
    },

    startWalking(direction) {
        if (this.isPlayingGrab) return; // Don't start walking if grab animation is playing

        // Directly calculate the forward vector based on the rotationY
        // Assuming rotationY is in degrees, convert it to radians for trigonometric functions
        let rotationYRadians = THREE.MathUtils.degToRad(this.rotationY);

        let forwardX = Math.sin(rotationYRadians);
        let forwardZ = Math.cos(rotationYRadians);

        let forwardVector = new CANNON.Vec3(forwardX, 0, forwardZ);

        forwardVector.normalize();

        if (direction === 'back') {
            forwardVector.x = forwardVector.x * -1;
            forwardVector.z = forwardVector.z * -1;
        }

        // Start the character's animation
        if (direction === 'front') {
            this.velocity = forwardVector.scale(3);
            this.updateAnimation('walk');
        } else if (direction === 'back') {
            this.velocity = forwardVector.scale(0.5 * 3);
            this.updateAnimation('walk-back');
        }
    },

    stop() {
        if (this.isPlayingGrab) return; // Don't stop if grab animation is playing

        // Stop moving the object
        this.velocity = null;

        // Stop the animation
        this.characterModel.setAttribute('animation-mixer', {
            clip: 'idle',
            crossFadeDuration: 0.2,
        });
    },

    tick(time, timeDelta) {
        switch (this.turning) {
            case 'left':
                this.rotationY = this.rotationY + 0.12 * timeDelta;
                this.characterModel.setAttribute('rotation', { x: 0, y: this.rotationY, z: 0 });
                break;
            case 'right':
                this.rotationY = this.rotationY - 0.12 * timeDelta;
                this.characterModel.setAttribute('rotation', { x: 0, y: this.rotationY, z: 0 });
                break;
            default:
                break;
        }
        if (this.velocity !== null) {
            let rotationYRadians = THREE.MathUtils.degToRad(this.rotationY);
            let forwardX = Math.sin(rotationYRadians);
            let forwardZ = Math.cos(rotationYRadians);
            let forwardVector = new CANNON.Vec3(forwardX, 0, forwardZ);
            forwardVector.normalize();

            let speedMod = 1;

            if (this.isWalking) {
                if (this.isSprinting) {
                    speedMod = 2;
                }
            } else if (this.isBacking) {
                forwardVector.x = forwardVector.x * -1;
                forwardVector.z = forwardVector.z * -1;
                speedMod = 0.5;
            }
            let velocityVector = forwardVector.scale(3 * speedMod);

            // Apply the velocity to the character's physics body
            this.el.body.velocity.copy(velocityVector);
        }

        // Drain battery if flashlight is on
        if (this.isFlashlightOn && this.flashlightBattery > 0) {
            this.flashlightBattery -= 0.002 * timeDelta; // Adjust number for faster/slower drain

            // Check if battery is empty and turn off flashlight
            if (this.flashlightBattery <= 0) {
                this.isFlashlightOn = false;
                const flashlightEl = document.querySelector('#flashlight');
                flashlightEl.setAttribute('visible', false);
                this.flashlightBattery = 0;
            }

            this.updateBatteryDisplay();
        }

        // Drain stamina if sprinting
        if (this.isSprinting && this.isWalking && this.stamina > 0) {
            this.stamina -= 0.02 * timeDelta; // Adjust number for faster/slower drain
            // Check if stamina is empty and stop sprinting
            if (this.stamina <= 0) {
                this.isSprinting = false;
                this.stamina = 0;
                this.updateAnimation('walk');
            }
        } else {
            if (this.stamina < 100) {
                this.stamina += 0.04 * timeDelta;
            }
            if (this.stamina > 100) {
                this.stamina = 100;
            }
        }
        this.updateStaminaDisplay();
    },

    toggleKeyFoundImage(shouldShow) {
        const image = document.getElementById('bottom-right-image-found');
        image.style.display = shouldShow? 'block' : 'none';
    },

    toggleKeyNotFoundImage(shouldShow) {
        const image = document.getElementById('bottom-right-image-no');
        image.style.display = shouldShow? 'block' : 'none';
    },

    updateKeyDisplay() {
        const keyDisplay = document.getElementById('key-display');
        if (keyDisplay) {
            keyDisplay.textContent = `Keys found: ${this.keys}/3`;
        }

        if (this.keys === 3) {
            this.toggleKeyFoundImage(true); // Show the "key found" image
            this.toggleKeyNotFoundImage(false); // Hide the "key not found" image
        } else {
            this.toggleKeyFoundImage(false); // Hide the "key found" image
            this.toggleKeyNotFoundImage(true); // Show the "key not found" image
        }
    },


    updateAnimation(animation) {
        this.characterModel.setAttribute('animation-mixer', {
            clip: animation,
            crossFadeDuration: 0.2,
        });
    },

    pauseAnimation() {
        this.characterModel.setAttribute('animation-mixer', {timeScale: 0});
    },

    toggleFlashlight() {
        // Only allow toggling if there's enough battery
        if (this.flashlightBattery > 0) {
            this.isFlashlightOn = !this.isFlashlightOn;
            const flashlightEl = document.querySelector('#flashlight');
            flashlightEl.setAttribute('visible', this.isFlashlightOn);
        } else {
            console.log("No battery power left.");
        }
    },

    updateBatteryDisplay() {
        const batteryDisplay = document.getElementById('battery-display');
        const batteryBar = document.getElementById('battery-bar');
        if (batteryDisplay) {
            batteryDisplay.textContent = `Battery: ${this.flashlightBattery.toFixed(0)}%`;
        }
        if (batteryBar) {
            batteryBar.style.width = `${this.flashlightBattery}%`;
        }
    },

    updateHealthDisplay() {
        const healthDisplay = document.getElementById('health-display');
        const healthBar = document.getElementById('health-bar');
        if (healthDisplay) {
            healthDisplay.textContent = `Health: ${this.health.toFixed(0)}%`;
        }
        if (healthBar) {
            healthBar.style.width = `${this.health}%`;
        }
    },

    updateStaminaDisplay() {
        const staminaDisplay = document.getElementById('stamina-display');
        const staminaBar = document.getElementById('stamina-bar');
        if (staminaDisplay) {
            staminaDisplay.textContent = `Stamina: ${this.stamina.toFixed(0)}%`;
        }
        if (staminaBar) {
            staminaBar.style.width = `${this.stamina}%`;
        }
    },


    checkGameOver() {
        if (this.health <= 0) {
            document.getElementById('game-over').style.display = 'block';
        }
    },

    /*
    processCollision(event) {
        const otherEntity = event.detail.body;

        // Check if the collided entity is an item
        if (!otherEntity.el.hasAttribute('zombie')) {
            return;
        }

        // Do not collide repeatedly with the same entity
        if (this.collisionBodies.includes(otherEntity)) {
            return;
        }

        // Add the entity, which we collided with, to the array, so we can avoid another collision with the same entity
        this.collisionBodies.push(otherEntity);

        // If there is a delay of at least 500ms between the collisions, enable repeated collision with the same entity
        // In other words: remove the collided entity from the array after 500ms if no other collisions happen in the meantime
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(() =>
                this.collisionBodies.splice(0, this.collisionBodies.length),
            500
        );

        // The collision affects the character's health
        this.health = Math.max(this.health - 20, 0);
        console.log('Health', this.health);
        this.updateHealthDisplay();

        if (this.health <= 0) {
            this.disabledControls = true;

            this.updateAnimation('death');

            var soundEntity = document.querySelector('#scream-sound-entity');
            if (soundEntity) {
                soundEntity.components.sound.playSound();
            }


            setTimeout(() => {
                this.pauseAnimation()
                this.checkGameOver();
            }, 3000);
        }

        // Tell the other entity that the collision happened, so it can destroy itself
        otherEntity.el.emit('collide-with-character');
    }
    */
});
