//@init 
if (X.person) {
    X.disk = true;
    X.solid = true;
    X.radius = 20;
    X.direction = { x: 1, y: 0 };
}

if (X.person) {
    X.eye1 = { eye: true, position: { x: 0, y: 0 } };
    X.eye2 = { eye: true, position: { x: 0, y: 0 } };
    X.eye1.position.y = X.position.y - 12;
    X.eye2.position.y = X.position.y - 12;
    if (X.direction.x == 1 && X.direction.y == 0) {
        X.eye1.direction = X.direction;
        X.eye1.position.x = X.position.x + 16;
        X.eye2 = undefined;
    }
    else if (X.direction.x == -1 && X.direction.y == 0) {
        X.eye1.direction = X.direction;
        X.eye1.position.x = X.position.x - 16;
        X.eye2 = undefined;
    }
    else if (X.direction.x == 0 && X.direction.y == -1) {
        X.eye1 = undefined;
        X.eye2 = undefined;
    }
    else {
        X.eye1.position.x = X.position.x + 12;
        X.eye1.direction = X.direction;
        X.eye2.position.x = X.position.x - 12;
        X.eye2.direction = X.direction;

    }
}


