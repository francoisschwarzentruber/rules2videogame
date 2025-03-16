
G.SCENE_OUTSIDE = Engine.newId();
G.sceneName = G.SCENE_OUTSIDE;
G.x = 7;
G.y = 7;
const r = 20;
G.scene = {}
G.top = [];
G.link = { person: true, player: true, acceleration: true, position: { x: 300, y: 200 }, color: "green", direction: { x: 1, y: 0 } };

for (let i = 0; i < 5; i++)
    G.top.push({ disk: true, position: { x: 200 * i, y: -560 }, radius: 600, color: "black" });


function loadOutsideMap(background, string) {
    G.scene = {};
    G.scene.background = { position: { x: 0, y: 0 }, radius: 1000, disk: true, color: background };
    (string).split("\n").forEach((line, y) => {
        for (let x = 0; x < line.length; x++)
            putTile(x, y, line[x]);
    });
}



function putTile(x, y, char) {
    x = r + x * r * 2;
    y = 2 * r + r + y * r * 2;
    if (char == "T")
        Engine.add({ disk: true, solid: true, fixed: true, position: { x, y }, radius: r, color: "green" });
    if (char == "D")
        Engine.add({ disk: true, fixed: true, position: { x, y }, radius: r, color: "black" });
    if (char == "R") {
        Engine.add({ disk: true, solid: true, fixed: true, position: { x, y }, radius: r, color: Color.random(0, 128, 0, 32) });
        for (let i = 0; i < 8; i++)
            Engine.add({ disk: true, position: { x: x - r * Math.cos(i), y: y + r * Math.sin(i) }, radius: r * 0.5, color: Color.random(0, 128, 0, 128) });
    }

}





//@init
if (G.sceneName == G.SCENE_OUTSIDE && G.x == 7 && G.y == 7) {
    loadOutsideMap("lightyellow",
        "RRRRRRR  RRRRRRR\n" +
        "RRRRDRR  RRRRRRR\n" +
        "RRRR     RRRRRRR\n" +
        "RRR      RRRRRRR\n" +
        "RR        RRRRRR\n" +
        "                \n" +
        "RR            RR\n" +
        "RR            RR\n" +
        "RR            RR\n" +
        "RRRRRRRRRRRRRRRR\n" +
        "RRRRRRRRRRRRRRRR\n");
}



//@init
if (G.sceneName == G.SCENE_OUTSIDE && G.x == 7 && G.y == 6) {
    loadOutsideMap("lightyellow",
        "RRRRRRRRRRRRRRRR\n" +
        "RRRRRRRDRRRRRRRR\n" +
        "RR       RR   RR\n" +
        "R  R R      R  R\n" +
        "                \n" +
        "   R R      R   \n" +
        "                \n" +
        "R  R R      R  R\n" +
        "RR       RR   RR\n" +
        "RRRRRRR  RRRRRRR\n" +
        "RRRRRRR  RRRRRRR\n");
}



//@init
if (G.sceneName == G.SCENE_OUTSIDE && G.x == 8 && G.y == 7) {
    loadOutsideMap("lightyellow",
        "RRRT T T  T T T T\n" +
        "RRRT T T  T T T T\n" +
        "RRR              \n" +
        "RR     T  T T T  \n" +
        "R  T T           \n" +
        "       T  T T T  \n" +
        "R  T T           \n" +
        "RR     T  T T T  \n" +
        "RR               \n" +
        "RRTTTTTTTTTTTTTTT\n" +
        "RRTTTTTTTTTTTTTTT\n");
}


if (G.link.position.x > 640 - 20) {
    Engine.fadeOut();
    G.sceneName = G.SCENE_OUTSIDE;
    G.x++;
    G.link.position.x = 32;
}

if (G.link.position.x < 20) {
    Engine.fadeOut();
    G.sceneName = G.SCENE_OUTSIDE;
    G.x--;
    G.link.position.x = 640 - 40;
}

if (G.link.position.y < 40) {
    Engine.fadeOut();
    G.sceneName = G.SCENE_OUTSIDE;
    G.y--;
    G.link.position.y = 480 - 40;
}

if (G.link.position.y > 480 - 20) {
    Engine.fadeOut();
    G.sceneName = G.SCENE_OUTSIDE;
    G.y++;
    G.link.position.y = 100;
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
    G.link.acceleration.y -= 1;
}
if (G.keyboard.down) {
    G.link.acceleration.y += 1;
    G.link.direction = { x: 0, y: 1 };
}

if (X.acceleration && X.velocity) {
    const fact = 0.7;
    X.acceleration = { x: fact * X.acceleration.x, y: fact * X.acceleration.y };
    X.velocity = { x: fact * X.velocity.x, y: fact * X.velocity.y };
}



