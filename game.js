export default class Game{
    field
    player
    controller
    score
    blinky
    pinky
    clyde
    dots = 0
    player_interval
    ghosts_interval

    constructor(field, player, controller, blinky, pinky, inky, clyde) {
        this.field = field
        this.player = player
        this.controller = controller
        let div = document.createElement("div")
        this.score = div
        div.id = "score"
        div.innerHTML = "0"
        document.body.appendChild(div)
        this.blinky = blinky
        this.pinky = pinky
        this.inky = inky
        this.clyde = clyde
    }

    player_movement(){
        if(this.player.direction[0] === !this.player.wanted_direction[0] || this.player.direction[1] === !this.player.wanted_direction[1]){
            this.player.set_direction(this.player.wanted_direction)
        }
        if(this.field.check_move(this.player.x + this.player.wanted_direction[0],
                this.player.y + this.player.wanted_direction[1]) &&
            !this.player.cell_x && !this.player.cell_y){
            this.player.set_direction(this.player.wanted_direction)
        }

        if(this.field.check_move(this.player.x + this.player.direction[0], this.player.y + this.player.direction[1])){
            this.player.move()
            let value = this.field.on_cell(this.player.x, this.player.y)
            this.score.innerHTML =(Number(this.score.innerHTML) + value).toString()
            if(value === 50){
                this.ghosts_reverse()
                this.ghosts_hide()
                setTimeout(() =>  this.ghosts_chase(), 10000)
            }
            if(value === 10){
                this.dots++
                if(this.dots === 10){
                    this.inky.went_from_home()
                }
                if(this.dots === 20){
                    this.clyde.went_from_home()
                }
            }
        } else {
            this.player.check_teleport()
        }
        this.check_stop(this.blinky)
        this.check_stop(this.pinky)
        this.check_stop(this.inky)
        this.check_stop(this.clyde)
    }

    play(){
        this.player_interval = setInterval(() => this.player_movement(), 30)
        this.ghosts_interval = setInterval(() => this.ghosts_run(), 34)
        document.addEventListener("keypress", (event) => {
            this.controller.handling(event, this.field, this.player);
        })
    }

    stop(){
        clearInterval(this.player_interval)
        clearInterval(this.ghosts_interval)
    }

    ghosts_run(){
        if(this.blinky.is_active) this.blinky.run()
        if(this.pinky.is_active) this.pinky.run()
        if(this.inky.is_active) this.inky.run()
        if(this.clyde.is_active) this.clyde.run()
    }

    ghosts_chase(){
        if(this.blinky.is_active) this.blinky.behaviour = this.blinky.chase
        if(this.pinky.is_active) this.pinky.behaviour = this.pinky.chase
        if(this.inky.is_active) this.inky.behaviour = this.inky.chase
        if(this.clyde.is_active) this.clyde.behaviour = this.clyde.chase
    }

    ghosts_hide(){
        if(this.blinky.is_active) this.blinky.behaviour = this.blinky.hide
        if(this.pinky.is_active) this.pinky.behaviour = this.pinky.hide
        if(this.inky.is_active) this.inky.behaviour = this.inky.hide
        if(this.clyde.is_active) this.clyde.behaviour = this.clyde.hide
    }

    ghosts_reverse(){
        if(this.blinky.is_active) this.blinky.reverse()
        if(this.pinky.is_active) this.pinky.reverse()
        if(this.inky.is_active) this.inky.reverse()
        if(this.clyde.is_active) this.clyde.reverse()
    }

    check_stop(ghost){
        if(ghost.is_active) {
            let p_x = this.player.x * 8 + this.player.cell_x
            let p_y = this.player.y * 8 + this.player.cell_y
            let g_x = ghost.x * 8 + ghost.cell_x
            let g_y = ghost.y * 8 + ghost.cell_y
            if (Math.abs(p_x - g_x) < 8 && Math.abs(p_y - g_y) < 8) {
                if (ghost.behaviour === ghost.chase) {
                    this.stop()
                } else {
                    ghost.back_to_home()
                }
            }
        }
    }
}