YUI.add('scratch-block-render', function(Y) {

/*global Y console*/

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

Y.RoundedBasicBlock = RoundedBasicBlock;
Y.RoundedContainerBlock = RoundedContainerBlock;
/*global Y console*/
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

Y.IgnoreOffsetDrop = IgnoreOffsetDrop;
/*global Y console*/
/**
 * This module contains the code to render blocks and block lists.
 * 
 * @module scratch-block-render
 */

var DEFAULT_BLOCK_COLOR = '#3851d2';

var BaseGraphicsBlockRender, NumberInputBlockRender, MenuInputBlockRender, GraphicsBlockRender;

/**
 * Factory method for creating graphics blocks.  This method looks at the type property of the model and
 * chooses the appropriate render to apply with that model.
 */
GraphicsBlockRender = function(cfg) {
  var block = cfg.model;
  switch (block.type) {
    case 'block':
      return new BaseGraphicsBlockRender(cfg);
    case 'numberInput':
    // TODO: I should design some cool inputs for these, but for now, we're going with number inputs
    case 'degreeInput':
      return new NumberInputBlockRender(cfg);
    case 'menuInput':
      return new MenuInputBlockRender(cfg);
    // Default to the basic block render for now
    default:
      return new BaseGraphicsBlockRender(cfg);
  }
};

var BaseGraphicsRender = Y.Base.create("baseGraphicsRender", Y.View, [], {
  hover : null,
  
  /**
   * Helper method for showing the hover graphic for this render.
   */ 
  renderHoverStatus : function(e) {
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

  }
},{
  ATTRS : {
    /**
     * The stage where this block list will be rendered.
     */
    'blockStageContainer' : {
      value : null
    },
    
    /**
     * The parent container for this block list render.  This value is optional if the container is already
     * in the document.
     */
    'parent' : {
      value : null
    },
    
    /**
     * If true, this block is subject to drag and drop events.
     */
    'plugDragDrop' : {
      value : true
    },
    
    /**
     * The hover status of this renderable block.
     */
    'hoverStatus' : {
      value : null
    }
  }
});

/**
 * A view which renders a block list to the block stage.
 */
var GraphicsBlockListRender = Y.Base.create("graphicsBlockListRender", BaseGraphicsRender, [], {
  
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
    var blockList = this.model;
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
    var blockList = this.model,
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
      graphicsBlock = Y.GraphicsBlockRender({
        model : block,
        parent : blockWrapper,
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
});

Y.GraphicsBlockListRender = GraphicsBlockListRender;

/**
 * This is a prototype class for using YUI graphics to render a scratch block.
 */
BaseGraphicsBlockRender = Y.Base.create("graphicsBlockRender", BaseGraphicsRender, [], {
  container : '<div class="basicBlock"></div>', 
  innerBlockRender : null,
  blockBody : null,
  _copyOnDrag : false,
  
  initializer : function() {
    var block = this.model, color = '#55BA00';
    
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
    this.after('hoverStatusChange', this.renderHoverStatus);
  },
  
  _renderBody : function() {
    var block = this.model, 
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
    var newBlock = GraphicsBlockRender({
      model : block,
      container : parent,
      blockStageContainer : this.get('blockStageContainer')
    });
    newBlock.render();
  },
  
  _renderInnerBlock : function(bodyHeight) {
    var block = this.model, innerBlocks = block.get('innerBlocks');
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
        model : innerBlocks,
        blockStageContainer : this.get('blockStageContainer'),
        plugDragDrop : this.get('plugDragDrop')
      });
      
      gbList.after('hoverStatusChange', this.renderHoverStatus);
      gbList.render();
      
      // Handle the case when the number of inner blocks is zero, so we need to listen to drop
      // events directly on the block list
      if (innerBlocks.get('blocks').size() === 0 && !this._copyOnDrag && this.get('plugDragDrop')) {
        gbList.container.plug(Y.IgnoreOffsetDrop);
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
    var block = this.model, 
        container = this.container,
        parent = this.get('parent'),
        bgGraphic, region, width, height, bodyWidth, bodyHeight,
        // For now, we'll only render the background if the block type is 'block'
        renderBackground = block.type === 'block';
    
    this.container.setContent('');
    // Make sure the container is in the document
    if (!container.inDoc() && parent) {
      parent.append(this.container);
    }
    
    if (renderBackground) {
      bgGraphic = new Y.Graphic({render : container});   
    }
    
    this._renderBody();
    bodyWidth = container.get("region").width;
    bodyHeight = container.get("region").height;
    this._renderInnerBlock(bodyHeight);
    region = container.get("region");
    width = region.width;
    height = region.height;

    if (renderBackground) {
      this._renderBackground(bgGraphic, block, width, height, bodyWidth, bodyHeight);
    }
    
    // I'm confused why I need to do this for firefox, but if we don't set an explicit width on
    // blocks that contain several inline blocks, firefox will wrap the last block to the next line
    if (block._topBlocksAllowed) {
      container.setStyle('width', width);
    }
    this._plugDragDrop();
  },
  
  /**
   * Helper method which renders the block's 
   */
  _renderBackground : function(bgGraphic, block, width, height, bodyWidth, bodyHeight) {   
    if (block._innerBlocksAllowed) {
      bgGraphic.addShape({
        type: Y.RoundedContainerBlock,
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
      this.container.setStyle('height', height + 5);
    }
    else {
      bgGraphic.addShape({
        type: Y.RoundedBasicBlock,
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
  },
  
  _plugDragDrop : function() {
    if (this.get('plugDragDrop')) {
      this._plugDrag();
      
      if (!this._copyOnDrag) {
        this.container.plug(Y.IgnoreOffsetDrop, {
          block: this.model
        });

        this.container.drop.on('drop:over', this._onDropEnter, this, this.model, this);
        this.container.drop.on('drop:enter', this._onDropEnter, this, this.model, this);
        this.container.drop.on('drop:exit', this._onDropExit, this, this.model, this);
      } 
    }
  },

  _plugDrag: function() {
    this.container.plug(Y.Plugin.Drag, { dragMode: 'point' }); // TODO: try different drag modes  
    this.container.dd.on('drag:start', this._onDragStart, null, this);
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
    var parent = self.model.get('parent'),
        blockList = parent && parent.type === 'blockList' ? parent : null,
        drag = this,
        splitBlockList, splitBlockListRender,
        blockStageContainer = self.get('blockStageContainer'),
        copiedBlockRender;
    
    //Stop the event
    e.stopPropagation();
    
    // Reset the drop stack
    drag.dropStack = [];
    
    // Handle the case where there exists a block list, but it's just a wrapper around a block that returns
    // a value.  In this case, we don't want to treat the block 
    if (blockList && blockList.isSingleReturnValueBlock()) {
      blockList = null;
    }
    
    // The case where we're dragging a block list
    if (blockList && blockStageContainer) {
      // Get the block list that we're going to be dragging
      splitBlockList = blockList.splitBlockList(self.model);
      
      // Render the node on the stage
      splitBlockListRender = new GraphicsBlockListRender({
        parent : blockStageContainer,
        blockStageContainer : blockStageContainer,
        model : splitBlockList,
        plugDragDrop : false
      });
      
      splitBlockListRender.render();
      drag.dragTarget = splitBlockList;
      self.setupModDD(splitBlockListRender.container, drag);      
    }
    // The case where we're dragging an input that needs to be copied onto the stage
    else if (self._copyOnDrag) {  
      // Some private vars
      copiedBlockRender = GraphicsBlockRender({
        parent : self.get('parent'),
        model : self.model.copy(),
        plugDragDrop : false
      });      
      copiedBlockRender.render();
      
      // Set the block on the drag instance
      drag.dragTarget = copiedBlockRender.model.copy();
      
      // Setup the DD instance
      self.setupModDD(copiedBlockRender.container, drag);
    }
    // The case where we're dragging a block that shouldn't be copied
    else {
      drag.dragTarget = self.model;
      if (parent && parent.type === 'blockList') {
        parent.splitBlockList(self.model);
      }
      else if (parent) {
        parent.removeInputBlock(self.model);
      }
      
      copiedBlockRender = GraphicsBlockRender({
        parent : blockStageContainer,
        blockStageContainer : blockStageContainer,
        model : self.model,
        plugDragDrop : false
      });
      copiedBlockRender.render();
      
      self.setupModDD(copiedBlockRender.container, drag);
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
    /**
     * TODO: is there a better way then setting the fill color on the render as an attribute?
     */ 
    'blockFillColor' : {
      value : '#3851d2'
    }
  }
});

/**
 * This is the render for a number input block.
 */
NumberInputBlockRender = Y.Base.create("numberInputBlockRender", BaseGraphicsBlockRender, [], {
  _plugDrag: function() {
    // Do nothing.
  },
  
  _renderBody : function() {
    var block = this.model;
    this.container.appendChild('<input type="number" value="' + block.get('value') + '"></input>');
    this.container.one('input').after('change', function(e) {
      block.set('value', e.target.get('value'));
    });
  }
});

/**
 * This is the render for a menuInput block.
 */
MenuInputBlockRender = Y.Base.create("menuInputBlockRender", BaseGraphicsBlockRender, [], {
  _renderBody : function() {
    var block = this.model,
        values = this.model.get('values'),
        value = this.model.get('value');
    
    // Construct the select element
    var selectMenu = '<select>';
    Y.Array.each(values, function(o) {
      selectMenu += '<option value="' + o.value + '" ' + (o.value === value ? 'selected ' : '') + '>' +
                    o.name + 
                    '</option>';
    });
    selectMenu += '</select>';
    
    this.container.appendChild(selectMenu);
    this.container.one('select').after('change', function(e) {
      var selectedIndex = e.target.get('selectedIndex');
      block.set('value', values[selectedIndex].value);
    });
  },
  
  _plugDrag: function() {
    // Do nothing.
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


}, '@VERSION@' ,{use:['base','view','scratch-block-model','dd-plugin','dd-drop-plugin','graphics','substitute','escape','tabview']});
