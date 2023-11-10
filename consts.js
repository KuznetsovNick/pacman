const keys = {"LEFT": 97, "RIGHT": 100, "DOWN": 115, "UP": 119, "ESC": 102, "ENTER": 13}

const directions = {
    stop: [0, 0],
    left: [-1, 0],
    right: [1, 0],
    up: [0, -1],
    down: [0, 1]
}

const empty_cell = [0, 11]
const dot_cell = [1, 1]
const boost_cell = [1, 3]

function getRandomInt(min, max) {
    min = Math.ceil(min);   // Округлить вверх, чтобы исключить минимальное значение
    max = Math.floor(max);  // Округлить вниз, чтобы исключить максимальное значение
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

levels = [
    {
        player: 30,
        ghosts: 36,
        hide: 7
    }, {
        player: 28,
        ghosts: 31,
        hide: 5
    }, {
        player: 26,
        ghosts: 26,
        hide: 3
    }
]