G.SCENE_TEST = 2;
G.sceneName = G.SCENE_TEST;


if (G.sceneName == G.SCENE_CIRCLEENGINE_LOGO && G.keyboard.action) { //@init
    G.sceneName = G.SCENE_TEST;
}

//@init
if (G.sceneName == G.SCENE_TEST) {
    G.link = { person: true, acceleration: true, player: true, position: { x: 300, y: 50 }, color: "green", direction: { x: 1, y: 0 } };
    G.scene = {};
    G.scene.sky = { position: { x: 300, y: 50 }, color: "darkblue", radius: 10000, disk: true };
    G.scene.boss = { snake: true, position: { x: 0, y: 0 } }
    G.scene.balls = [];
    G.camera = {};
    G.camera.follows = G.link;
}

if (G.keyboard.left) {
    G.link.acceleration.x -= 1;
    G.link.direction = { x: -1, y: 0 };
}
if (G.keyboard.right) {
    G.link.acceleration.x += 1;
    G.link.direction = { x: 1, y: 0 };
}
if (G.keyboard.up) {
    G.link.direction = { x: 0, y: -1 };
    G.link.acceleration.y -= 1.
}
if (G.keyboard.down) {
    G.link.acceleration.y += 1.
    G.link.direction = { x: 0, y: 1 };
}



if (!G.keyboard.action && X.position && X.radius && X.takable && X.taken) {
    X.taken = false;
    X.position.x += G.link.direction.x * 32;
    X.position.y += 32 + 16;
    X.solid = false;
    X.acceleration = false;
}


if (G.keyboard.action && X.position && X.radius && X.takable && !X.taken &&
    Geometry.distance(G.link, X) < G.link.radius + X.radius + 4) {
    X.taken = true;
    X.z = 1;
    X.solid = false;
    X.acceleration = false;
}



//@init
if (G.keyboard.action) {
    Sound.play("sword.ogg");
    G.scene.balls.push({
        ball: true,
        velocity: { x: 10 * G.link.direction.x, y: 10 * G.link.direction.y },
        position: { x: G.link.position.x, y: G.link.position.y }
    });
}




//@init
if (X.ball) {
    X.disk = true;
    X.radius = 8;
    X.color = "white";
    X.timer = 50;
}


if (X.ball && X.timer <= 0)
    Engine.delete(X);



if (X.acceleration && X.velocity) {
    const fact = 0.7;
    X.acceleration = { x: fact * X.acceleration.x, y: fact * X.acceleration.y };
    X.velocity = { x: fact * X.velocity.x, y: fact * X.velocity.y };
}

//@init
if (X.snake) {
    X.body = [];
    for (let i = 1; i < 7; i++)
        X.body.push({
            solid: true,
            enemy: true,
            disk: true,
            position: { x: X.position.x, y: X.position.y }, radius: 24,
            color: "yellow"
        });
    X.body[0].radius = 32;
    X.eye1 = { eye: true, position: {} };
}


if (X.snake) {
    X.body[X.body.length - 1].color = "red";
    X.body[0].velocity = Geometry.normalize(
        {
            x: G.link.position.x - X.body[0].position.x,
            y: G.link.position.y - X.body[0].position.y
        },
        2);

    const v = Geometry.normalize(X.body[0].velocity, 16);
    X.eye1.position.x = X.body[0].position.x + v.x;
    X.eye1.position.y = X.body[0].position.y + v.y;
    X.eye1.direction = Geometry.normalize(X.body[0].velocity);

    for (let i = 1; i < X.body.length; i++)
        Geometry.touches(X.body[i], X.body[i - 1]);
}



if (X.snake && Y.ball && Geometry.intersects(Y, X.body[X.body.length - 1])) {
    Engine.delete(Y);
    if (X.body.length == 3) {
        Engine.add({ explosions: true, position: X.body[0].position, size: 100, timer: 200 });
        Engine.add({ explosions: true, position: X.body[1].position, size: 100, timer: 200 });
        Engine.add({ explosions: true, position: X.body[2].position, size: 100, timer: 200 });
        Engine.delete(X);
    }
    else {
        Engine.add({ explosions: true, position: X.body[X.body.length - 1].position, timer: 20 });
        Engine.delete(X.body[X.body.length - 1]);
    }
}




if (X.explosions && (Math.random() < 0.15)) {
    Sound.play("explosion.ogg");
    const Y = {};
    Y.explosion = true;
    Y.position = {};
    Y.size = X.size;
    Y.position.x = X.position.x + Math.random() * 4 - 2;
    Y.position.y = X.position.y + Math.random() * 4 - 2;
    Engine.add(Y);
}

//@init
if (X.explosion) {
    X.disk = true;
    X.color = "#FF000088";
    X.timer = 10;
    X.size = 50;
}

if (X.explosion)
    X.radius = Math.min(X.timer * X.size / 20, X.size * (1 - X.timer / 20));


if (X.enemy && Geometry.intersects(X, G.link)) {
    Sound.play("hurt.ogg");
    Geometry.bounce(G.link, X, 5);
}
