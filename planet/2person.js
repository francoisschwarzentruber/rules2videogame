//@init
if (X.person) {
    X.disk = true;
    X.radius = 32;
    X.eye = { eye: true, position: { x: 0, y: 0 } };
}

if (X.person) {
    X.eye.direction = X.direction;
    X.eye.position.x = X.position.x + 16 * X.direction.x;
    X.eye.position.y = X.position.y + 16 * X.direction.y;
}


