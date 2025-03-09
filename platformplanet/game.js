G.SCENE_PLANET = 1;
G.sceneName = G.SCENE_PLANET;
const ACCELERATION = 3;

//@init
if (G.sceneName == G.SCENE_PLANET) {
    G.previousSceneName = G.SCENE_TEST;
    G.scene = {};
    const R = 600;


    for (let i = 0; i < 400; i++) {
        Engine.add({
            star: true,
            position: {
                x: Math.random() * 2000 - 1000,
                y: Math.random() * 2000 - 1000
            },
            disk: true, fixed: true,
            radius: 2,
            color: "white"
        });

    }

    G.scene.sky = { disk: true, position: { x: 0, y: 0 }, radius: 30000, color: "lightblue" };

    G.scene.montains = [];
    for (let i = 0; i < 40; i++) {
        G.scene.montains.push({
            disk: true, fixed: true,
            position: Geometry.vectorFromPolar(i * 2 * Math.PI / 40 + Math.random() / 10, R - 80 + Math.random() * 50),
            radius: 100,
            color: "lightgreen"
        });

    }


    G.sun = { disk: true, sun: true, angle: Math.PI / 2, position: { x: 0, y: 0 }, radius: 32, color: "yellow" };
    G.scene.planet = { disk: true, fixed: true, solid: true, position: { x: 0, y: 0 }, radius: R, color: "green" };
    G.link = {
        gravity: true, person: true, player: true,
        acceleration: { x: 0, y: 0 }, position: { x: 0, y: -R - 100 },
        color: "blue", direction: { x: 1, y: 0 }
    };
    G.camera = {};
    G.camera.follows = G.link;
}


function angleToCenter() {
    return Math.atan2(-Engine.data.link.position.y, -Engine.data.link.position.x);
}


if (X.gravity) {
    X.acceleration.x = 0;
    X.acceleration.y = 0;
}

if (X.gravity) {
    const a = angleToCenter();
    X.acceleration.x += Math.cos(a);
    X.acceleration.y += Math.sin(a);
}

if (G.keyboard.left) {
    const a = angleToCenter() + Math.PI / 2;
    G.link.acceleration.x += ACCELERATION * Math.cos(a);
    G.link.acceleration.y += ACCELERATION * Math.sin(a);
    G.link.direction = Geometry.vectorFromPolar(a);
}
if (G.keyboard.right) {
    const a = angleToCenter() - Math.PI / 2;
    G.link.acceleration.x += ACCELERATION * Math.cos(a);
    G.link.acceleration.y += ACCELERATION * Math.sin(a);
    G.link.direction = Geometry.vectorFromPolar(a);
}

//@init
if (G.keyboard.up) {
    const a = angleToCenter() + Math.PI;
    G.link.direction = Geometry.vectorFromPolar(a);
    G.link.acceleration = Geometry.add(G.link.acceleration, Geometry.vectorFromPolar(a, 30));
}


if (X.acceleration && X.velocity) {
    const fact = 0.7;
    X.acceleration = { x: fact * X.acceleration.x, y: fact * X.acceleration.y };
    X.velocity = { x: fact * X.velocity.x, y: fact * X.velocity.y };
}



if (X.sun == true) {
    X.angle += 0.01;
    X.position = Geometry.vectorFromPolar(X.angle, 800);
}



function getDiffAngle() {
    let dif = Math.abs(G.sun.angle - angleToCenter()) % (Math.PI * 2);

    if (dif > Math.PI)
        dif = 2 * Math.PI - dif;
    return dif;
}
if (true) {
    const dif = getDiffAngle();
    G.scene.sky.color = `hsla(200, 100%, ${80 * (dif) / Math.PI}%, ${dif / Math.PI})`;
}


if (X.star) {
    const dif = getDiffAngle();
    X.color = `rgba(255, 255, 255, ${1 - dif / Math.PI})`;
}