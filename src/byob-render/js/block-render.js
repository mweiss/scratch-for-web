/*global Y*/
var BlockRender = function(cfg) {
  var blockDefinition = (cfg.model && cfg.model.get("blockDefinition")) || {};
  if (cfg.model && cfg.model.type === "blockList") {
    return new Y.BlockListRender(cfg);
  }
  if (cfg.type === "repeat") {
    return new Y.RepeatBlockRender(cfg);
  }
  else if (blockDefinition.statement && blockDefinition.statement.length === 0) {
    return new Y.EmptyExpressionBlockRender(cfg);
  }
  else {
    return new Y.ExpressionBlockRender(cfg);
  }
};

Y.BlockRender = BlockRender;
