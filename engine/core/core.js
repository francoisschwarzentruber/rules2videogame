import { handleCamera } from "./camera.js";

function* DFS(node) {
    if (node instanceof Object) {
        yield node;
        for (const attr in node)
            if (node[attr] != undefined)
                yield* DFS(node[attr]);
    }
    else
        if (node instanceof Array) {
            yield node;
            for (const child of node)
                yield* DFS(child);
        }
}



function deleteIn(node, tobeDeleted) {
    if (node instanceof Array) {
        for (let i = 0; i < node.length; i++)
            if (node[i] == tobeDeleted) {
                node.splice(i, 1);
                return;
            }
            else
                deleteIn(node[i], tobeDeleted);
    }
    else
        if (node instanceof Object) {
            for (const attr in node)
                if (node[attr] == tobeDeleted)
                    node[attr] = undefined;
                else if (node[attr] != undefined)
                    deleteIn(node[attr], tobeDeleted);
        }

}



const rules1 = [];
const rules2 = [];
const rulesS = [];
const rulesGlobal = [];

export default class Engine {
    static data = {};

    static addRule(f) {
        const str = f.toString();

        if (str.startsWith("(X)"))
            rules1.push(f);
        else if (str.startsWith("(X, G)"))
            rules1.push(f);
        else if (str.startsWith("(G)") || str.startsWith("()"))
            rulesGlobal.push(f);
        /* else if (str.startsWith("(X, Y)"))
             rules2.push(f);
         else if (str.startsWith("(X, Y, G)"))
             rules2.push(f);*/
        else
            console.error("signature of a rule unclear");
    }

    static newId() {
        return Math.floor(Math.random() * 1000000);
    }


    static delete(o) {
        deleteIn(Engine.data, o);
    }

    static add(o) {
        if (Engine.data.scene.objects == undefined)
            Engine.data.scene.objects = [];
        Engine.data.scene.objects.push(o);
    }

    static some(predicate) {
        for (const Y of DFS(Engine.data))
            if (predicate(Y))
                return true;
        return false;
    }


    static get objects() {
        return DFS(Engine.data);
    }

}


window.data = Engine.data;

function step() {
    for (const r of rulesGlobal)
        try {
            r(Engine.data);
        }
        catch (err) {
            console.error(err)
        }

    for (const r of rules1) {
        const gen = DFS(Engine.data);
        for (const X of gen) {
            r(X, Engine.data)
        }
    }

}

const ctx = canvas.getContext("2d");
function animate() {
    ctx.resetTransform();
    ctx.clearRect(0, 0, 640, 480);
    handleCamera();
    step();
    requestAnimationFrame(animate);
}

animate();


