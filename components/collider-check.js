AFRAME.registerComponent('collider-check', {
    dependencies: ['raycaster'],

    init() {
        this.el.addEventListener('raycaster-intersection', event => {
            console.log('Player hit something!', event.detail.els);
        });
    }
});