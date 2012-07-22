/*global Y*/
var BlockCanvasView;

BlockCanvasView = Y.Base.create('blockCanvasView', Y.View, [], {
  _currentRenders: null,
  
  initializer: function (cfg) {
    this._currentRenders = [];
  },
  
  // Renders the canvas view
  render: function() {
    // get the canvas model
    var model = this.get('model'),
        blockLists = model.get('blockLists'),
        container = this.get("container");
    
    container.setStyle("position", "relative");
    container.addClass("blockCv");
    Y.each(blockLists, this._renderBlockList, this);
  },
  
  _renderBlockList: function(blDescriptor) {
    var blRender = new Y.BlockListRender(Y.mix({parent: this.get("container") }, blDescriptor));
    blRender.render();
    this._currentRenders.push(blRender);
  }
});

Y.BlockCanvasView = BlockCanvasView;