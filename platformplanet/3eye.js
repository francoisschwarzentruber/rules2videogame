//@init
if (X.eye == true) {
    X.disk = true;
    X.color = "white";
    X.radius = 8;
}

if (X.eye == true) {
    X.eyeinside = {
        disk: true,
        position: { x: X.position.x + 4 * X.direction.x, y: X.position.y + 4 * X.direction.y },
        radius: 4,
        color: "black"
    };
}
