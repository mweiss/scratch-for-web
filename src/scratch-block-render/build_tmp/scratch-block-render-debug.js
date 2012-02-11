YUI.add('scratch-block-render', function(Y) {

/*global Y console*/
/**
 * FIXME: Enter a description for the scratch-block-render module
 * @module scratch-block-render
 */

var DEFAULT_BLOCK_COLOR = '#3851d2';

var RoundedBasicBlock = Y.Base.create("roundedBasicBlock", Y.Shape, [],{
  
  _draw: function() {
    var w = this.get("width"),
        h = this.get("height"),
        ew = this.get("ellipseWidth"),
        eh = this.get("ellipseHeight"),
        showFooter = this.get("showFooter"),
        showHeader = this.get("showHeader"),
        connectorIndent = this.get("connectorIndent"),
        connectorWidth = this.get("connectorWidth");
    this.clear();
    this.moveTo(0, eh);
    if (showFooter) { 
      this.lineTo(0, h - 2 * eh);
      this.quadraticCurveTo(0, h - eh, ew, h - eh);
      this.lineTo(connectorIndent, h - eh);
      this.quadraticCurveTo(connectorIndent, h, connectorIndent + ew, h);
      this.lineTo(connectorIndent + connectorWidth - ew, h);
      this.quadraticCurveTo(connectorIndent + connectorWidth, h, connectorIndent + connectorWidth, h - eh);
      this.lineTo(w - ew, h - eh);
      this.quadraticCurveTo(w, h - eh, w, h - 2 * eh);
    }
    else {
      this.lineTo(0, h - eh);
      this.quadraticCurveTo(0, h, ew, h);
      this.lineTo(w - ew, h);
      this.quadraticCurveTo(w, h, w, h - eh);
    }
    
    this.lineTo(w, eh);
    this.quadraticCurveTo(w, 0, w - ew, 0);
    if (showHeader) {
      this.lineTo(connectorIndent + connectorWidth, 0);
      this.quadraticCurveTo(connectorIndent + connectorWidth, eh, connectorIndent + connectorWidth - ew, eh);
      this.lineTo(connectorIndent + ew, eh);
      this.quadraticCurveTo(connectorIndent, eh, connectorIndent, 0);
    }
    this.lineTo(ew, 0);
    this.quadraticCurveTo(0, 0, 0, eh);
    this.end();
  }  
}, {
  NAME: "roundedBasicBlock",
  ATTRS: Y.mix({
    showHeader : {
      value : true
    },
    showFooter : {
      value : true
    },
    ellipseWidth: {
      value: 5
    },
    ellipseHeight: {
      value: 5
    },
    connectorIndent: {
      value : 15
    },
    connectorWidth: {
      value : 20
    }
  }, Y.Shape.ATTRS)
});


var RoundedContainerBlock = Y.Base.create("roundedContainerBlock", RoundedBasicBlock, [], {
  _draw : function() {
    var w = this.get("width"),
        h = this.get("height"),
        ew = this.get("ellipseWidth"),
        eh = this.get("ellipseHeight"),
        showFooter = this.get("showFooter"),
        showHeader = this.get("showHeader"),
        connectorIndent = this.get("connectorIndent"),
        connectorWidth = this.get("connectorWidth"),
        bodyHeight = this.get("bodyHeight"),
        footerHeight = this.get("footerHeight"),
        leftConnectorWidth = this.get("leftConnectorWidth");
    
    this.clear();
    this.moveTo(0, eh);
    
    // Bottom of the footer    
    if (showFooter) { 
      this.lineTo(0, h - 2 * eh);
      this.quadraticCurveTo(0, h - eh, ew, h - eh);
      this.lineTo(connectorIndent, h - eh);
      this.quadraticCurveTo(connectorIndent, h, connectorIndent + ew, h);
      this.lineTo(connectorIndent + connectorWidth - ew, h);
      this.quadraticCurveTo(connectorIndent + connectorWidth, h, connectorIndent + connectorWidth, h - eh);
      this.lineTo(w - ew, h - eh);
      this.quadraticCurveTo(w, h - eh, w, h - 2 * eh);
    }
    else {
      this.lineTo(0, h - eh);
      this.quadraticCurveTo(0, h, ew, h);
      this.lineTo(w - ew, h);
      this.quadraticCurveTo(w, h, w, h - eh);
    }
    this.lineTo(w, h - (footerHeight - eh));
    
    // Top of the footer
    this.quadraticCurveTo(w, h - footerHeight, w - eh, h - footerHeight);
    this.lineTo(leftConnectorWidth + connectorIndent + connectorWidth, h - footerHeight);
    this.quadraticCurveTo(leftConnectorWidth + connectorIndent + connectorWidth, 
      h - footerHeight + eh, 
      leftConnectorWidth + connectorIndent + connectorWidth - ew, 
      h - footerHeight + eh);
    this.lineTo(leftConnectorWidth + connectorIndent + ew, h - footerHeight + eh);
    this.quadraticCurveTo(leftConnectorWidth + connectorIndent, 
      h - footerHeight + eh, 
      leftConnectorWidth + connectorIndent,
      h - footerHeight);
    this.lineTo(leftConnectorWidth + ew, h - footerHeight);
    
    // Bottom of the header
    this.quadraticCurveTo(leftConnectorWidth, h - footerHeight, leftConnectorWidth, h - footerHeight - eh);
    this.lineTo(leftConnectorWidth, bodyHeight + eh);
    this.quadraticCurveTo(leftConnectorWidth, bodyHeight, leftConnectorWidth + ew, bodyHeight);
    this.lineTo(leftConnectorWidth + connectorIndent, bodyHeight);
    this.quadraticCurveTo(leftConnectorWidth + connectorIndent, 
      bodyHeight + eh, 
      leftConnectorWidth + connectorIndent + ew,
      bodyHeight + eh);
    this.lineTo(leftConnectorWidth + connectorIndent + connectorWidth - ew, bodyHeight + eh);
    this.quadraticCurveTo(leftConnectorWidth + connectorIndent + connectorWidth,
      bodyHeight + eh,
      leftConnectorWidth + connectorIndent + connectorWidth,
      bodyHeight);
    this.lineTo(w - ew, bodyHeight);
    this.quadraticCurveTo(w, bodyHeight, w, bodyHeight - eh);
    this.lineTo(w, eh);
    
    // Top of the header
    this.quadraticCurveTo(w, 0, w - ew, 0);
    if (showHeader) {
      this.lineTo(connectorIndent + connectorWidth, 0);
      this.quadraticCurveTo(connectorIndent + connectorWidth, eh, connectorIndent + connectorWidth - ew, eh);
      this.lineTo(connectorIndent + ew, eh);
      this.quadraticCurveTo(connectorIndent, eh, connectorIndent, 0);
    }
    this.lineTo(ew, 0);
    this.quadraticCurveTo(0, 0, 0, eh);
    this.end();
  }
}, {
  NAME: "roundedContainerBlock",
  ATTRS: Y.mix({
    bodyHeight : {
      value : 15
    },
    leftConnectorWidth : {
      value : 15
    },
    footerHeight : {
      value : 25
    }
  }, RoundedBasicBlock.ATTRS)
});

/**
 * This is a prototype class for rendering a list of block commands.
 */
var GraphicsBlockListRender = Y.Base.create("graphicsBlockListRender", Y.View, [], {
  container : '<div class="blockList"></div>',
  
  initializer : function() {
    var blockList = this.get('blockList');
    if (blockList) {
      blockList.after("render", this.render, this);
    }
  },

  render : function() {
    var blockList = this.get('blockList'),
        blocks = blockList,
        isInline = blockList.isInline();
    
    blocks = blockList.get('blocks');
    blockList.detachAll('blocksChange');
    blockList.after('blocksChange', blockList.handleRender);
    
    if (!isInline) {
      this.container.setStyle('left', blockList.get('x'));
      this.container.setStyle('top', blockList.get('y'));
      this.container.setStyle('position', 'absolute');
    }

    
    if (!this.container.inDoc()) {
      this.get('parent').append(this.container);
    }
    
    // reset the contents of the block list
    this.container.setContent('');
    
    blocks.each(function(block) {
      // Wrap the block wrapper
      var blockWrapper = Y.Node.create('<div class="blockWrapper"></div>'), 
          region,
          graphicsBlock;
      this.container.append(blockWrapper);
      graphicsBlock = new Y.GraphicsBlockRender({
        block : block,
        parent : blockWrapper,
        parentBlockList : this.get('blockList'),
        blockStageContainer : this.get('blockStageContainer')
      });
      graphicsBlock.render();
      region = graphicsBlock.container.get('region');
      blockWrapper.setStyle('width', region.width);
      blockWrapper.setStyle('height', region.height);
    }, this);
    
    // Default the height if ther are no blocks in the block list and we're an inline block
    if (blocks.size() === 0 && isInline) {
      this.container.setStyle('height', '15px');
    }
  }
}, {
  ATTRS : {
    'blockStageContainer' : {
      value : null
    },
    'blockList' : {
      value : null
    },
    'parent' : {
      value : null
    }
  }
});

Y.GraphicsBlockListRender = GraphicsBlockListRender;

/**
 * This is a prototype class for using YUI graphics to render a scratch block.
 */
var GraphicsBlockRender = Y.Base.create("graphicsBlockRender", Y.View, [], {
  container : '<div class="basicBlock"></div>',  
  blockBody : null,
  _copyOnDrag : false,
  
  initializer : function() {
    var block = this.get('block'), color = '#55BA00';
    
    if (block) {
      switch (block._category) {
        case 'motion':
          color = DEFAULT_BLOCK_COLOR;
          break;
        case 'control':
          color = '#d89d00';
          break;
      }
      block.after("render", this.render, this);
    }
    
    this.set('blockFillColor', color);
  },
  
  _renderBody : function() {
    var block = this.get('block'), 
        inputBlocks = block.get('inputBlocks'), 
        idToBlockMap = {}, 
        maxHeight = 0,
        ctx = {},
        container = this.container,
        statement;
    if (block.type === 'constant') {
      statement = "" + block.get('value');
    }
    else {
      Y.each(inputBlocks, function(value, key) {
        var id = Y.guid();
        idToBlockMap[id] = value;
        ctx[key] = '<div id="' + id + '" class="basicBlock inputParentBlock"></div>';
      });
      Y.each(block._defaultInputBlocks, function(value, key) {
        if (!inputBlocks || !inputBlocks[key]) {
          var id = Y.guid();
          idToBlockMap[id] = value;
          ctx[key] = '<div id="' + id + '" class="basicBlock inputParentBlock"></div>';
        }
      });
      statement = block.statement;
    }    
    
    // escape the statement
    statement = Y.Escape.html(statement);
    // Split up the statement into blocks that can be centered vertically later
    var variableRegex = /\{[^}]+\}/g,
        splitStatement = statement.split(variableRegex),
        matches = statement.match(variableRegex),
        newStatement = "";
    Y.each(splitStatement, function(value, index) {
      var id = Y.guid();
      
      // Add the id to the block map as a null entry.  We're doing this so we can keep track of each
      // block and center them later
      idToBlockMap[id] = null;
      
      newStatement += '<div id="' + id + '" class="basicBlock inputParentBlock">' + value + '</div>';
      if (matches && matches[index]) {
        newStatement += matches[index];
      }
    });

    var subbedVal = Y.substitute(newStatement, ctx);

    // Add the block to the container
    container.appendChild(subbedVal);
    
    // Render each input block in the newly created node and update the max height property
    Y.each(idToBlockMap, function(block, id) {
      var parent = container.one('#' + id);
      if (block) {
        this._renderBlock(container, block, parent);
      }
      // Now update the max height property
      maxHeight = Math.max(maxHeight, parent.get('region').height);
    }, this);
    
    // Now we need to vertically center each block
    Y.each(idToBlockMap, function(block, id) {
      var parent = container.one('#' + id);
      var totalMargin = maxHeight - parent.get('region').height;
      parent.setStyle('marginTop', Math.floor(totalMargin / 2) + "px");
      parent.setStyle('marginBottom', Math.ceil(totalMargin / 2) + "px");
    }, this);
  },
  
  _renderBlock : function(container, block, parent) {
    var region = container.get("region");
    var newBlock = new GraphicsBlockRender({
      block : block,
      container : parent,
      blockStageContainer : this.get('blockStageContainer')
    });
    newBlock.render();
  },
  
  _renderInnerBlock : function(bodyHeight) {
    var block = this.get('block'), innerBlocks = block.get('innerBlocks');
    if (block._innerBlocksAllowed) {
      
      // Default the inner block if none is specified
      // TODO: move this logic to the model
      if (!innerBlocks) {
        innerBlocks = new Y.BlockListModel({
          parent : block
        });
        block.set('innerBlocks', innerBlocks);
      }
      else {
        innerBlocks.set('parent', block);
      }
      var gbList = new GraphicsBlockListRender({
        parent : this.container,
        blockList : innerBlocks,
        blockStageContainer : this.get('blockStageContainer')
      });
      gbList.render();
      
      // Handle the case 
      if (innerBlocks.get('blocks').size() === 0 && !this._copyOnDrag) {
        gbList.container.plug(Y.Plugin.Drop);
        gbList.container.drop.on('drop:enter', this._handleEmptyInnerEnter, null, this);
        gbList.container.drop.on('drop:exit', this._handleEmptyInnerExit, null, this);
      }
      
      // TODO:
      // Indent as far as the width of the left bar, for now we'll say it's 15, but
      // we need to get this property dynamically
      
      // TODO: I NEED TO RETHINK THIS
      var paddingLeft = parseInt(this.container.getStyle('paddingLeft').split("px")[0], 10);
      var paddingTop = parseInt(this.container.getStyle('paddingTop').split("px")[0], 10);
      gbList.container.setStyle('marginLeft', 15 - paddingLeft);   
      gbList.container.setStyle('marginTop', bodyHeight - paddingTop);
    }
  },
  
  _handleEmptyInnerEnter : function(e, self) {
    var drag = e.drag;
    var block = self.get('block');
    if (drag) {
      drag.innerBlockList = block.get('innerBlocks');
    }
  },
  
  _handleEmptyInnerExit : function(e, self) {
    var drag = Y.DD.DDM.get('activeDrag');
    if (drag && drag.innerBlockList && drag.innerBlockList.get('blocks').size() === 0) {
      drag.innerBlockList = null;
    }
  },
  
  render : function() {
    var block = this.get('block'), 
        container = this.container,
        parent = this.get('parent'),
        basicBlock, region, width, height, bodyWidth, bodyHeight;
    
    this.container.setContent('');
    // Make sure the container is in the document
    if (!container.inDoc() && parent) {
      parent.append(this.container);
    }
    basicBlock = new Y.Graphic({render : container});    
    this._renderBody();
    bodyWidth = container.get("region").width;
    bodyHeight = container.get("region").height;
    this._renderInnerBlock(bodyHeight);
    region = container.get("region");
    width = region.width;
    height = region.height;
    
    if (block._innerBlocksAllowed) {
      basicBlock.addShape({
        type: RoundedContainerBlock,
        width: bodyWidth,
        height: height + 20, // TODO: come up with a better way of doing the footer height, also why can't this be 25?
        bodyHeight: bodyHeight,
        x: 0,
        y: 0,
        fill: {
          color : this.get('blockFillColor')
        },
        stroke : {
          weight : 0
        },
        showHeader : block._topBlocksAllowed,
        showFooter : block._bottomBlocksAllowed
      });
      // force the height of the container to match the new calculated height
      // TODO: this is another case where I'm hardcoding the height of the tab
      container.setStyle('height', height + 5);
    }
    else {
      basicBlock.addShape({
        type: RoundedBasicBlock,
        width: width,
        height: height + (block._bottomBlocksAllowed ? 5 : 0),
        x: 0,
        y: 0,
        fill: {
          color : this.get('blockFillColor')
        },
        stroke : {
          weight : 0
        },
        showHeader : block._topBlocksAllowed,
        showFooter : block._bottomBlocksAllowed
      });
    }
    

    this._plugDragDrop();
  },
  
  _plugDragDrop : function() {
    
    this.container.plug(Y.Plugin.Drag, { dragMode: 'intersect' });
    this.container.plug(Y.Plugin.Drop);

    this.container.dd.on('drag:start', this._bringToFront, null, this);
    this.container.dd.on('drag:end', this._bringToBack, null, this);
    this.container.drop.on('drop:enter', this._onDropEnter, null, this);
    this.container.drop.on('drop:exit', this._onDropExit, null, this);
  },
  
  _onDropEnter : function(e, self) {
    var drag = e.drag;
    var block = self.get('block');
    
    if (block._bottomBlocksAllowed ||  block._topBlocksAllowed) {
      drag.dstBlock = self.get('block');
      drag.dstBlockList = self.get('parentBlockList');    
    }
  },
  
  _onDropExit : function(e, self) {
    var drag = Y.DD.DDM.get('activeDrag');
    if (drag && drag.dstBlock == self.get('block')) {
      drag.dstBlock = null;
      drag.dstBlockList = null;
    }
  },
  
  _bringToFront : function(e, self) {
    var blockList = self.get('parentBlockList'),
        drag = this,
        splitBlockList, splitBlockListRender,
        blockStageContainer = self.get('blockStageContainer'),
        copiedBlock;
    
    //Stop the event
    e.stopPropagation();
      
    self.container.setStyle("zIndex", 1);
    
    if (blockList && blockStageContainer) {
      // Set the source block list on the drag instance
      // drag.dstBlockList = blockList;
      
      // Get the block list that we're going to be dragging
      splitBlockList = blockList.splitBlockList(self.get('block'));
      
      // Render the node on the stage
      splitBlockListRender = new GraphicsBlockListRender({
        parent : blockStageContainer,
        blockStageContainer : blockStageContainer,
        blockList : splitBlockList
      });
      
      splitBlockListRender.render();
      drag.blockList = splitBlockList;
      self.setupModDD(splitBlockListRender.container, drag);      
    }
    
    // If we're supposed to copy on drag, we need to 
    if (self._copyOnDrag) {  
      //Some private vars
      copiedBlock = new GraphicsBlockRender({
        parent : self.get('parent'),
        block : self.get('block')
      });      
      copiedBlock.render();
      
      // Set the block on the drag instance  TODO: is this the best way?
      drag.block = copiedBlock.get('block').copy();
      
      // TODO: This doesn't make sense right now, since I'm justing messing
      // around, figure out the correct event structure
      
      // Setup the DD instance
      self.setupModDD(copiedBlock.container, drag);

      // Remove the listener TODO: I don't know if we need this
      // this.detach('drag:start', this._bringToFront);
    }
    
  },
  
  /**
   * Helper method to setup the drag node.
   */
  setupModDD: function(mod, drag) {
    drag.set('dragNode', mod);
      //Add some styles to the proxy node.
    drag.get('dragNode').setStyles({
      opacity: '.5'
    });
    
    //Remove the event's on the original drag instance
    //dd.detachAll('drag:start');
    //dd.detachAll('drag:end');
    //dd.detachAll('drag:drophit');
    
    //It's a target
    //dd.set('target', true);
    //Setup the handles
    //dd.addHandle('div.basicBlock');
    //Remove the mouse listeners on this node
    //dd._unprep();
    //Update a new node
    // dd.set('node', mod);
    //Reset the mouse handlers
    //dd._prep();
        
  },
  
  _bringToBack : function(e, self) {
    self.container.setStyle("zIndex", 0);
  }
}, {
  ATTRS : {
    'parentBlockList' : {
      value : null
    },
    
    'blockStageContainer' : {
      value : null
    },
    
    'block' : {
      value : null,
      writeOnce : true
    },
    'parent' : {
      value : null
    },
    'blockFillColor' : {
      value : '#3851d2'
    }
  }
});

Y.GraphicsBlockRender = GraphicsBlockRender;

/*global Y*/

/**
 * Renders the scratch sprite.
 */
var ScratchSpriteRender = Y.Base.create("ScratchSpriteRender", Y.View, [], {
  container : '<div class="sprite"></div>',
  
  initialize : function() {
    // When the sprite's costume changes, change the rendered costume.
    this.model.after('costumeChange', this.renderCostume, this);
    this.model.after('xChange', this._shapeChange, this);
    this.model.after('yChange', this._shapeChange, this);
    this.model.after('sizeChange', this._shapeChange, this);
  },
  
  _shapeChange : function(e) {
    var container = this.container, 
        model = this.model, 
        size = model.get('size'), 
        costume = model.get('costume');
        
    container.set('x', model.get('x'));
    container.set('y', model.get('y'));
    container.set('width', costume.get('width') * size);
    container.set('height', costume.get('height') * size);
  },
  
  render : function() {
    var model = this.model;
    this.renderCostume();
  },
  
  renderCostume : function() {
    var costume = this.model.get('costume'), type = costume.get('type');
    switch (type) {
      case 'rect':
      case 'circle':
        this._renderShape(costume);
        break;
      default:
        break;
    }
  },
  
  _renderShape : function(costume) {
    var style = costume.get('style'),
        model = this.model,
        graphics = this.graphics,
        size = model.get('size');
    this.container = graphics.addShape(Y.mix({ 
      type : costume.get('type'),
      x : model.get('x'),
      y : model.get('y'),
      width : costume.get('width') * size,
      height : costume.get('height') * size
    }, style));
  }
}, {
  ATTRS : {
    parent : {
      value : null
    },
    graphics : {
      value : null
    }
  }
});

Y.ScratchSpriteRender = ScratchSpriteRender;

var ScratchStageRender = Y.Base.create("ScratchStageRender", Y.View, [], {
  _spriteRenders : null,
  
  container : '<div class="scratchStageRender"></div>',
  render : function() {
    var container = this.container, sprites = this.get('sprites'), graphics = new Y.Graphics(container);
    
    container.width = this.get('width');
    container.height = this.get('height');
    
    // Add each sprite in its appropriate spot
    this._spriteRenders = sprites.map(function(sprite) {
      var spriteRender = new ScratchSpriteRender({
        parent : this.container,
        model : sprite,
        graphics : graphics
      });
      spriteRender.render();
    }, this);
  }
},
{
  ATTRS: {
    sprites : {
      values : null
    },
    width : {
      value : 600
    },
    height : {
      value : 600
    }
  }
});

Y.ScratchStageRender = ScratchStageRender;
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
        innerBlockList = e.drag.innerBlockList,
        srcBlockList = e.drag.blockList,
        dstBlockList = e.drag.dstBlockList,
        dstBlock = e.drag.dstBlock,
        isTop = e.drag.isTop,
        blockListContainer = Y.Node.create('<div class="blockListContainer"></div>'),
        relX = Math.max(e.drag.region[0] - dropNodeRegion[0], 0),
        relY = Math.max(e.drag.region[1] - dropNodeRegion[1], 0),
        blockList,
        blockListRender;
    
    if (innerBlockList) {
      dstBlockList = innerBlockList;
    }
    if (srcBlock) {
      blockList = new Y.BlockListModel({
        x : relX,
        y : relY
      });
      srcBlock.set('parent', blockList);
      blockList.get('blocks').add(srcBlock);
    }
    else if (srcBlockList) {
      blockList = srcBlockList;
      blockList.set('x', relX);
      blockList.set('y', relY);
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
        blockList : blockList,
        blockStageContainer : self.container
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
          blks.each(function(blk) {
            blk.set('parent', dstBlockList);
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


}, '@VERSION@' ,{use:['base','view','scratch-block-model','dd-plugin','dd-drop-plugin','graphics','substitute','escape','tabview']});
