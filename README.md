# rules2videogame

This repository enables to create very simple video games by writing **rules**. For the moment, objects are circles.


## Usage

Create a folder containing .js file containing rules (see below what is a rule). For instance, a folder named `snake` (see Example).

    node rules2game.js <folder containing the rules>

For instance:

    node rules2game.js snake

It generates a subfolder `public` containing the stand-alone game that you can deploy on the Internet.


## Example of rules

The following rule says that if the left key is pressed, then substract 1 to the x-coordinate of the acceleration, and set the direction of the player to (-1, 0):

    if (G.keyboard.left) {
        G.link.acceleration.x -= 1;
        G.link.direction = { x: -1, y: 0 };
    }


The following code says that if the player intersects an enemy, then play the sound "hurt.ogg" and make the player bounce. The symbol `X` is a universally quantified variable.

    if (X.enemy && Geometry.intersects(X, G.link)) {
        Sound.play("hurt.ogg");
        Geometry.bounce(G.link, X, 5);
    }


The following code says that if a ball intersects an enemy, both the ball and the enemy disappear. Both `X` and `Y` are universally quantified variables.

    if(X.enemy && Y.ball && Geometry.intersects(X, Y)) {
        Engine.delete(X);
        Engine.delete(Y);
        Engine.add({explosion: true, position: X.position});
    }




### Initialization rules

The following rule will keep creating balls when the action key is pressed:

    if(G.keyboard.action) {
        Engine.add({ball: true, position: {x:X.link.position, y:X.link.position}})
    }

In order to create a ball just at the beginning, you may use the decorator `\\@init` :

    //@init
    if(G.keyboard.action) {
        Engine.add({ball: true, position: {x:X.link.position, y:X.link.position}})
    }

