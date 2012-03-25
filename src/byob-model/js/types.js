/*global Y*/
// any
// statement
//  hat
//  endblock
// reporter
//  scriptVariable
//  blockList

// Input types:
// any
// statement
// reporter

/**
 * I represent a block type.  A type determines if a block can connect to blocks above or below it,
 * and determines if it's okay for a block to be an input block for a given type of input.
 */
var Type = function(cfg) {
      Y.mix(this, cfg);
    },
    Types;

Type.prototype = {
  name: null,
  allowsTopBlocks: false,
  allowsBottomBlocks: false,
  returnsValue: false,
  isBlockList: false
};

/**
 * I am an object which maps a type's name with the appropriate type object.  I should be considered
 * immutable, changing me is BAD.
 */
Types = {
  statement: new Type({
    allowsTopBlocks: true,
    allowsBottomBlocks: true
  }),
  hat: new Type({
    allowsBottomBlocks: true
  }),
  end: new Type({
    allowsTopBlocks: true
  }),
  reporter: new Type({
    returnsValue: true
  }),
  blockList: new Type({
    isBlockList: true
  })
};

Y.each(Types, function(value, key) {
  value.name = key;
});

Y.BlockTypes = Types;