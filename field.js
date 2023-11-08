export default class Field {
    cell_size = 8
    width = 28
    height = 31
    map
    divs = []
    constructor() {
        fetch("map.tmj").then(res => res.json()).then(json => {
            this.map = json
            this.draw_field()
        })
        fetch("map.json")
            .then(res => res.json())
            .then(json => {
                this.map = json.map
            })
    }

    draw_field(){
        const mapContainer = document.getElementById('map-container');

        for (let y = 0; y < this.height; y++) {
            this.divs.push([])
            for (let x = 0; x < this.width; x++) {
                const tileValue = this.map.layers[0].data[y * this.width + x] - 1;
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.style.width = `${this.cell_size}px`;
                tile.style.height = `${this.cell_size}px`;
                tile.style.backgroundImage = `url('sprites.png')`;
                let img_width = this.width*3 + 1
                tile.style.backgroundPosition =
                    `-${(tileValue % img_width) * this.cell_size}px -${Math.floor(tileValue/img_width) * this.cell_size}px`;

                tile.style.top = `${y * this.cell_size}px`;
                tile.style.left = `${x * this.cell_size}px`;

                tile.style.position = "absolute"
                tile.style.zIndex = "-1"
                this.divs[y].push(tile)
                mapContainer.appendChild(tile);
            }
        }
    }

    check_move(x, y){
        return !!this.map[y][x];
    }

    on_cell(x, y){
        this.divs[y][x].style.backgroundPosition = `-${empty_cell[0] * this.cell_size}px -${empty_cell[1] * this.cell_size}px`
        let value
        switch (this.map[y][x]) {
            case 1:
                value = 0
                break
            case 2:
                value = 10
                break
            case 3:
                value = 50
                break
        }
        this.map[y][x] = 1
        return value
    }
}