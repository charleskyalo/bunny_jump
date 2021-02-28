import Phaser from '../lib/phaser.js';
export default class StartGame extends Phaser.Scene {
    constructor() {
        super('start-game');
    }

    screen

    preload() {
        this.load.image('screenBg', 'assets/bunnyJumper.png')
    }
    create() {
        this.screen = this.add.image(240, 320, 'screenBg')
            .setScale(0.25)
            .setScrollFactor(1, 0);
        /*  const width = this.scale.width;
         const height = this.scale.height;
         this.add.text(width * 0.5, height * 0.5, `Help bunny collect carots`, {
             fontSize: 24,
             color: "#000"
         })
             .setOrigin(0.5); */

        this.screen.setInteractive();

        this.screen.on('pointerup', () => {
            this.scene.stop('start-game');
            this.scene.start('game');
        })
    }

}