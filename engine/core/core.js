import { handleCamera } from "./camera.js";

let fadeOut = 0;

function* DFS(node) {
    if (node instanceof Object) {
        if (node.paused)
            return;
        yield node;
        for (const attr in node)
            if (!attr.startsWith("_")) // do not traverse fields like "_img" etc.
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
const rulesGlobal = [];
const rulesGlobalAfter = [];

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
        else
            console.error("signature of a rule unclear");
    }


    static addRuleAfter(f) {
        rulesGlobalAfter.push(f);
    }

    static newId() {
        return Math.floor(Math.random() * 1000000);
    }



    static fadeOut() {
        fadeOut = 25;
    }

    static delete(o) {
        deleteIn(Engine.data, o);
    }

    static add(o) {
        /* if (Engine.data.scene.objects == undefined)
             Engine.data.scene.objects = [];*/
        //Engine.data.scene.objects.push(o);
        const newId = "o" + Engine.newId();
        Engine.data.scene[newId] = o;
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


String.prototype.mapTile = function (f) {
    this.split("\n").forEach((line, iy) => {
        for (let ix = 0; ix < line.length; ix++)
            f(ix, iy, line[ix]);
    });
};



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


    for (const r of rulesGlobalAfter)
        try {
            r(Engine.data);
        }
        catch (err) {
            console.error(err)
        }

}

const ctx = canvas.getContext("2d");


function animate() {
    ctx.resetTransform();
    if (fadeOut > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, 640, 480);
        fadeOut--;
    }
    else {
        ctx.clearRect(0, 0, 640, 480);
        handleCamera();
        step();
    }
    requestAnimationFrame(animate);
}

animate();


