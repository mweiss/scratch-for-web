/*global Y*/
var CORE_BLOCK_DEFINITIONS = {
  "control": [
    { statement: "When {flag:image} clicked", type: "hat" },
    { statement: "When {keyboardInput:keyboardMenu} key pressed", type: "hat" },
    { statement: "forever {statement:cShape}", type: "end" },
    { statement: "repeat {num:number}", type: "command" },
    { statement: "if {predicate:reporter} {trueStatement:cShape} else {falseStatement:cShape}", type : "command"},
    { statement: "stop script", type: "end" },
    { statement: "stop all {stop:image}", type: "end" },
    { statement: "run {block:rawcommand} {inputs:inputlist}", type: "command" },
    { statement: "call {block:rawreporter} {inputs:inputlist}", type: "reporter" }
  ],
  "operators": [
    { statement: "{exp1:reporter} + {exp2:reporter}", type: "reporter" },
    { statement: "{exp1:reporter} - {exp2:reporter}", type: "reporter" },
    
    // Multiply.
    { statement: "{exp1:reporter} \u00D7 {exp2:reporter}", type: "reporter" },
    // Divide.
    { statement: "{exp1:reporter} \u00F7 {exp2:reporter}", type: "reporter" },
    
    { statement: "{exp1:reporter} < {exp2:reporter}", type: "reporter" },
    { statement: "{exp1:reporter} = {exp2:reporter}", type: "reporter" },
    { statement: "{exp1:reporter} > {exp2:reporter}", type: "reporter" },
    { statement: "the {expression:reporter} block. {inputNames:variablelist}", type: "reporter"}
  ],
  "variables": [
    { statement: "set {var:variable} to {value:reporter}", type: "command"},
    { statement: "change {var:variable} by {delta:number}", type: "command"},
    { statement: "list {reporter:list}", type: "reporter"}
  ],
  "custom": [
    {
      statement: ["switch",
        {
          name: "exprAndCaseStmt",
          type: "repeat",
          subBlocks: ["case",
          {
            name: "expression",
            type: "reporter"
          },
          {
            name: "statement",
            type: "cShape"
          }
          ],
          size: 1
        },
        "default",
        {
          name: "defaultStatement",
          type: "reporter"
        }],
      type: "statement"
    }
  ]
};

/**
 * I'm a method which takes in a block in with the properties statement and type and returns a parsed block
 * definition.
 */
var parseInputBlock = function(name, type) {
  switch (type) {
    case "inputlist":
      return {
        type: "inputlist",
        size: 0,
        name : name
      };   
    case "list":
      return {
        type: "repeat",
        subBlocks: [{
          name: name,
          type: "reporter"
        }],
        size: 1
      };
    default:
      return {
        name : name,
        type : type
      };
  }
};

var parseBlockDefinition = function(def) {
  var newBlockDefinition = {
        type : def.type
      }, 
      statement = def.statement,
      inputRegex = /\{[^\}]*\}/g,
      delimiter = "@SPLIT@",
      inputs, text, newStatement;
  if (Y.Lang.isString(statement)) {
    inputs = statement.match(inputRegex) || [];
    text = statement.replace(inputRegex, delimiter).split(delimiter);
    newStatement = [];
    Y.each(text, function(value, index) {
      var input = inputs[index];
      newStatement.push(value);
      if (input) {
        input = input.replace(/[\{\}]/g, '').split(":");
        newStatement.push(parseInputBlock(input[0], input[1]));
      }
    });
  }
  else {
    newBlockDefinition.statement = Y.clone(statement);
  }
  return newBlockDefinition;
};

var parseBlockDefinitions = function() {
  var defs = {};
  Y.each(CORE_BLOCK_DEFINITIONS, function(blocks, category) {
    defs[category] = Y.Array.map(blocks, function(def) {
      return parseBlockDefinition(def);
    });
  });
  return defs;
};

Y.BLOCK_DEFINITIONS = parseBlockDefinitions();
