/*global Y*/
var BlocksTabPlugin = function(cfg) {
  this.init(cfg);
};

BlocksTabPlugin.NS = 'scratch';

BlocksTabPlugin.prototype = {
  
  init: function(cfg) {
    if (cfg) {
      this.tab = cfg.host;
      this.category = cfg.category;
    }
    if (this.tab) {
      this.tab.after('selectedChange', Y.bind(this.afterSelectedChange, this));
    }
  },
  
  loadBlocks: function(category) {
    var blockPrototypes = Y.BlockDefinitionUtils.loadBlocksForCategory(category),
        blockPrototypeContainer = Y.Node.create('<div class="blockPrototypeContainer"></div>');
    
    this.tab.set('content', blockPrototypeContainer);
    
    // HACK: The container element has to be in the DOM in order to correctly calculate height/width and
    // correctly render the blocks.  For now, we're wrapping this in a fragile Y.later call so that it executes
    // after the content has been set (listening to contentChange for some reason doesn't work). 
    Y.later(0, this, function() {
      Y.each(blockPrototypes, function(block) {
        var blockPrototypeWrapper = Y.Node.create('<div class="blockPrototypeWrapper"></div>'),
            blockInstance = new block(),
            renderBlock;
        
        blockPrototypeContainer.append(blockPrototypeWrapper);
        renderBlock = Y.GraphicsBlockRender({
          parent : blockPrototypeWrapper,
          model : blockInstance
        });
        renderBlock._copyOnDrag = true;
        renderBlock.render();
      }, this);
    });
    
  },
  
  afterSelectedChange: function(e) {
    if (!this.loaded) {
      this.loadBlocks(this.category);
    }
  }
};

var BlockSelectionView = Y.Base.create("blockCreationView", Y.View, [], {
  render: function() {
    // get all the children for the tabview
    var tabView = new Y.TabView(),
        categories = this._getAllCategories();
    
    // Create tabs for each category
    Y.each(categories, function(category) {
      var tab = new Y.Tab({
        label: category,
        content : ''
      });
      tab.plug(BlocksTabPlugin, {
        category : category
      });
      tabView.add(tab);
    });
    
    tabView.render(this.container);
  },
  
  _getAllCategories: function() {
    return Y.Object.keys(Y.SPRITE_BLOCK_DEFINITIONS);
  }
}, {
  ATTRS : {
    
  }
});

