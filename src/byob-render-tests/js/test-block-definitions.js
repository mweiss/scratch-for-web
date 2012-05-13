/*global Y*/
var testBlockDefinitions = [
  {
    type: Y.BlockTypes.statement,
    statement: ["A simple statement"]
  },
  {
    type: Y.BlockTypes.statement,
    statement: ["Another", "statement", "split", "into", "blocks"]
  },
  {
    type: Y.BlockTypes.statement,
    statement: ["Here's --> ",
      {
        type: "reporter",
        name: "input"
      },
      "<-- an input"]
  },
  {
    type: Y.BlockTypes.reporter,
    statement: ["simple expression"]
  },
  {
    type: Y.BlockTypes.statement,
    statement: ["Forever",
      {
        type: "cShape",
        name: "input"
      }
    ]
  },
  {
    type: Y.BlockTypes.statement,
    statement: ["If",
      {
        type: "reporter",
        name: "predicate"
      },
      {
        type: "cShape",
        name: "ifstatement"
      },
      "else",
      {
        type: "cShape",
        name: "elsestatement"
      }
    ]
  },
  {
    type: Y.BlockTypes.statement,
    statement: ["Testing repeat",
      {
        type: "repeat",
        name: "testingRepeat",
        size: 1,
        subBlocks: [
          "sub block"
        ]
      }
    ]
  },
  {
    type: Y.BlockTypes.statement,
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
        type: "cShape"
      }]
  }
];

Y.createTestBlocks = function() {
  return Y.Array.map(testBlockDefinitions, function(bd) {
    return new Y.ExpressionBlockModel({
      blockDefinition: bd
    });
  });
};
