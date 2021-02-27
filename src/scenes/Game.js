import Phaser from '../lib/phaser.js'
export default class Game extends Phaser.Scene {
    constructor() {
        /* unique key  for each scene*/
        super('game')
    }

    /* preload and create methods are hooks called at various time by phaser
    
    preload is called to specify images audio or assets to load before starting the scene
    */

    preload() {
        this.load.image('background', 'assets/bg_layer1.png');

        /* load platform image */
        this.load.image('platform', 'assets/ground_grass.png');
    }
    /* 
    create is called once all the assets have been loaded
    only assets that have been loaded are used in create

    */

    create() {
        this.add.image(240, 320, 'background');

        // add platform
        this.physics.add.image(240, 320, 'platform').setScale(0.5);
    }
}