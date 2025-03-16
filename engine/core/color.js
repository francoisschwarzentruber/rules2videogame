function randomInt(x) {
    return Math.floor(x * Math.random());
}

export class Color {

    static random(r = 0, g = 0, b = 0, a = 255) {
        function rand(x, a) {
            const v = x + randomInt(a);
            if (v < 0) return 0;
            if (v > 255)
                return 255;
            return v;
        }
        return `rgb(${rand(r, a)}, ${rand(g, a)}, ${rand(b, a)})`;
    }


}