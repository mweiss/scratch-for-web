/*global Y*/
var BlockRender = function(cfg) {
  var blockDefinition = cfg.blockDefinition || {};
  if (blockDefinition.statement && blockDefinition.statement.length === 0) {
    return new Y.EmptyExpressionBlockRender(cfg);
  }
  else {
    return new Y.ExpressionBlockRender(cfg);
  }
};

Y.BlockRender = BlockRender;
