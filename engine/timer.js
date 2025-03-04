import Engine from "./core.js";


Engine.addRule((X) => {
    if (X.timer != undefined) {
        X.timer--;
        if (X.timer <= 0)
            Engine.delete(X);
    }

});