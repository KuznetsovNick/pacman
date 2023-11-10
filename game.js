

export default class Game{
    field
    player
    controller
    score
    blinky
    pinky
    clyde
    dots = 0
    boosts = 0
    player_interval
    ghosts_interval
    pause
    info
    restart_btn
    level = 0
    level_div
    user_name_div
    change_user
    condition = this.play

    constructor(field, player, controller, blinky, pinky, inky, clyde) {
        this.pause = document.getElementById("pause")
        this.pause.innerHTML = "pause"
        this.pause.onclick = () => {this.pause_function()}

        this.info = document.getElementById("game_over")
        this.info.hidden = true

        this.restart_btn = document.getElementById("restart")
        this.restart_btn.onclick = () => {
            this.update()
            this.pinky.went_from_home()
            this.play()
        }

        this.level_div = document.getElementById("level")

        this.score = document.getElementById("score")
        this.score.innerHTML = "0"

        this.user_name_div = document.getElementById("user_name")

        this.change_user = document.getElementById("change_user")
        this.change_user.onclick = () => {
            this.authorization.bind(this)()
        }

        this.field = field
        this.player = player
        this.controller = controller

        this.blinky = blinky
        this.pinky = pinky
        this.inky = inky
        this.clyde = clyde

        document.addEventListener("keypress", (event) => {
            this.controller.handling(event, this.field, this.player);
        })
    }

    pause_function(){
        if(this.condition === this.play){
            this.stop()
            this.pause.innerHTML = "play"
            this.condition = this.stop
            this.restart_btn.hidden = false
            this.change_user.hidden = false
        } else {
            this.play()
            this.pause.innerHTML = "pause"
            this.condition = this.play
            this.restart_btn.hidden = true
            this.change_user.hidden = true
        }
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
                this.boosts++
                this.ghosts_hide()
                //this.ghosts_reverse()
                clearInterval(this.ghosts_interval)
                this.ghosts_interval = setInterval(() => this.ghosts_run(), levels[this.level].ghosts * 1.4)
                setTimeout(() => {
                    clearInterval(this.ghosts_interval)
                    this.ghosts_interval = setInterval(() => this.ghosts_run(), levels[this.level].ghosts)
                    this.ghosts_chase()
                }, levels[this.level].hide*1000)
            }else if(value === 10){
                this.dots++
                if(this.dots === 30){
                    this.inky.went_from_home()
                }
                if(this.dots === 80){
                    this.clyde.went_from_home()
                }
            }
            if(this.dots === 240 && this.boosts === 4){
                if(this.level === 2){
                    this.you_win()
                } else {
                    this.stop()
                    this.info.innerHTML = `level ${this.level+2}`
                    this.info.hidden = false
                    setTimeout(() => {
                        this.info.hidden = true
                        this.level++
                        this.level_div.innerHTML = `level ${this.level+1}`
                        this.update()
                        this.play()
                    }, 3000)
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
        this.player_interval = setInterval(() => this.player_movement(), levels[this.level].player)
        this.ghosts_interval = setInterval(() => this.ghosts_run(), levels[this.level].ghosts)
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
                    ghost.div.hidden = true
                    let dead = 0
                    let sprite = [63, 0]
                    this.stop()
                    let interval = setInterval(() => {
                        this.player.div.style.backgroundPosition = `-${sprite[0] * 8}px
                            -${sprite[1] * 8}px`
                        sprite[0] += 2
                        dead++
                        if(dead === 11) {
                            this.game_over()
                            ghost.div.hidden = false
                            clearInterval(interval)
                        }
                    }, 100)
                } else {
                    switch (ghost){
                        case this.blinky:
                            this.score.innerHTML = (Number(this.score.innerHTML) + 200).toString()
                            break
                        case this.pinky:
                            this.score.innerHTML = (Number(this.score.innerHTML) + 400).toString()
                            break
                        case this.inky:
                            this.score.innerHTML = (Number(this.score.innerHTML) + 800).toString()
                            break
                        case this.clyde:
                            this.score.innerHTML = (Number(this.score.innerHTML) + 1600).toString()
                            break
                    }
                    ghost.back_to_home(1000)
                }
            }
        }
    }

    finish(){
        this.write_to_top()
        this.stop()
        this.level = 0
        this.pause.hidden = true
        this.score.hidden = true
        this.user_name_div.hidden = true
        this.info.hidden = false
        this.restart_btn.hidden = false
        this.change_user.hidden = false
        clearInterval(this.player_interval)
        clearInterval(this.ghosts_interval)
    }

    game_over(){
        this.info.innerHTML = `Game over ${Number(this.score.innerHTML)}`
        this.finish()
    }

    you_win(){
        this.info.innerHTML = `You win! ${Number(this.score.innerHTML)}`
        this.finish()
    }

    update(){
        this.stop()
        this.pause.hidden = false
        this.score.hidden = false
        this.user_name_div.hidden = false
        this.info.hidden = true
        this.restart_btn.hidden = true
        this.change_user.hidden = true
        if(this.level === 0) {
            this.level_div.innerHTML = "level 1"
            this.score.innerHTML = "0"
        }

        this.field.update()
        this.player.back_to_spawn()

        this.dots = 0
        this.boosts = 0

        this.blinky.is_active = true
        this.blinky.back_to_home()

        this.pinky.behaviour = this.pinky.chase
        this.pinky.is_active = false
        this.pinky.back_to_home(0, false)

        this.inky.behaviour = this.inky.chase
        this.inky.is_active = false
        this.inky.back_to_home(0, false)

        this.clyde.behaviour = this.clyde.chase
        this.clyde.is_active = false
        this.clyde.back_to_home(0, false)
        this.condition = this.play
        this.pause.innerHTML = "pause"
    }
    authorization(){
        let user = document.getElementById("user")
        user.value = ""
        console.log(user.value)
        let start = document.getElementById("start")
        this.fill_top()

        this.pause.hidden = true
        this.restart_btn.hidden = true
        this.level_div.hidden = true
        this.score.hidden = true
        this.user_name_div.hidden = true
        this.change_user.hidden = true
        user.hidden = false
        start.hidden = false
        start.onclick = () => {
            if(user.value) {
                this.user_name_div.innerHTML = user.value
                this.user_name_div.hidden = false
                this.pause.hidden = false
                this.level_div.hidden = false
                this.score.hidden = false
                user.hidden = true
                start.hidden = true

                this.update()
                this.play()
                this.pinky.went_from_home()
            } else {
                alert("Enter name")
            }
        }
    }

    fill_top(){
        let top = JSON.parse(localStorage.getItem("top"))
        if(!top) return
        document.getElementById("1place").innerHTML = `1 ${top[0][1]}: ${top[0][0]}`
        if(top.length > 1) document.getElementById("2place").innerHTML = `2 ${top[1][1]}: ${top[1][0]}`
        if(top.length > 2)document.getElementById("3place").innerHTML = `3 ${top[2][1]}: ${top[2][0]}`
    }

    write_to_top(){
        let score = Number(this.score.innerHTML)
        let name = this.user_name_div.innerHTML
        let top = JSON.parse(localStorage.getItem("top"))
        if(!top){
            top = []
        }
        top.push([score, name])
        for(let i = top.length-1; i > 0; i--){
            if(top[i][0] > top[i-1][0]){
                let cur = top[i-1]
                top[i-1] = top[i]
                top[i] = cur
            }
        }
        if(top.length === 4){
            top.pop()
        }
        localStorage.setItem("top", JSON.stringify(top))

        this.fill_top()
    }
}