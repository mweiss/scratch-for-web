/*global Y*/
var BlockListRender;

BlockListRender = Y.Base.create("baseBlockRender", Y.BaseBlockRender, [], {
  
  _currentBlockRenders: null,
  
  container : '<div class="blockList"></div>',
  
  render: function() {
    var blockList = this.get("model"),
        modelParent = blockList.get("parent"),
        container = this.get("container"),
        blocks = blockList.get('blocks'),
        x = this.get("x"),
        y = this.get("y");
    
    // Set this block list's position on the stage if it's not part of another block.
    if (Y.Lang.isNumber(x) && Y.Lang.isNumber(y)) {
      container.setStyle('left', x);
      container.setStyle('top', y);
      container.setStyle('position', 'absolute');
    }
    
    // If the container is not in the document, add it to the parent element.
    if (!container.inDoc()) {
      this.get('parent').append(container);
    }
    
    // Reset the contents of the block list
    this._clearContents();
    
    this._currentBlockRenders = [];
    blocks.each(function(block) {
      var blockWrapper = Y.Node.create('<div class="blockWrapper"></div>'), 
          region,
          graphicsBlock;
      
      // For the first block, we want to style the margin differently from subsequent blocks.
      if (this._currentBlockRenders.length === 0) {
        blockWrapper.addClass("firstWrapper");
      }
      container.append(blockWrapper);
      graphicsBlock = Y.BlockRender({
        model : block,
        parent : blockWrapper,
        useDrag : this.get("useDrag"),
        useDrop : this.get("useDrop")
      });
      graphicsBlock.render();
      region = graphicsBlock.get("container").get('region');
      blockWrapper.setStyle('width', region.width);
      blockWrapper.setStyle('height', region.height);
      this._currentBlockRenders.push(graphicsBlock);
    }, this);
    
    // Default the height if there are no blocks in the block list and we're an inline block
    if (blocks.size() === 0) {
      container.setStyle('height', '20px');
      if (this.get("useDrop")) {
        this._plugDrop(container);
      }
    }
    else if (container.drop) {
      container.drop.destroy();
    }
    
    if (modelParent && modelParent.type !== 'canvas') {
      container.setStyle('marginLeft', '12px');
    }
    
  },
  /**
   * Overrides the default isDragTop implementation so that the highlight doesn't shift.
   */
  _isDragTop : function(drag, drop) {
    return true;   
  },
    
  destroy: function() {
    this._clearContents();
    BlockListRender.superclass.destroy.apply(this);
  },
  
  _clearContents: function() {
    if (this._currentBlockRenders) {
      Y.Array.each(this._currentBlockRenders, function(blockRender) {
        blockRender.destroy();
      });
    }
    this.get("container").setContent('');
  }
}, {
  ATTRS : {
    x : {
      value : null
    },
    
    y : {
      value : null
    }
  }
});

Y.BlockListRender = BlockListRender;