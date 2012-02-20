/*global Y console*/
/**
 * This module contains the code to render blocks and block lists.
 * 
 * @module scratch-block-render
 */

var DEFAULT_BLOCK_COLOR = '#3851d2';

/**
 * Custom drop plugin which ignores offset width and offset height when determining the drop target region.
 */
var IgnoreOffsetDrop = function(config) {
  config.node = config.host;
  this.block = config.block;
  IgnoreOffsetDrop.superclass.constructor.apply(this, arguments);
};

Y.extend(IgnoreOffsetDrop, Y.Plugin.Drop, {
  
  initDropAndRegion : function() {
    Y.DD.DDM._addValid(this);
    this.region = this.get('node').get('region');
    Y.DD.DDM.useHash = false;
  },
  
  /**
   * Overrides the destroy method to unregester this drop and to remove it from the
   * other drops property on the drag and drop manager.
   */
  destroy : function() {
    Y.DD.DDM._unregTarget(this);
    Y.each(Y.DD.DDM.otherDrops, function(value, key) {
      if (value === this) {
        delete Y.DD.DDM.otherDrops[key];
      }
    }, this);
    IgnoreOffsetDrop.superclass.destroy.call(this);
  },
  
  initializer : function() {
    // If this is not a regular block, we need to wait until everything renders before 
    // initializing.  For now, we'll just set an artificial timeout.
    if (!this.block) {
      Y.later(0, this, function() {
        this.initDropAndRegion();
      });      
    }
    else {
      this.initDropAndRegion();
    }
  },
  
  /**
   * Overrides the size shim method so that we only use the node's region, and not the offset width or padding
   * of the node.
   */
  sizeShim : function() {
    if (!Y.DD.DDM.activeDrag) {
      return false; //Nothing is dragging, no reason to activate.
    }
    if (this.get('node') === Y.DD.DDM.activeDrag.get('node')) {
      return false;
    }
    if (this.get('lock')) {
      return false;
    }
    if (!this.shim) {
      Y.later(100, this, this.sizeShim);
      return false;
    }
    this.region = this.get('node').get('region');
  }
}, {
  NAME : "ignore-offset-drop-plugin",
  NS : "drop"
});


/**
 * A shape that represents a rounded basic block.  The top and bottom connectors can be modified
 * by setting the showBottomConnector and showTopConnector properties.
 */
