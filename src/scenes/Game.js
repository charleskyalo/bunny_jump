import Phaser from '../lib/phaser.js'
export default class Game extends Phaser.Scene {
    constructor() {
        /* unique key  for each scene*/
        super('game')
    }

    /** @type { Phaser.Physics.Arcade.Sprite } */
    player;
    platforms
    cursors

    /* preload and create methods are hooks called at various time by phaser
    
    preload is called to specify images audio or assets to load before starting the scene
    */

    preload() {
        this.load.image('background', 'assets/bg_layer1.png');

        /* load platform image */
        this.load.image('platform', 'assets/ground_grass.png');

        /* load the player */
        this.load.image('bunny-stand', 'assets/bunny1_stand.png');
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    /* 
    create is called once all the assets have been loaded
    only assets that have been loaded are used in create

    */

    create() {
        this.add.image(240, 320, 'background')
            .setScrollFactor(1, 0);
        /* 
        By setting the y axis with a scroll factor to 0  
        keep the background from scrolling up and down with the camera.
        */

        /* creating a static group  */
        this.platforms = this.physics.add.staticGroup();

        // create 5 platforms from the group
        for (let i = 0; i < 5; ++i) {
            const x = Phaser.Math.Between(80, 400);
            const y = 150 * i;
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x, y, 'platform');
            platform.scale = 0.5;
            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body;
            body.updateFromGameObject();
        }
        // add  the bunny to the screen
        this.player = this.physics.add.sprite(240, 320, 'bunny-stand')
            .setScale(0.5);
        this.physics.add.collider(this.platforms, this.player);
        /*check for collision only for descentiong bunny */
        this.player.body.checkCollision.up = false;
        this.player.body.checkCollision.left = false;
        this.player.body.checkCollision.right = false;


        // follow the player using the camera
        this.cameras.main.startFollow(this.player);

        /* set the camera deathzone */
        this.cameras.main.setDeadzone(this.scale.width * 1.5);
    }
    update() {
        /* find out from the arcade player if the player physics body is touching something from beneath */
        const touchingDown = this.player.body.touching.down;
        if (touchingDown) {
            this.player.setVelocityY(-300);
        }


        // left and right logic 

        if (this.cursors.left.isDown && !touchingDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown && !touchingDown) {
            this.player.setVelocityX(200);
        } else {
            this.player.setVelocityX(0)
        }



        /** @type {Phaser.Physics.Arcade.Sprite} */
        this.platforms.children.iterate(child => {
            const platform = child;
            const scrollY = this.cameras.main.scrollY;
            if (platform.y >= scrollY + 700) {
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()
            }
        })
        this.horizontalWrap(this.player);
    }
    horizontalWrap(sprite) {
        const halfWidth = sprite.displayWidth * 0.5;
        const gameWidth = this.scale.width;
        if (sprite.x < -halfWidth) {
            sprite.x = gameWidth + halfWidth;
        } else if (sprite.x > gameWidth + halfWidth) {
            sprite.x = -halfWidth;
        }
    }
}