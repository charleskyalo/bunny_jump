import Phaser from '../lib/phaser.js';

export default class GameOver extends Phaser.Scene {

    constructor() {
        super('game-over')
    }
    image

    preload() {
        this.load.image('background', 'assets/bg_layer1.png');

    }

    create() {

        this.image = this.add.image(240, 320, 'background')
            .setScrollFactor(1, 0);
        const width = this.scale.width;
        const height = this.scale.height;
        this.add.text(width * 0.5, height * 0.5, `      Game Over  😥 \n click anywhere to start again
        `, {
            fontSize: 24,
            color: "#000"
        })
            .setOrigin(0.5);



        // playable in desktop devices
        /*  this.input.keyboard.once('keydown-SPACE', () => {
             this.scene.start('game');
         }) */
        this.image.setInteractive();
        this.image.on('pointerup', () => {
            this.scene.start('game');
        })


    }
}