# rules2videogame

# Tutorial

## Installation
    sudo apt-get install antlr4

## Get grammars
    Go to https://github.com/antlr/grammars-v4/tree/master/javascript/javascript
    Get JavaScriptLexer.g4
    get JavaScriptParser.g4

## Generating the lexer and parser
    antlr4 -Dlanguage=Python3 JavaScriptLexer.g4
    antlr4 -Dlanguage=Python3 JavaScriptParser.g4
