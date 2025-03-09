import Engine from "./core.js";
const ctx = canvas.getContext("2d");


export function handleCamera() {
    const G = Engine.data;
    if (G.camera)
        if (G.camera.follows) {
            const p = G.camera.follows.position ? G.camera.follows.position : G.camera.follows;
            ctx.translate(-p.x + 320, -p.y + 240);
        }
}