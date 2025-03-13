/**
 * This file is the program for transforming rules into a game
 */


const esprima = require('esprima')
const fs = require('node:fs');

const folder = process.argv[2]; //folder containing the game files (the rules)

let contentMainFile = "";
let irule = 0;

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

        text = text.replaceAll("//@init", "_init=0"); //hack between esprima does not parse comments...grrr....
        const parseTree = esprima.parseScript(text, { range: true })
        const output = parseTree2js(text, parseTree.body);

        try {
            fs.writeFileSync(folder + "/public/" + filename + ".js", output);
        } catch (err) {
            console.error(err);
        }
    });

}


/**
 * 
 * @param {*} ruleText text of the rules (we need it to get the JS code from the parse tree)
 * @param {*} parseTree parse tree of the rules
 * @returns the javascript program corresponding to the rules 
 */
function parseTree2js(ruleText, parseTree) {
    let result = "";

    result += 'import Engine from "./core/core.js"\n';
    result += 'import { Geometry } from "./core/physicsHelper.js";\n';
    result += 'import { Sound } from "./core/sound.js";\n'
    result += 'import { Music } from "./core/music.js";\n'
    result += 'import { Color } from "./core/color.js";\n\n'
    result += 'const G = Engine.data;\n';
    result += '\n';

    /**
     * 
     * @param {*} T parse subtree
     * @returns the string of the JS code associated with T
     */
    function ast2Text(T) {
        return ruleText.substring(T.range[0], T.range[1]);
    }

    let isNextRuleInit = false;
    for (const block of parseTree) {
        if (block.type == 'IfStatement') {
            const c = ast2Text(block.test);
            const body = ast2Text(block.consequent);

            if (body.indexOf("fadeOut") >= 0) //ugly but very pragmatic
                result += "Engine.addRuleAfter((G) => {\n";
            else
                result += "Engine.addRule((G) => {\n";


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

            //contains the fluent set to true when the rule is applied. They are set to false when the condition becomes false.
            const initializerFluents = [];

            function isInitRule() {
                return isNextRuleInit;
            }



            if (isInitRule()) {
                initializerFluents.push(`G._rule${irule}`);
                if (hasX)
                    initializerFluents.push(`X._rule${irule}`);
                if (hasY)
                    initializerFluents.push(`Y._rule${irule}`);

            }

            function conjunctionFluents() {
                return initializerFluents.map((fluent) => " && !" + fluent).join("");
            }

            result += '{\n';
            result += `const c = ${c}\n`;
            result += "if(c" + conjunctionFluents() + ") {\n";

            for (const fluent of initializerFluents)
                result += fluent + " = true\n";
            result += body + "\n}\n";

            if (initializerFluents.length > 0) {
                result += "if(!(c)) {\n";

                for (const fluent of initializerFluents)
                    result += fluent + " = undefined\n";
                result += "}\n;"
            }

            result += "}";

            result += "});\n\n"; //end of Engine.addRule(.... => ..
            isNextRuleInit = false;
        }
        else if (ast2Text(block) == "_init=0") {
            isNextRuleInit = true;
        }
        else
            result += ast2Text(block) + "\n";

        irule++;

    }
    return result;
}