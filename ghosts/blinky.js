const sprites = {
    right: [[57, 8], [59, 8]],
    left: [[61, 8], [63, 8]],
    up: [[65, 8], [67, 8]],
    down: [[69, 8], [71, 8]],
    hide: [[73, 8], [75, 8]]
}

// const mods = {
//     chase:
// }
export default class Blinky{
    size = 16
    cell_size = 8
    start_x = 14
    start_y = 11
    img_offset = 4
    x = this.start_x
    y = this.start_y
    cell_x = 0
    cell_y = 0
    direction = directions.right
    sprite = sprites.right
    player
    field
    behaviour = this.chase
    target_cell = [27, 0]
    is_active = true
    constructor(field, player) {
        const mapContainer = document.getElementById('map-container');
        this.div = document.createElement('div');
        this.div.id = "blinky"

        this.div.style.width = `${this.size}px`;
        this.div.style.height = `${this.size}px`;
        this.div.style.backgroundImage = `url('sprites.png')`;
        this.div.style.backgroundPosition = `-${this.sprite[0][0] * this.cell_size}px -${this.sprite[0][1] * this.cell_size}px`
        this.div.style.left = `${this.start_x * this.cell_size - this.img_offset}px`
        this.div.style.top = `${this.start_y * this.cell_size - this.img_offset}px`
        this.div.style.position = "absolute"
        mapContainer.appendChild(this.div);
        this.player = player
        this.field = field
    }

    move(){
        if((this.x === 0 && this.y === 14)){
            this.x = 26
        }
        if((this.x === 27 && this.y === 14)){
            this.x = 1
        }

        this.cell_x += this.direction[0]
        this.cell_y += this.direction[1]

        if (this.cell_x % this.cell_size === 0) {
            this.cell_x = 0
            this.x += this.direction[0]
        }
        if (this.cell_y % this.cell_size === 0) {
            this.cell_y = 0
            this.y += this.direction[1]
        }

        let sprite_num = Math.floor(Math.abs((this.cell_x + this.cell_y)) / 4)

        if(sprite_num < 2) this.div.style.backgroundPosition = `-${this.sprite[sprite_num][0] * this.cell_size}px
         -${this.sprite[sprite_num][1] * this.cell_size}px`
        this.div.style.left = `${this.x * this.cell_size - this.img_offset + this.cell_x}px`
        this.div.style.top = `${this.y * this.cell_size - this.img_offset + this.cell_y}px`
    }

    get_vars_dirs(){
        let dirs = []
        let vars = []
        if(this.direction !== directions.left && this.field.check_move(this.x + 1, this.y)) {
            vars.push([this.x + 1, this.y])
            dirs.push(directions.right)
        }
        if(this.direction !== directions.right && this.field.check_move(this.x - 1, this.y)){
            vars.push([this.x - 1, this.y])
            dirs.push(directions.left)
        }
        if(this.direction !== directions.up && this.field.check_move(this.x, this.y + 1)){
            vars.push([this.x, this.y + 1])
            dirs.push(directions.down)
        }
        if(this.direction !== directions.down && this.field.check_move(this.x, this.y - 1)){
            vars.push([this.x, this.y - 1])
            dirs.push(directions.up)
        }
        return [vars, dirs]
    }

    chase(){
        if(this.cell_x === 0 && this.cell_y === 0){
            let f = this.get_vars_dirs()
            let vars = f[0]
            let dirs = f[1]
            let min_len = 1000
            let dir = -1
            for(let i = 0; i < vars.length; i++){
                let cur_len = Math.sqrt(Math.pow((vars[i][0] - this.player.x), 2) + Math.pow((vars[i][1] - this.player.y), 2))
                if(cur_len < min_len){
                    min_len = cur_len
                    dir = dirs[i]
                }
            }
            if(dir !== -1) this.direction = dir
            if(dir[0] === 1){
                this.sprite = sprites.right
            } else if(dir[0] === -1){
                this.sprite = sprites.left
            } else if(dir[1] === 1){
                this.sprite = sprites.down
            } else if(dir[1] === -1){
                this.sprite = sprites.up
            }
        }
        this.move()
    }
    hide(){
        this.sprite = sprites.hide
        if(this.cell_x === 0 && this.cell_y === 0){
            let f = this.get_vars_dirs()
            let vars = f[0]
            let dirs = f[1]
            let min_len = 1000
            let dir = -1
            for(let i = 0; i < vars.length; i++){
                let cur_len = Math.sqrt(Math.pow((vars[i][0] - this.target_cell[0]), 2) + Math.pow((vars[i][1] - this.target_cell[1]), 2))
                if(cur_len < min_len){
                    min_len = cur_len
                    dir = dirs[i]
                }
            }
            if(dir !== -1) this.direction = dir
        }
        this.move()
    }

    run(){
        switch (this.behaviour){
            case this.chase:
                this.chase()
                break
            case this.hide:
                this.hide()
                break
        }
    }

    reverse(){
        this.direction = [-this.direction[0], -this.direction[1]]
        this.cell_x += this.direction[0]*this.cell_size
        this.cell_y += this.direction[1]*this.cell_size
        this.x -= this.direction[0]
        this.y -= this.direction[1]
    }

    back_to_home(){
        this.div.hidden = true
        this.is_active = false
        setTimeout(() => {
            this.is_active = true
            this.behaviour = this.chase
            this.x = this.start_x
            this.y = this.start_y
            this.cell_x = 0
            this.cell_y = 0
            this.div.style.left = `${this.x * this.cell_size - this.img_offset + this.cell_x}px`
            this.div.style.top = `${this.y * this.cell_size - this.img_offset + this.cell_y}px`
            this.div.hidden = false
        }, 1000)
    }
}