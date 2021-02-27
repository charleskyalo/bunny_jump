import Phaser from '../lib/phaser.js'
export default class Game extends Phaser.Scene {
    constructor() {
        /* unique key  for each scene*/
        super('game')
    }

    /** @type { Phaser.Physics.Arcade.Sprite } */
    player


    /* preload and create methods are hooks called at various time by phaser
    
    preload is called to specify images audio or assets to load before starting the scene
    */

    preload() {
        this.load.image('background', 'assets/bg_layer1.png');

        /* load platform image */
        this.load.image('platform', 'assets/ground_grass.png');

        /* load the player */
        this.load.image('bunny-stand', 'assets/bunny1_stand.png')
    }
    /* 
    create is called once all the assets have been loaded
    only assets that have been loaded are used in create

    */

    create() {
        this.add.image(240, 320, 'background');

        /* creating a static group  */
        const platforms = this.physics.add.staticGroup();

        // create 5 platforms from the group
        for (let i = 0; i < 5; ++i) {
            const x = Phaser.Math.Between(80, 400);
            const y = 150 * i;
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = platforms.create(x, y, 'platform');
            platform.scale = 0.5;
            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body;
            body.updateFromGameObject();
        }
        // add  the bunny to the screen
        this.player = this.physics.add.sprite(240, 320, 'bunny-stand')
            .setScale(0.5);
        this.physics.add.collider(platforms, this.player);
        /*check for collision only for descentiong bunny */
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;
    }
    update() {
        /* find out from the arcade player if the player physics body is touching something from beneath */
        const touchingDown = this.player.body.touching.down;
        if (touchingDown) {
            this.player.setVelocityY(-300);
        }
    }
}