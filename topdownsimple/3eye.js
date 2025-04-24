if (X.eye == true) {
    X.disk = true;
    X.color = "white";
    X.stroke = "black";
    X.radius = 8;
    X.eyeinside = {
        disk: true,
        position: { x: X.position.x + 4 * X.direction.x, y: X.position.y + 4 * X.direction.y },
        radius: 4,
        color: "black",
    };
}