var SpriteScriptView = Y.Base.create("spriteScriptView", Y.View, [], {
  render : function() {
    this.container.plug(Y.Plugin.Drop);
    Y.DD.DDM.on('drag:drophit', this._onDragEnd, null, this);
    // this.container.drop.on('drop:hit', this._onDropHit, null, this);
  },
  
  _onDragEnd : function(e, self) {    
    var drag = e.drag, dropStackObj,
        dragTarget = drag.dragTarget,
        dstBlockList, dstBlock, isInputBlockDrop,
        dropTargetParent,
        isTop;
    
    // Remove the hover status from all the elements on the drop stack
    Y.Array.each(drag.dropStack, function(v) {
      v.render.set('hoverStatus', null);
    });
    
    // Determine what type of drop target we have
    // If the drop target is a drop list, then populat ethe dstBlockList property
    // If the drop target is a block inside a block list, then we populate
    // the dstBlock and dstBlockList property
    // Otherwise, we populate the dropTargetParent property
    if (drag.dropStack.length > 0) {
      dropStackObj = drag.dropStack[drag.dropStack.length - 1];
      if (dropStackObj.target.type === 'blockList') {
        dstBlockList = dropStackObj.target;
      }
      else {
        dropTargetParent = dropStackObj.target.get('parent');
        dstBlock = dropStackObj.target;
        if (dropTargetParent.type === 'blockList') {
          dstBlockList = dropTargetParent;
        }
        else {
          isInputBlockDrop = true;
        }
      }
      isTop = dropStackObj.isTop;
    }

    // Delete the node that we're dragging
    e.drag.get('dragNode').remove();

    // If we have a block list to add to, then use that
    if (dstBlockList) {
      self.addToBlockList(self._createSrcBlockList(dragTarget), dstBlockList, dstBlock, isTop);
    }
    // Othewrise, if we have an input block we can replace, then we should do that
    else if (isInputBlockDrop && dragTarget.type !== 'blockList') {
      self._replaceInputBlock(dstBlock, dragTarget);
    }
    // Finally, if we don't have a good drop target, then just add the block to the stage
    else {
      self._createNewBlockList(drag, dragTarget);
    }    
  },
  
  /**
   * Creates a new block list on the stage.
   */
  _createNewBlockList : function(drag, dragTarget) {
    var dropNodeRegion = this.container.get('region'),
        dragNodeRegion = drag.get('dragNode').get('region'),
        relX = Math.max(drag.region[0] - dropNodeRegion[0], 0),
        relY = Math.max(drag.region[1] - dropNodeRegion[1], 0),
        blockListRender, srcBlockList;
    
    srcBlockList = this._createSrcBlockList(dragTarget);
    srcBlockList.set('x', relX);
    srcBlockList.set('y', relY);
    blockListRender = new Y.GraphicsBlockListRender({
      parent : this.container,
      model : srcBlockList,
      blockStageContainer : this.container
    });
    blockListRender.render();    
  },
  
  /**
   * Replaces the input block represented by dstBlock with the drag target.
   */
  _replaceInputBlock : function(dstBlock, dragTarget) {
    // Check to see if the dstBlock is a default block.  If it is not, then create a block
    // list with the dstBlock right outside the outer block list
    var parent = dstBlock.get('parent');
    var inputKey, 
      isDefaultBlock = false, 
      inputBlocks = parent.get('inputBlocks'),
      oldInputBlockList,
      oldInputBlockListRender;

    // Find the appropriate input for this block
    Y.each(inputBlocks, function(value, key) {
      console.log(dstBlock);
      console.log(value);
      if (dstBlock === value) {
        inputKey = key;
      }
    });
    
    // Check to see if the input block is a default block
    Y.each(parent._defaultInputBlocks, function(value, key) {
      if (dstBlock === value) {
        isDefaultBlock = true;
      }
    });
    
    // Swap the block that's in the input currently with the new block
    if (inputKey !== null) {
      parent.setInputBlock(inputKey, dragTarget);
    }
    
    // Remove the block that used to be there
    // TODO: the way this should actually work is that it should place the block that used to be next
    // to the given block.
    if (!isDefaultBlock) {
      oldInputBlockList = this._createSrcBlockList(dstBlock);
      oldInputBlockList.set('x', 0);
      oldInputBlockList.set('y', 0);
      oldInputBlockListRender = new Y.GraphicsBlockListRender({
        parent : this.container,
        model : oldInputBlockList,
        blockStageContainer : this.container
      });
      oldInputBlockListRender.render();
    }
  },
  
  /**
   * Helper method for creating the source block list
   */
  _createSrcBlockList : function(dragTarget) {
    var srcBlockList, blocks;
    if (dragTarget.type !== 'blockList') {
      srcBlockList = new Y.BlockListModel();
      blocks = srcBlockList.get('blocks');
      blocks.add(dragTarget);
      srcBlockList.set('blocks', blocks);
    }
    else {
      srcBlockList = new Y.BlockListModel();
      srcBlockList.set('blocks', dragTarget.get('blocks'));
      dragTarget.destroy();
    }
    return srcBlockList;
  },
  
  addToBlockList : function(blockList, dstBlockList, dstBlock, isTop) {
    // In the destination block list, find the index of the destination block
    var dstBlocks = dstBlockList.get('blocks'),
        dstIndex = dstBlocks.indexOf(dstBlock);
    
    if (dstIndex === -1) {
      isTop = true;
      dstIndex = 0;
    }
    
    var i, 
        newBlocks = new Y.ModelList(),
        inserted = false, shouldInsert = false,
        addToNewBlocks = function() {
          var blks = blockList.get('blocks');
          blks.each(function(blk) {
            newBlocks.add(blk);
          });
          inserted = true;
        };
    
    for (i = 0; i < dstBlocks.size(); i += 1) {
      shouldInsert = dstIndex === i;
      if (isTop && shouldInsert) {
        addToNewBlocks();
      }
      newBlocks.add(dstBlocks.item(i));
      if (!isTop && shouldInsert) {
        addToNewBlocks();
      }
    }
    
    if (!inserted) {
      addToNewBlocks();
    }
    
    dstBlockList.set('blocks', newBlocks);
    blockList.set('blocks', new Y.ModelList());
    blockList.destroy();
  }
}, {
  ATTRS : {
    
  }
});

var SpriteStageView = Y.Base.create("spriteStageView", Y.View, [], {
  
}, {
  ATTRS : {
    
  }
});

var SpriteListView = Y.Base.create("spriteListView", Y.View, [], {
  
}, {
  ATTRS : {
    
  }
});


var ScratchWorkstation = Y.Base.create("scratchWorkstation", Y.View, [], {
  blockSelectionView : null,
  spriteScriptView : null,
  spriteListView : null,
  spriteStageView : null,
  
  template : '<div class="scratchWorkstation yui3-g">' +
              '  <div class="blockSelection yui3-u-1-3"></div>' +
              '  <div class="spriteScript yui3-u-2-3"></div>' +
              '  <div class="spriteStage"></div>' +
              '  <div class="spriteList"></div>' +
              '</div>',
             
  render : function() {
    var container = this.container,
        model = this.model, 
        blockSelectionView, 
        spriteScriptView, 
        spriteStageView, 
        spriteListView;
    container.setContent(this.template);
    
    blockSelectionView = new BlockSelectionView({
      container : container.one('.blockSelection'),
      model : model
    });
    spriteScriptView = new SpriteScriptView({
      container : container.one('.spriteScript'),
      model : model
    });
    spriteStageView = new SpriteStageView({
      container : container.one('.spriteStage'),
      model : model
    });
    spriteListView = new SpriteListView({
      container : container.one('.spriteList'),
      model : model
    });
    
    blockSelectionView.render();
    spriteStageView.render();
    spriteScriptView.render();
    spriteListView.render();
  }
});

Y.ScratchWorkstation = ScratchWorkstation;