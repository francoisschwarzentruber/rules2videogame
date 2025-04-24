import Engine from "./core.js";
const ctx = canvas.getContext("2d");


ctx.font = "bold 24px sans serif";



CanvasRenderingContext2D.prototype.clear = function () {
    this.clearRect(0, 0, 640, 480);
}

CanvasRenderingContext2D.prototype.point = function (x, y) {
    this.beginPath();
    this.arc(x, y, 1, 0, 2 * Math.PI);
    this.fill();
}

CanvasRenderingContext2D.prototype.circle = function (x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0, 2 * Math.PI);
    this.stroke();
}

CanvasRenderingContext2D.prototype.disk = function (x, y, r) {
    this.beginPath();
    this.arc(x, y, r, 0, 2 * Math.PI);
    this.fill();
}

CanvasRenderingContext2D.prototype.line = function (x1, y1, x2, y2) {
    this.beginPath();
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    this.closePath();
    this.stroke();
}



CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
}

CanvasRenderingContext2D.prototype.arrow = function (x, y, angle, S = 16, A = 0.3) {
    ctx.beginPath();
    ctx.moveTo(x - S * Math.cos(angle - A), y - S * Math.sin(angle - A));
    ctx.lineTo(x, y);
    ctx.lineTo(x - S * Math.cos(angle + A), y - S * Math.sin(angle + A));
}





Engine.addRule((X) => {
    if (X.disk && X.position && X.color) {
        ctx.fillStyle = X.color;
        ctx.disk(X.position.x, X.position.y, X.radius);
        /* ctx.strokeStyle = "black";
         ctx.lineWidth = 2;
         ctx.circle(X.position.x, X.position.y, X.radius);*/
    }
});

Engine.addRule((X) => {
    if (X.disk && X.position && X.color && (X.z == 1)) {
        ctx.fillStyle = X.color;
        ctx.disk(X.position.x, X.position.y, X.radius);
        /*ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.circle(X.position.x, X.position.y, X.radius);*/
    }
});


Engine.addRule((X) => {
    if (X.rectangle && X.position && X.color) {
        ctx.fillStyle = X.color;
        ctx.fillRect(X.position.x, X.position.y, X.width, X.height);
    }
});

Engine.addRule((X) => {
    if (X.text && X.position) {
        ctx.fillStyle = X.color ? X.color : "white";
        ctx.font = `bold ${X.size ? X.size : 12}px sans serif`;
        ctx.fillText(X.text, X.position.x, X.position.y);
    }
});




const imgCache = {};

Engine.addRule((X) => {
    if (X.image && (X._img == undefined)) {
        if (imgCache[X.image]) {
            X._img = imgCache[X.image];
            X._imgready = true;
            X.width = X._img.width;
            X.height = X._img.height;
            return;
        }


        if (X.image.endsWith(".png")) {
            X._img = new Image();
            imgCache[X.image] = X._img;
            X._img.src = X.image;
            X._img.onload = () => {
                X._imgready = true;
                X.width = X._img.width;
                X.height = X._img.height;
            }
        }
        else {
            function charToColor(char) {
                const colors = {
                    "R": "red",
                    "b": "blue",
                    "G": "green",
                    "B": "black",
                    "Y": "yellow",
                    "O": "orange"
                }
                return colors[char];
            }


            const canvas = document.createElement("canvas");
            X._img = canvas;
            canvas.width = 32;
            canvas.height = 32;
            X.width = canvas.width;
            X.height = canvas.height;
            X._imgready = true;
            imgCache[X.image] = X._img;

            const ctx = canvas.getContext("2d");
            const string = X.image;

            (string).split("\n").forEach((line, iy) => {
                for (let ix = 0; ix < line.length; ix++) if (line[ix] != " ") {
                    ctx.fillStyle = charToColor(line[ix]);
                    ctx.fillRect(ix, iy, 1, 1);
                }
            });

        }

    }
});


Engine.addRule((X) => {
    if (X.image && X._imgready) {
        ctx.drawImage(X._img, X.position.x, X.position.y);
    }
});
