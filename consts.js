const keys = {"LEFT": 97, "RIGHT": 100, "DOWN": 115, "UP": 119, "ESC": 102, "ENTER": 13}

const directions = {
    stop: [0, 0],
    left: [-1, 0],
    right: [1, 0],
    up: [0, -1],
    down: [0, 1]
}

const empty_cell = [0, 11]

function getRandomInt(min, max) {
    min = Math.ceil(min);   // Округлить вверх, чтобы исключить минимальное значение
    max = Math.floor(max);  // Округлить вниз, чтобы исключить максимальное значение
    return Math.floor(Math.random() * (max - min + 1)) + min;
}