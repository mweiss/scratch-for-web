/*global Y*/
var EmptyExpressionBlockRender;

EmptyExpressionBlockRender = Y.Base.create("emptyExpressionBlockRender", Y.ExpressionBlockRender, [], {
  _renderBody: function(model, container) {
    this._blockDims = [];
    this._inlineDims = [{width: 30, height: 20}];
    container.setStyle("width", 30);
    container.setStyle("height", 20);
    container.appendChild("&nbsp;");
  },
  
  initializer: function(cfg) {
    Y.ExpressionBlockRender.prototype.initializer.call(this, cfg);
    this.fill = cfg.fill || {
      color: "#ffffff"
    };
  }
}, {
  
});
Y.EmptyExpressionBlockRender = EmptyExpressionBlockRender;