var RoundedBasicBlock = Y.Base.create("roundedBasicBlock", Y.Shape, [],{
  
  /**
   * Draws the rounded basic block.
   */
  _draw: function() {
    var w = this.get("width"),
        h = this.get("height"),
        ew = this.get("ellipseWidth"),
        eh = this.get("ellipseHeight"),
        showBottomConnector = this.get("showBottomConnector"),
        showTopConnector = this.get("showTopConnector"),
        connectorIndent = this.get("connectorIndent"),
        connectorWidth = this.get("connectorWidth");
    this.clear();
    this.moveTo(0, eh);
    if (showBottomConnector) { 
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
    if (showTopConnector) {
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
    /**
     * If true, we show the top connector.
     */
    showTopConnector : {
      value : true
    },
    /**
     * If true, we show the bottom connector.
     */
    showBottomConnector : {
      value : true
    },
    /**
     * The elipse width of the block.
     */
    ellipseWidth: {
      value: 5
    },
    /**
     * The elipse height of the block.
     */
    ellipseHeight: {
      value: 5
    },
    /**
     * The ident of the top and bottom connector.
     */
    connectorIndent: {
      value : 15
    },
    /**
     * The width of the connector.
     */
    connectorWidth: {
      value : 20
    }
  }, Y.Shape.ATTRS)
});

/**
 * A shape that represents a control block.  This block has a space in the middle to contain inner blocks.
 */
var RoundedContainerBlock = Y.Base.create("roundedContainerBlock", RoundedBasicBlock, [], {
  
  /**
   * Draws the rounded container block.
   */
  _draw : function() {
    var w = this.get("width"),
        h = this.get("height"),
        ew = this.get("ellipseWidth"),
        eh = this.get("ellipseHeight"),
        showBottomConnector = this.get("showBottomConnector"),
        showTopConnector = this.get("showTopConnector"),
        connectorIndent = this.get("connectorIndent"),
        connectorWidth = this.get("connectorWidth"),
        bodyHeight = this.get("bodyHeight"),
        footerHeight = this.get("footerHeight"),
        leftConnectorWidth = this.get("leftConnectorWidth");
    
    this.clear();
    this.moveTo(0, eh);
    
    // Bottom of the footer    
    if (showBottomConnector) { 
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
    if (showTopConnector) {
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
    /**
     * The default height of the inner section of the container.
     */
    bodyHeight : {
      value : 15
    },
    /**
     * The additional offset to add to the inner section for connectors.
     */
    leftConnectorWidth : {
      value : 15
    },
    /**
     * The height of the footer part of the connector.
     */
    footerHeight : {
      value : 25
    }
  }, RoundedBasicBlock.ATTRS)
});

/**
 * A view which renders a block list to the block stage.
 */
var GraphicsBlockListRender = Y.Base.create("graphicsBlockListRender", Y.View, [], {
  
  _currentBlockRenders : null,
  
  /**
   * Container element for a graphics block list.
   */
  container : '<div class="blockList"></div>',
  
  hover : null,
  /**
   * Initializes the block list by adding an event handler to this block list's rendering event.
   */
  initializer : function() {
    var blockList = this.get('blockList');
    if (blockList) {
      blockList.after("render", this.render, this);
      blockList.after("destroy", this.destroy, this);
    }
  },

  destroy: function() {
    this._clearContents();
    GraphicsBlockListRender.superclass.destroy.call(this);
    this.container.remove();
  },
  
  /**
   * Renders/Re-renders the graphics block list.  Removes all the elements in this block list,
   * then re-renders the block list.
   */
  render : function() {
    var blockList = this.get('blockList'),
        blocks = blockList.get('blocks'),
        isInline = blockList.isInline();
    
    // Set this block list's position on the stage if it's not part of another block.
    if (!isInline) {
      this.container.setStyle('left', blockList.get('x'));
      this.container.setStyle('top', blockList.get('y'));
      this.container.setStyle('position', 'absolute');
    }
    
    // If the container is not in the document, add it to the parent element.
    if (!this.container.inDoc()) {
      this.get('parent').append(this.container);
    }
    
    // Reset the contents of the block list
    this._clearContents();
    
    this._currentBlockRenders = [];
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
        blockStageContainer : this.get('blockStageContainer'),
        plugDragDrop : this.get('plugDragDrop')
      });
      graphicsBlock.render();
      region = graphicsBlock.container.get('region');
      blockWrapper.setStyle('width', region.width);
      blockWrapper.setStyle('height', region.height);
      this._currentBlockRenders.push(graphicsBlock);
    }, this);
    
    // Default the height if ther are no blocks in the block list and we're an inline block
    if (blocks.size() === 0 && isInline) {
      this.container.setStyle('height', '15px');
    }
  },
  
  /**
   * Clears the contents of the block list and destroys the current blocks in the block render.
   */
  _clearContents : function() {

    if (this.container.drop) {
      this.container.drop.destroy();
    }
    if (this._currentBlockRenders) {
      Y.Array.each(this._currentBlockRenders, function(blockRender) {
        if (blockRender.container.drop) {
          blockRender.container.drop.destroy();
        }
        if (blockRender.container.dd) {
          blockRender.container.dd.destroy();
        }
        if (blockRender.innerBlockRender) {
          blockRender.innerBlockRender.destroy();
        }
        blockRender.container.remove();
      });
    }
    this.container.setContent('');
  }
}, {
  ATTRS : {
    /**
     * The stage where this block list will be rendered.
     */
    'blockStageContainer' : {
      value : null
    },
    /**
     * The block list model.  TODO: consolidate with the model attribute for view
     */
    'blockList' : {
      value : null
    },
    /**
     * The parent container for this block list render.  This value is optional if the container is already
     * in the document.
     */
    'parent' : {
      value : null
    },
    
    'plugDragDrop' : {
      value : true
    },
    
    'hoverStatus' : {
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
  innerBlockRender : null,
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
    this.after('hoverStatusChange', this._renderHoverStatus);
  },
  
  _renderHoverStatus : function(e) {
    if (this.hover) {
      this.hover.remove();
    }
    
    var hoverStatus = this.get('hoverStatus');
    if (hoverStatus === 'top' || hoverStatus === 'bottom') {
      var partition = Y.Node.create('<div></div>');
      partition.setStyle("width", "80px");
      partition.setStyle("height", "15px");
      partition.setStyle("opacity", 0.5);
      partition.setStyle("backgroundColor", "#000");
      partition.setStyle("position", "absolute");
      partition.setStyle("zIndex", 999);
      var region = this.container.get('region');
      
      if ((region.width === 0 && region.height === 0) && this.container.drop && this.container.drop.region) {
        region = this.container.drop.region;
      }
      // Add the child to the document
      Y.one("body").appendChild(partition);
      partition.setXY([region.left, hoverStatus === 'top' ? region.top : region.bottom]);
      
      this.hover = partition;
    }

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
      blockStageContainer : this.get('blockStageContainer'),
      plugDragDrop : false
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
        blockStageContainer : this.get('blockStageContainer'),
        plugDragDrop : this.get('plugDragDrop')
      });
      
      // TODO:
      // Since _renderHoverStatus only require this.container, this method also works
      // with 'this' being a blockListREnder.  However, it should be explicit in the class
      // heirarchy that this happens.
      gbList.after('hoverStatusChange', this._renderHoverStatus);
      gbList.render();
      
      // Handle the case when the number of inner blocks is zero, so we need to listen to drop
      // events directly on the block list
      if (innerBlocks.get('blocks').size() === 0 && !this._copyOnDrag && this.get('plugDragDrop')) {
        gbList.container.plug(IgnoreOffsetDrop);
        gbList.container.drop.on('drop:enter', this._onDropEnter, this, innerBlocks, gbList);
        gbList.container.drop.on('drop:exit', this._onDropExit, this, innerBlocks, gbList);
      }
      
      // TODO:
      // Indent as far as the width of the left bar, for now we'll say it's 15, but
      // we need to get this property dynamically
      
      // TODO: I need to redo this in terms of 'innerWidth' and 'outerWidth'
      var paddingLeft = parseInt(this.container.getStyle('paddingLeft').split("px")[0], 10);
      var paddingTop = parseInt(this.container.getStyle('paddingTop').split("px")[0], 10);
      gbList.container.setStyle('marginLeft', 15 - paddingLeft);   
      gbList.container.setStyle('marginTop', bodyHeight - paddingTop);
      
      this.innerBlockRender = gbList;
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
        showTopConnector : block._topBlocksAllowed,
        showBottomConnector : block._bottomBlocksAllowed
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
        showTopConnector : block._topBlocksAllowed,
        showBottomConnector : block._bottomBlocksAllowed
      });
    }

    // I'm confused why I need to do this for firefox, but if we don't set an explicit width on
    // blocks that contain several inline blocks, firefox will wrap the last block to the next line
    if (block._topBlocksAllowed) {
      container.setStyle('width', width);
    }
    this._plugDragDrop();
  },
  
  _plugDragDrop : function() {
    if (this.get('plugDragDrop')) {
      this.container.plug(Y.Plugin.Drag, { dragMode: 'point' }); // TODO: try different drag modes
      
      this.container.dd.on('drag:start', this._onDragStart, null, this);
      if (!this._copyOnDrag) {
        this.container.plug(IgnoreOffsetDrop, {
          block: this.get('block')
        });

        this.container.drop.on('drop:over', this._onDropEnter, this, this.get('block'), this);
        this.container.drop.on('drop:enter', this._onDropEnter, this, this.get('block'), this);
        this.container.drop.on('drop:exit', this._onDropExit, this, this.get('block'), this);
      } 
    }
  },

  _updateDropStack : function(drag, dropTargetModel, dropTargetRender, isTop) {
    var dropStack = drag.dropStack,
        objIndex,
        dropStackObj = Y.Array.find(dropStack, function(v) {
      return v.target === dropTargetModel;
    });
    
    if (!dropStackObj) {
      dropStackObj = {
        target: dropTargetModel,
        render : dropTargetRender
      };
      dropStack.push(dropStackObj);
    }
    else {
      objIndex = Y.Array.indexOf(dropStackObj);
      if (objIndex !== -1) {
        dropStack[objIndex] = dropStack[dropStack.length - 1];
        dropStack[dropStack.length - 1] = dropStackObj;
      }
    }
    dropStackObj.isTop = isTop;
    
    // If the current drop stack object is the active drop element, update the hover status
    this._updateHoverStatus(dropStack);
    
  },
  
  /**
   * Updates the hover status of the drop stack object and nulls out the hover status of other
   * objects.
   */
  _updateHoverStatus: function(dropStack) {
    var dropStackObj;
    if (dropStack.length > 0) {
      dropStackObj = dropStack[dropStack.length - 1];
      dropStackObj.render.set('hoverStatus', 
        dropStackObj.target.getHoverStatus(dropStackObj.isTop));
    }
      
    Y.Array.each(dropStack, function(v, i) {
      if (i !== dropStack.length - 1) {
        v.render.set('hoverStatus', null);  
      }
    });
  },
  
  /**
   * Returns true if the mouse position is closer to the top of this block then the bottom
   * of it.
   */
  _determineIsTop : function(drag, drop) {
    var dropTop = drop.region.top,
        dropBottom = drop.region.bottom,
        mouseY = drag.mouseXY[1];
    
    return Math.abs(mouseY - dropTop) < Math.abs(mouseY - dropBottom);
  },
  
  /**
   * Helper method which removes the given element from the drop stack and updates the hover status
   * of each other element.
   */
  _removeFromDropStack : function(drag, dropTargetBlock) {
    var dropStack = drag.dropStack,
        dropStackObj = Y.Array.find(dropStack, function(v) {
          return v.target === dropTargetBlock;
        });
        
    drag.dropStack = Y.Array.reject(dropStack, function(v) {
      return v === dropStackObj;
    });
    dropStack = drag.dropStack;
    
    
    if (dropStackObj) {
      dropStackObj.render.set('hoverStatus', null);
      this._updateHoverStatus(dropStack);
    }

  },
  
  _onDropEnter : function(e, dropTargetModel, dropTargetRender) {
    var drag = e.drag,
        dragTarget = drag.dragTarget,
        isTop;
    if (dropTargetModel.isValidDropTarget(dragTarget)) {
      isTop = this._determineIsTop(drag, e.drop);
      this._updateDropStack(drag, dropTargetModel, dropTargetRender, isTop);
    }
  },
  
  _onDropExit : function(e, dropTargetBlock) {
    var drag = Y.DD.DDM.activeDrag;

    if (drag) {
      this._removeFromDropStack(drag, dropTargetBlock);
    }
  },
  
  _onDragStart : function(e, self) {
    var blockList = self.get('parentBlockList'),
        drag = this,
        splitBlockList, splitBlockListRender,
        blockStageContainer = self.get('blockStageContainer'),
        copiedBlock;
    
    //Stop the event
    e.stopPropagation();
    
    // Reset the drop stack
    drag.dropStack = [];
    
    if (blockList && blockStageContainer) {
      
      // Get the block list that we're going to be dragging
      splitBlockList = blockList.splitBlockList(self.get('block'));
      
      // Render the node on the stage
      splitBlockListRender = new GraphicsBlockListRender({
        parent : blockStageContainer,
        blockStageContainer : blockStageContainer,
        blockList : splitBlockList,
        plugDragDrop : false
      });
      
      splitBlockListRender.render();
      drag.dragTarget = splitBlockList;
      self.setupModDD(splitBlockListRender.container, drag);      
    }
    
    if (self._copyOnDrag) {  
      //Some private vars
      copiedBlock = new GraphicsBlockRender({
        parent : self.get('parent'),
        block : self.get('block').copy(),
        plugDragDrop : false
      });      
      copiedBlock.render();
      
      // Set the block on the drag instance
      drag.dragTarget = copiedBlock.get('block').copy();
      
      // Setup the DD instance
      self.setupModDD(copiedBlock.container, drag);
    }
    
  },
  
  /**
   * Helper method to setup the drag node.
   */
  setupModDD: function(mod, drag) {
    drag.set('dragNode', mod);
    // Add some styles to the proxy node.
    drag.get('dragNode').setStyles({
      opacity: '.5',
      zIndex: 1
    }); 
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
    },
    'plugDragDrop' : {
      value : true
    },
    'hoverStatus' : {
      value : null
    }
  }
});

Y.GraphicsBlockRender = GraphicsBlockRender;

