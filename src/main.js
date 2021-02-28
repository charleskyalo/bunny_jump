import Phaser from './lib/phaser.js';

/* import Game scene */
import Game from './scenes/Game.js';
import GameOver from './scenes/GameOver.js';
import StartGame from './scenes/StartGame.js';
export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    scene: [StartGame, Game, GameOver],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            },
            debug: false
        }
    }
})