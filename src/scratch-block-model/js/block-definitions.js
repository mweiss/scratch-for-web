/*global Y */
var BLOCK_TYPES = {
  simpleBlock: {
    _topBlocksAllowed: true,
    _bottomBlocksAllowed: true
  },
  controlBlock : {
    _topBlocksAllowed: true,
    _bottomBlocksAllowed: true,
    _innerBlocksAllowed: true
  }
};

Y.BLOCK_TYPES = BLOCK_TYPES;

var SPRITE_BLOCK_DEFINITIONS = {
  motion: [
    { 
      statement: "move {numSteps} steps",
      blockType: "simpleBlock",
      defaultInput: {
        numSteps: 10
      }
    },
    {
      statement: "turn \u21bb {turnRight} degrees",
      blockType: "simpleBlock",
      defaultInput: {
        turnRight: {
          type: 'degree',
          value: 15
        }
      }
    },
    {
      statement: "turn \u21ba {turnLeft} degrees",
      blockType: "simpleBlock",
      defaultInput: {
        turnLeft: {
          type: 'degree',
          value: 15
        }
      }
    },
    {
      statement: "point in direction {direction}",
      blockType: "simpleBlock",
      defaultInput : {
        direction: {
          type: 'menu',
          values: [
            { name : 'right', value : 90, isDefault: true},
            { name : 'left', value : -90 },
            { name : 'up', value : 0 },
            { name : 'down', value : 180 }
          ]
        }
      }
    },
    {
      statement: "point towards {sprite}",
      blockType: "simpleBlock",
      defaultInput : {
        sprite: {
          type: 'pointTowards'
        }
      }
    }
    
  ],
  control : [
    {
      statement : "while {expression}",
      blockType : "controlBlock",
      defaultInput : {
        expression : 'blank'
      }
    }
  ]
};

Y.SPRITE_BLOCK_DEFINITIONS = SPRITE_BLOCK_DEFINITIONS;
