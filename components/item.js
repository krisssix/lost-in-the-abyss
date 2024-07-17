AFRAME.registerComponent('item', {
    init() {
        const itemType = this.el.getAttribute('item');

        this.el.addEventListener('collide-with-character', () => {
            switch (itemType) {
                case 'battery':
                    console.log('Battery picked up!');
                    this.el.emit('battery-picked-up');
                    break;
                case 'healthPotion':
                    console.log('Health Potion picked up!');
                    this.el.emit('health-potion-picked-up');
                    break;
                default:
                    console.log('Unknown item type:', itemType);
            }
            // Optionally hide the item in the scene
            parent.removeChild(this.el);

        });
    }
});
