


const esprima = require('esprima')
const fs = require('node:fs');

const folder = process.argv[2];

let contentMainFile = "";

if (!fs.existsSync(folder + "/public"))
    fs.mkdirSync(folder + "/public");

fs.cpSync("engine", folder + "/public", { recursive: true });

fs.readdirSync(folder).forEach(file => {
    if (file.endsWith(".js")) {
        filerule2jsfile(file)
        console.log(file)
        contentMainFile += `import "./${file}.js";\n`;
    }
});

fs.writeFileSync(folder + "/public/_main.js", contentMainFile);

function filerule2jsfile(filename) {
    fs.readFile(folder + "/" + filename, 'utf8', (err, text) => {
        if (err) {
            console.error(err);
            return;
        }
        const parseTree = esprima.parseScript(text, { range: true })
        const output = parseTree2js(text, parseTree.body);

        try {
            fs.writeFileSync(folder + "/public/" + filename + ".js", output);
        } catch (err) {
            console.error(err);
        }
    });

}



function parseTree2js(text, parseTree) {
    let result = "";

    result += 'import Engine from "./core/core.js"\n';
    result += 'import { Geometry, moveOutside, bounce } from "./core/physicsHelper.js";\n';
    result += 'import { Sound } from "./core/sound.js";\n'
    function ast2Text(T) {
        return text.substring(T.range[0], T.range[1]);
    }

    for (const rule of parseTree) {
        result += "Engine.addRule((G) => {\n";
        const c = ast2Text(rule.test);
        const body = ast2Text(rule.consequent);

        const hasX = c.indexOf("X.") >= 0;
        const hasY = c.indexOf("Y.") >= 0;

        if (hasX && !hasY)
            result += "for(const X of Engine.objects)\n";
        else if (hasX && hasY) {
            result += "for(const X of Engine.objects)\n";
            result += "for(const Y of Engine.objects)\n";
        }
        else if (!hasX && hasY) {
            throw "error: Y cannot appear without X (because it is a first version)";
        }

        result += ast2Text(rule);

        result += "});\n\n";
    }
    return result;
}