/*global Y*/
var BlockCanvasModel;

BlockCanvasModel = Y.Base.create("blockCanvasModel", Y.Model, [], {
  /**
   * I am a method which adds the given block list to the blockLists attribute
   */
  addBlockList: function(x, y, blockList) {
    var blists = this.get("blockLists");
    blists.push({
      x: x,
      y: y,
      model: blockList
    });
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