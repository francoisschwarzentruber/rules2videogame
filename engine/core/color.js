function randomInt(x) {
    return Math.floor(x * Math.random());
}

export class Color {
    static random() {
        return `rgb(${randomInt(255)}, ${randomInt(255)}, ${randomInt(255)})`;
    }
}