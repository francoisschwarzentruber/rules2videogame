G.SCENE_TITLE = Engine.newId();
G.SCENE_GAME = Engine.newId();
G.SCENE_WIN = Engine.newId();
G.SCENE_GAMEOVER = Engine.newId();
G.sceneName = G.SCENE_GAME;





//@init
if (G.sceneName == G.SCENE_TITLE) {
    G.scene = {};
    G.scene.title = { text: "Fight the snake", position: { x: 200, y: 100 }, size: 40 };
}





//@init
if (G.sceneName == G.SCENE_GAME) {
    G.scene = {};
    G.scene.sky = { position: { x: 300, y: 50 }, color: "darkblue", radius: 10000, disk: true };
    G.scene.boss = { snake: true, position: { x: 500, y: 200 } }
    G.scene.balls = [];
    G.link = { person: true, acceleration: true, player: true, position: { x: 120, y: 240 }, color: "green", direction: { x: 1, y: 0 } };
    G.link.lf = 3;
}

//@init
if (G.sceneName == G.SCENE_TITLE && G.keyboard.action) {
    Engine.fadeOut();
    G.sceneName = G.SCENE_GAME;
}

//@init
if (G.sceneName == G.SCENE_CIRCLEENGINE_LOGO && G.keyboard.action) {
    Engine.fadeOut();
    G.sceneName = G.SCENE_TITLE;
}


if (G.sceneName != G.SCENE_GAMEOVER && G.link && G.link.lf <= 0) {
    Engine.fadeOut();
    G.sceneName = G.SCENE_GAMEOVER;
}


if (G.sceneName == G.SCENE_GAMEOVER) {
    G.scene = {};
    G.link = {};
    G.textPause = { text: "Game over", color: "white", position: { x: 320, y: 240 } };
}

if (G.sceneName == G.SCENE_WIN) {
    G.scene = {};
    G.textPause = { text: "Game over", color: "white", position: { x: 320, y: 240 } };
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

//@init
if (G.keyboard.escape) {
    Engine.fadeOut();
    G.scene.paused = !G.scene.paused;
    G.link.paused = !G.link.paused;
    if (G.scene.paused) {
        G.textPause = { text: "pause", color: "white", position: { x: 320, y: 240 } };
    }
    else
        G.textPause = undefined;
}


if (G.link) {
    if (G.link.position.x < 32) G.link.position.x = 32;
    if (G.link.position.x > 640 - 32) G.link.position.x = 640 - 32;
    if (G.link.position.y < 32) G.link.position.y = 32;
    if (G.link.position.y > 480 - 32) G.link.position.y = 480 - 32;

}

if (G.sceneName == G.SCENE_GAME) {
    G.scene.life = [];
    for (let i = 0; i < G.link.lf; i++)
        G.scene.life.push({ disk: true, position: { x: 32 + 16 * i, y: 32 }, radius: 8, color: "red" });
}
//@init
if (G.sceneName == G.SCENE_GAME && G.keyboard.action) {
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

if (X.acceleration && X.velocity) {
    const fact = 0.7;
    X.acceleration = { x: fact * X.acceleration.x, y: fact * X.acceleration.y };
    X.velocity = { x: fact * X.velocity.x, y: fact * X.velocity.y };
}

//@init
if (X.snake) {
    X.body = [];
    for (let i = 1; i < 10; i++)
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

if (X.explosion) X.radius = Math.min(X.timer * X.size / 20, X.size * (1 - X.timer / 20));


if (X.enemy && !G.link.hurt && Geometry.intersects(X, G.link)) {
    G.link.lf--;
    Geometry.bounce(G.link, X, 5);
    G.link.hurt = { timer: 50 };
    Sound.play("hurt.ogg");
}



if (G.link.hurt) {
    G.link.color = Color.random();
}

//@init
if (!G.link.hurt) {
    G.link.color = "green";
}




if (X.r && X.angle) {
    X.x = X.r * Math.cos(X.angle);
    X.y = X.r * Math.sin(X.angle);
}