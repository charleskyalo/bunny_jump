import Phaser from '../lib/phaser.js'

/* import carrot  */
import Carrot from '../game/Carrot.js'

export default class Game extends Phaser.Scene {
    constructor() {
        /* unique key  for each scene*/
        super('game')
    }
    /** @type { Phaser.Physics.Arcade.Sprite } */
    player
    platforms
    cursors
    carrots
    carrotsCollected = 0
    carrotsCollectedText
    isClicking = false

    /* preload and create methods are hooks called at various time by phaser
    
    preload is called to specify images audio or assets to load before starting the scene
    */

    init() {
        this.carrotsCollected = 0;
    }

    preload() {
        this.load.image('background', 'assets/bg_layer1.png');

        /* load platform image */
        this.load.image('platform', 'assets/ground_grass.png');

        /* load the player */
        this.load.image('bunny-stand', 'assets/bunny1_stand.png');
        this.load.image('bunny-jump', 'assets/bunny1_jump.png');
        /* load carrot */
        this.load.image('carrot', 'assets/carrot.png');
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

        // create a carrot
        this.carrots = this.physics.add.group({
            classType: Carrot
        })

        this.carrots.get(240, 320, 'carrot');
        // add this collider
        this.physics.add.collider(this.platforms, this.carrots);

        this.physics.add.overlap(
            this.player,
            this.carrots,
            this.handleCollectCarrot,//called on overlap
            undefined,
            this
        )

        const style = { color: "#000", fontSize: 24 }
        this.carrotsCollectedText = this.add.text(240, 10, `Carrots: 0 `, style)
            .setScrollFactor(0)
            .setOrigin(0.5, 0);
    }
    update() {
        /* find out from the arcade player if the player physics body is touching something from beneath */
        const touchingDown = this.player.body.touching.down;
        if (touchingDown) {
            this.player.setVelocityY(-300);
            this.player.setTexture('bunny-jump');
        }
        const vy = this.player.body.velocity.y;
        if (vy > 0 && this.player.texture.key !== 'bunny-stand') {
            this.player.setTexture('bunny-stand')
        }


        // left and right logic

        /*
        left and right arrow key for the desktop

          if (this.cursors.left.isDown && !touchingDown) {
              this.player.setVelocityX(-200);
          } else if (this.cursors.right.isDown && !touchingDown) {
              this.player.setVelocityX(200);
          } else {
              this.player.setVelocityX(0)
          }
          */

        /* game input with touch pointer */
        if (!this.input.activePointer.isDown && this.isClicking == true) {
            this.player.x = this.input.activePointer.position.x;
            this.isClicking = false;
        } else if (this.input.activePointer.isDown && this.isClicking == false) {
            this.isClicking = true;
        }


        /** @type {Phaser.Physics.Arcade.Sprite} */
        this.platforms.children.iterate(child => {
            const platform = child;
            const scrollY = this.cameras.main.scrollY;
            if (platform.y >= scrollY + 700) {
                platform.y = scrollY - Phaser.Math.Between(50, 80)
                platform.body.updateFromGameObject();

                // create a carrot above the reused platform
                this.addCarrotAbove(platform);
            }
        })
        this.horizontalWrap(this.player);


        const bottomPlatform = this.findBottomMostPlatform();
        if (this.player.y > bottomPlatform.y + 200) {
            this.scene.start('game-over');
        }
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
    addCarrotAbove(sprite) {

        /**
        * @param {Phaser.GameObjects.Sprite} sprite
        */

        const y = sprite.y - sprite.displayHeight;
        /** @type {Phaser.Physics.Arcade.Sprite} */
        const carrot = this.carrots.get(sprite.x, y, 'carrot')

        // set active and visible
        carrot.setActive(true);
        carrot.setVisible(true);

        this.add.existing(carrot);
        // update the carrots physical body size;
        carrot.body.setSize(carrot.width, carrot.height);

        // making sure the carrots body is enabledin the physics world
        this.physics.world.enable(carrot);
        return carrot;
    }
    handleCollectCarrot(player, carrot) {
        // hide from display
        this.carrots.killAndHide(carrot);
        // disable from physics word
        this.physics.world.disableBody(carrot.body);

        // increment carrots collected;

        /* create new value and set it */
        const value = `Carrots :${this.carrotsCollected}`
        this.carrotsCollected += 1;
        this.carrotsCollectedText.text = value;
    }


    findBottomMostPlatform() {
        const platforms = this.platforms.getChildren();
        let bottomPlatform = platforms[0];
        for (let i = 1; i < platforms.length; i++) {
            const platform = platforms[i];
            if (platform.y < bottomPlatform.y) {
                continue;
            }
            bottomPlatform = platform;
        }
        return bottomPlatform;
    }

}