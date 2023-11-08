import Field from './field.js';
import Player from './player.js';
import Controller from "./controller.js"
import Game from "./game.js"
import Blinky from "./ghosts/blinky.js"
import Pinky from "./ghosts/pinky.js";
import Inky from "./ghosts/inky.js";
import Clyde from "./ghosts/clyde.js";

const field = new Field()
const player = new Player()
const connroller = new Controller()
const blinky = new Blinky(field, player)
const pinky = new Pinky(field, player)
const inky = new Inky(field, player, blinky)
const clyde = new Clyde(field, player)
const game = new Game(field, player, connroller, blinky, pinky, inky, clyde)
game.play()