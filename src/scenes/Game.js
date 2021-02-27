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

    }
    /* 
    create is called once all the assets have been loaded
    only assets that have been loaded are used in create

    */
    
    create() {

    }
}