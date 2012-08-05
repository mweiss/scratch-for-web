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
    this.set("useDrag", false);
    this.set("useDrop", true);
  },
  
  highlight: function(isTop, dropModel, dragModel) {
    var container = this.get("container");
    container.addClass("emptyExpressionHighlight");
  },
  
  unhighlight: function() {
    var container = this.get("container");
    container.removeClass("emptyExpressionHighlight");
  },
  
  explicitWidthAdjustment: function(container) {
    // Explicitely set the widths of this block, since some browsers
    // have trouble correctly calculating inline block widths without this
    container.setStyle("width", container.get("region").width);
  }
  
}, {
  
});
Y.EmptyExpressionBlockRender = EmptyExpressionBlockRender;