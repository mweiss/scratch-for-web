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

