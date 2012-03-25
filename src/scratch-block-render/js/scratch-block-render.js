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
    // TODO: there's a bug where the hover class doesn't show as isn't being updated if you drag a block that
    // is an input block over another input block.
    if (hoverStatus === 'self') {
      this.container.addClass('blockHover');
    }
    else {
      this.container.removeClass('blockHover');
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

