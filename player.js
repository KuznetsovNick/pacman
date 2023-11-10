const sprites = {
    start: [[61, 0], [61, 0]],
    right: [[57, 0], [59, 0]],
    left: [[57, 2], [59, 2]],
    up: [[57, 4], [59, 4]],
    down: [[57, 6], [59, 6]]
}
export default class Player{
    size = 16
    cell_size = 8
    start_x = 13
    start_y = 17
    img_offset = 4
    x = this.start_x
    y = this.start_y
    cell_x = 0
    cell_y = 0
    direction = directions.stop
    wanted_direction = directions.stop
    sprite = sprites.start
    constructor() {
        const mapContainer = document.getElementById('map-container');
        const player = document.createElement('div');
        this.div = player
        player.id = "player"

        player.style.width = `${this.size}px`;
        player.style.height = `${this.size}px`;
        player.style.backgroundImage = `url('sprites.png')`;
        player.style.backgroundPosition = `-${this.sprite[0][0] * this.cell_size}px -${this.sprite[0][1] * this.cell_size}px`
        player.style.left = `${this.start_x * this.cell_size - this.img_offset}px`
        player.style.top = `${this.start_y * this.cell_size - this.img_offset}px`
        player.style.position = "absolute"
        mapContainer.appendChild(player);
    }

    check_teleport(){
        if((this.x === 0 && this.y === 14)){
            this.x = 26
            this.div.style.left = `${this.x * this.cell_size - this.img_offset + this.cell_x}px`
        }else if((this.x === 27 && this.y === 14)){
            this.x = 1
            this.div.style.left = `${this.x * this.cell_size - this.img_offset + this.cell_x}px`
        }
    }
    move() {
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

        this.div.style.backgroundPosition = `-${this.sprite[sprite_num][0] * this.cell_size}px
         -${this.sprite[sprite_num][1] * this.cell_size}px`
        this.div.style.left = `${this.x * this.cell_size - this.img_offset + this.cell_x}px`
        this.div.style.top = `${this.y * this.cell_size - this.img_offset + this.cell_y}px`
    }

    set_direction(dir){
        this.direction = dir
        if(dir[0] === -1)
            this.sprite = sprites.left
        if(dir[0] === 1)
            this.sprite = sprites.right
        if(dir[1] === 1)
            this.sprite = sprites.down
        if(dir[1] === -1)
            this.sprite = sprites.up
    }

    back_to_spawn(){
        this.x = this.start_x
        this.y = this.start_y
        this.cell_x = 0
        this.cell_y = 0
        this.sprite = sprites.start
        this.direction = directions.stop
        this.wanted_direction = directions.stop
        this.div.style.left = `${this.start_x * this.cell_size - this.img_offset}px`
        this.div.style.top = `${this.start_y * this.cell_size - this.img_offset}px`
    }
}