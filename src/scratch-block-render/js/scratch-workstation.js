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
        renderBlock = new Y.GraphicsBlockRender({
          parent : blockPrototypeWrapper,
          block : blockInstance
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
    this.container.drop.on('drop:hit', this._onDropHit, null, this);
    this.container.drop.on('drop:enter', this._onDropEnter, null, this);
    this.container.drop.on('drop:exit', this._onDropExit, null, this);
  },
  
  _onDropHit : function(e, self) {
    // remove the drag instance and create it in the script view
    // Find the region and add it to the script view
    var dropNodeRegion = self.container.get('region'),
        dragNodeRegion = e.drag.get('dragNode').get('region'),
        srcBlock = e.drag.block,
        srcBlockList = e.drag.blockList,
        dstBlockList = e.drag.dstBlockList,
        dstBlock = e.drag.dstBlock,
        isTop = e.drag.isTop,
        blockListContainer = Y.Node.create('<div class="blockListContainer"></div>'),
        relX = Math.max(e.drag.region[0] - dropNodeRegion[0], 0),
        relY = Math.max(e.drag.region[1] - dropNodeRegion[1], 0),
        blockList,
        blockListRender;
    
    if (srcBlock) {
      blockList = new Y.BlockListModel({
        x : relX,
        y : relY
      });
      blockList.get('blocks').add(srcBlock);
    }
    else if (srcBlockList) {
      blockList = srcBlockList;
    }
    
    // Delete the node that we're dragging
    e.drag.get('dragNode').remove();

    // If we have a block list to add to, then use that
    if (dstBlockList) {
      self.addToBlockList(blockList, dstBlockList, dstBlock, isTop);
    }
    else {
      blockListRender = new Y.GraphicsBlockListRender({
        parent : self.container,
        blockList : blockList
      });
      blockListRender.render();
    }
    
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
          newBlocks.add(blks.toArray());
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
  },
  
  _onDropEnter : function(e, self) {
  },
  
  _onDropExit : function(e, self) {
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
              '  <div class="spriteScript yui3-u-1-3"></div>' +
              '  <div class="spriteStage yui3-u-1-3"></div>' +
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