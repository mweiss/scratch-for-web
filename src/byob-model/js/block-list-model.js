/*global Y, BaseRenderableModel*/
var BlockListModel, emptyModelListFn;

emptyModelListFn = function() {
  return new Y.ModelList();
};

/**
 * I am a prototype for a block list, which is a set of one or more blocks that should be executed in
 * order.
 */
BlockListModel = Y.Base.create('blockListModel', BaseRenderableModel, [], {
  type: "blockList",
  
  /**
   * I am a method which returns a deep copy of myself and my sub blocks.
   */
  copy: function(parent) {
    var copy = new BlockListModel({
          parent: this.get('parent')
        }), 
        srcBlocks = this.get('blocks'),
        dstBlocks = copy.get('blocks');
    
    dstBlocks.add(srcBlocks.map(function(src) {
      return src.copy(copy);
    }));
    return copy;
  },
  
  /**
   * I am a method which removes and returns the blocks starting from the block passed in
   * and up to the end of the block list.
   */
  splitBlockList: function(model) {
    var blocks = this.get('blocks'),
        index = blocks.indexOf(model),
        newBlocks = new Y.ModelList(), splitBlocks = new Y.ModelList(), splitBlockList, i;
    
    if (index !== -1) { 
      for (i = 0; i < blocks.size(); i += 1) {
        if (i < index) {
          newBlocks.add(blocks.item(i));
        }
        else {
          splitBlocks.add(blocks.item(i));
        }
      }
      
      this.set('blocks', newBlocks);
      
      // TODO: at what point to we destroy the block list?
      // if (newBlocks.size() === 0) {
      //  this.destroy();
      // }
      
      splitBlockList = new BlockListModel({
        blocks : splitBlocks
      });
    }
    return splitBlockList;
  }
  
}, {
  ATTRS: {
    /**
     * A model list of blocks.  This value should never be null.
     */
    blocks: {
      valueFn: emptyModelListFn,
      
      setter: function(value) {
        if (value) {
          value.each(function(v) {
            v.set('parent', this);
          }, this);
        }
        return value;
      }
    }
  }
});

Y.BlockListModel = BlockListModel;