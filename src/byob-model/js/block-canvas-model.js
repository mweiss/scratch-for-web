/*global Y*/
var BlockCanvasModel;

BlockCanvasModel = Y.Base.create("blockCanvasModel", Y.Model, [], {
   initializer: function(cfg) {
    BlockCanvasModel.superclass.initializer.call(this, cfg);
    this.type = "canvas";
  },
  
  /**
   * I am a method which adds the given block list to the blockLists attribute
   */
  addBlockList: function(x, y, blockList) {
    var blists = this.get("blockLists"), bdesc = {
      x: x,
      y: y,
      model: blockList
    };
    blockList.set("parent", this);
    this.fire("addBlockList", bdesc);
  }
}, {
  /**
   * An array of objects with the attributes x, y, and model (which is a blockList).
   */
  blockLists: {
    valueFn: function() {
      return [];
    }
  }
});

Y.BlockCanvasModel = BlockCanvasModel;