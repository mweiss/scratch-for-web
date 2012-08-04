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
    copy.set("blocks", dstBlocks);
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
      
      if (newBlocks.size() === 0) {
        this.destroy();
      }
      else {
        this.handleRender();
      }
      
      splitBlockList = new BlockListModel({
        blocks : splitBlocks
      });
    }
    return splitBlockList;
  },
  
  /**
   * Inserts the given block list before or after the block specified.  If we
   * cannot find the block in the block list, we insert the block list to add at the
   * beginning of this block list.
   */
  insertBlockList: function(blockListToAdd, block, insertBefore) {
    var selfBlocks = this.get('blocks'),
        selfBlockIndex = selfBlocks.indexOf(block),
        i, 
        newBlocks = new Y.ModelList(),
        inserted = false, shouldInsert = false,
        addToNewBlocks = function() {
          var blks = blockListToAdd.get('blocks');
          blks.each(function(blk) {
            newBlocks.add(blk);
          });
          inserted = true;
        };
    
    // If we can't find the block in the block list, then we
    if (selfBlockIndex === -1) {
      selfBlockIndex = 0;
      insertBefore = true;
    }
        
    for (i = 0; i < selfBlocks.size(); i += 1) {
      shouldInsert = selfBlockIndex === i;
      if (insertBefore && shouldInsert) {
        addToNewBlocks();
      }
      newBlocks.add(selfBlocks.item(i));
      if (!insertBefore && shouldInsert) {
        addToNewBlocks();
      }
    }
    
    if (!inserted) {
      addToNewBlocks();
    }
    
    this.set('blocks', newBlocks);
    blockListToAdd.set('blocks', new Y.ModelList());
    blockListToAdd.destroy();
  },
  
  /**
   * I am a method which returns a block list returned after calling splitBlockList, or null if
   * this block was not in the block list.
   */
  detach: function(model) {
    return this.splitBlockList(model) || null;
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