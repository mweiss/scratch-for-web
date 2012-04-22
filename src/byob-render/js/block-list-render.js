/*global Y*/
var BlockListRender;

BlockListRender = Y.Base.create("baseBlockRender", Y.BaseBlockRender, [], {
  
  _currentBlockRenders: null,
  
  container : '<div class="blockList"></div>',
  
  render: function() {
    var blockList = this.get("model"),
        container = this.get("container"),
        blocks = blockList.get('blocks'),
        isInline = blockList.isInline();
    
    // Set this block list's position on the stage if it's not part of another block.
    if (!isInline) {
      container.setStyle('left', blockList.get('x'));
      container.setStyle('top', blockList.get('y'));
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
      container.append(blockWrapper);
      graphicsBlock = Y.BlockRender({
        model : block,
        parent : blockWrapper
      });
      graphicsBlock.render();
      region = graphicsBlock.get("container").get('region');
      blockWrapper.setStyle('width', region.width);
      blockWrapper.setStyle('height', region.height);
      this._currentBlockRenders.push(graphicsBlock);
    }, this);
    
    // Default the height if ther are no blocks in the block list and we're an inline block
    if (blocks.size() === 0 && isInline) {
      container.setStyle('height', '15px');
    }
  },
  
  _clearContents: function() {
    if (this._currentBlockRenders) {
      Y.Array.each(this._currentBlockRenders, function(blockRender) {
        var container = blockRender.get("container");
        container.remove();
      });
    }
    this.get("container").setContent('');
  }
}, {
});

Y.BlockListRender = BlockListRender;