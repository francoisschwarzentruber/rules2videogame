import Engine from "./core.js";
import { Geometry } from "./physicsHelper.js";


/****** acceleration and velocity */

const dt = 1;

Engine.addRule((X, G) => {
    if (X.acceleration == true)
        X.acceleration = { x: 0, y: 0 };

    if (X.acceleration)
        if (!X.velocity)
            X.velocity = { x: 0, y: 0 };

    if (X.velocity == true)
        X.velocity = { x: 0, y: 0 };

    if (X.acceleration) {
        X.velocity.x += dt * X.acceleration.x;
        X.velocity.y += dt * X.acceleration.y;
    }

    if (X.velocity) {
        if (X.position == undefined)
            X.position = {};
        X.position.x += dt * X.velocity.x;
        X.position.y += dt * X.velocity.y;
    }
});





/** collisions */

//Engine.addRule((X) => X.onground = Engine.some((Y) => Y.solid && Y.fixed && intersects(X, Y) && (X.position.y < Y.position.y)));


Engine.addRule(() => {
    for (const X of Engine.objects)
        if (X.solid && !X.fixed)
            for (const Y of Engine.objects)
                if (X != Y)
                    if (Y.solid && Y.fixed && Geometry.intersects(X, Y)) {
                        Geometry.moveOutside(X, Y);
                    }
});

Engine.addRule(() => {
    for (const X of Engine.objects)
        if (X.solid && !X.fixed)
            for (const Y of Engine.objects)
                if (X != Y)
                    if (Y.solid && !Y.fixed && Geometry.intersects(X, Y)) {
                        Geometry.bounce(X, Y, 1);
                        Geometry.bounce(Y, X, 1);
                    }
});
