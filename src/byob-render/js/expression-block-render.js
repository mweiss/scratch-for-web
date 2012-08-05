/*global Y*/
var ExpressionBlockRender,
    DEFAULT_FILL_COLORS = {}, 
    INLINE_BLOCK_VERTICAL_PADDING_WITH_CONNECTORS = 18,
    INLINE_BLOCK_VERTICAL_PADDING_WITHOUT_CONNECTORS = 10,
    INLINE_BLOCK_HORIZONTAL_PADDING = 10;

ExpressionBlockRender = Y.Base.create("expressionBlockRender", Y.BaseBlockRender, [], {
  
  // Properties
  fill: null,
  stroke: null,

  containerTemplate: '<div class="blkExpr"></div>',
  
  // Private internal render properties
  _bgGraphic: null,
  _renderables: null,
  _inlineDims: null,
  _blockDims: null,
  _highlightNode: null,
  _isTopHighlightNode: false,
  _currentRenders: null,
  
  _defaultFill: function() {
    var model = this.get("model");
    return {
      color: DEFAULT_FILL_COLORS[model.category] || "#3851d2"
    };
  },
  
  _defaultStroke: function() {
    return {
      weight: 1
    };
  },
  
  initializer: function(cfg) {
    this.fill = cfg.fill || this._defaultFill();
    this.stroke = cfg.stroke || this._defaultStroke();
    this.currentRenders = [];
    Y.BaseBlockRender.prototype.initializer.call(this, cfg);
  },
  
  _preRender: function(container) {
    this._bgGraphic = new Y.Graphic({render: container});
  },
  
  // TODO: Return a flat array that's friendly to render
  _getFlatRenderableArray: function(model) {
    var blockDefinition = model.get("blockDefinition"),
        inputBlocks = model.get("inputBlocks"),
        statement = blockDefinition.statement,
        renderables = [];
    
    var addToRenderables = function(ele, eleIndex) {
      var type, i, size, name, applyRenderables;
      if (Y.Lang.isString(ele)) {
        renderables.push({
          type: "text",
          value: ele
        });
      }
      else if (Y.Lang.isObject(ele)) {
        type = ele.type;
        if (type === "repeat") {
          size = ele.size;
          applyRenderables = function(subEle) {
            addToRenderables.call(this, subEle, i);
          };
          renderables.push({
            type: "repeat",
            size: size,
            name: ele.name
          });
          for (i = 0; i < size; i += 1) {
            Y.each(ele.subBlocks, applyRenderables, this);
          }
        }
        else {
          name = ele.name;
          renderables.push({
            type: type,
            name: name,
            model: (Y.Lang.isNumber(eleIndex) ? inputBlocks[name][eleIndex] 
                                              : inputBlocks[name])
          });
        }
      }
    };
    
    Y.each(statement, function(ele) {
      addToRenderables.call(this, ele);
    }, this);
    
    return renderables;
  },
  
  _renderRepeat: function(renderable, parent) {
    var blockRender = Y.BlockRender(Y.mix(renderable, {
      parent: parent,
      parentBlock: this.get("model"),
      useDrag : this.get("useDrag"),
      useDrop : this.get("useDrop")
    }));
    this._postRenderBlock(blockRender, renderable);
  },
  
  _renderText: function(renderable, container) {
    var id = Y.guid();
    container.appendChild(
      '<div id=\"' + id + '\" class="blkExpr blkIpe">' + renderable.value + '</div>');
    renderable.container = container.one("#" + id); 
  },
  
  _postRenderBlock: function(blockRender, renderable) {
    var container;
    blockRender.render();
    container = blockRender.get("container");
    container.addClass("blkIpe");
    this.currentRenders.push(blockRender);
    renderable.container = container;
  },
  
  _renderBlock: function(renderable, parent) {
    var blockRender = Y.BlockRender({
          model: renderable.model,
          parent: parent,
          useDrag : this.get("useDrag"),
          useDrop : this.get("useDrop")
        }),
        container;
    
    this._postRenderBlock(blockRender, renderable);
  },
  
  _clearContents: function() {
    var i;
    for (i = 0; i < this.currentRenders.length; i += 1) {
      this.currentRenders[i].destroy();
    }
    this.currentRenders = [];
  },
  
  destroy: function() {
    this._clearContents();
    this.unhighlight();
    ExpressionBlockRender.superclass.destroy.apply(this);
  },
  
  _renderCShape: function(renderable, parent) {
    var bl = new Y.BlockListRender({
      parent: parent,
      model: renderable.model,
      useDrag: this.get("useDrag"),
      useDrop: this.get("useDrop")
    });
    renderable.container = bl.get("container");
    bl.render();
    this.currentRenders.push(bl);
  },
  
  _renderBody: function(model, container) {
    var maxInlineHeight = 0,
        aggregatedInlineWidth = 0,
        inlineBlksToCenter = [],
        inlineDims = [],
        blockDims = [],
        centerInlineBlock = function(e) {
          var totalMargin = maxInlineHeight - e.get('region').height;
          e.setStyle('marginTop', (Math.floor(totalMargin / 2) - 1) + "px");
          e.setStyle('marginBottom', (Math.ceil(totalMargin / 2) + 1) + "px");
        },
        updateBodyInfo = function() {
          Y.each(inlineBlksToCenter, centerInlineBlock);
          if (inlineBlksToCenter.length > 0) {
            inlineDims.push({
              height: maxInlineHeight,
              width: aggregatedInlineWidth
            });
            maxInlineHeight = 0;
            aggregatedInlineWidth = 0;
            inlineBlksToCenter = [];            
          }
          else {
            inlineDims.push({
              height: 20, // The default height for an empty block
              width: 50 // The default width of an empty block
            });
          }
        },
        renderables = this._getFlatRenderableArray(model);
    
    // Render each element in the statement
    Y.each(renderables, function(renderable) {
      switch(renderable.type) {
        case "repeat":
          this._renderRepeat(renderable, container);
        break;
        case "text":
          this._renderText(renderable, container);
        break;
        case "cShape":
          this._renderCShape(renderable, container);
        break;
        default:
          this._renderBlock(renderable, container);
      }
    }, this);
    
    // Vertically center each block
    Y.each(renderables, function(renderable) {
      var rContainer = renderable.container,
          region = rContainer.get("region");
      if (rContainer.hasClass("blkIpe")) {
        maxInlineHeight = Math.max(maxInlineHeight, region.height + this._getInlineBlockVerticalPadding(model));
        aggregatedInlineWidth += region.width + INLINE_BLOCK_HORIZONTAL_PADDING;
        inlineBlksToCenter.push(rContainer);
      }
      else {
        rContainer.setStyle("marginTop", maxInlineHeight);
        updateBodyInfo();
        blockDims.push(region);
        // TODO: I may have to do some centering here with inline blocks,
        // but for now I'll just render without doing anything special
      }
    }, this);
    updateBodyInfo();
    
    this._renderables = renderables;
    this._inlineDims = inlineDims;
    this._blockDims = blockDims;
  },
  
  /**
   * Returns the vertical padding for this type of block.
   */
  _getInlineBlockVerticalPadding: function(model) {
    if (model.get("blockDefinition").type.allowsTopBlocks || model.get("blockDefinition").type.allowsBottomBlocks) {
      return INLINE_BLOCK_VERTICAL_PADDING_WITH_CONNECTORS;
    }
    else {
      return INLINE_BLOCK_VERTICAL_PADDING_WITHOUT_CONNECTORS;
    }
  },
  
  render: function() {
    // Render each block segment.  For each element in the block definition, create an element
    // or sub corresponding sub render.  One thing I need to figure out is how to deal with inline functions
    // and multiple input markers
    var model = this.get("model"),
        container = this.get("container"),
        parent = this.get("parent");
    
    this._clearContents();
    // Clear out anything that may have been in the container
    container.setContent('');
    container.setStyle("width", "");
    if (!container.inDoc() && parent) {
      parent.append(container);
    }
    
    // Render the background
    this._preRender(container);
    this._renderBody(model, container);
    this._renderBackground(model, container);
    this._plugDragDrop(container);
    this.explicitWidthAdjustment(container);
  },
  
  explicitWidthAdjustment: function(container) {
    // Explicitely set the widths of this block, since some browsers
    // have trouble correctly calculating inline block widths without this
    container.setStyle("width", container.get("region").width + 2);
  },
  
  _renderBackground: function(model, container) {
    var getHeightFunc = function(val) {
          return val.height;
        },
        addFunc = function(lastVal, val) {
          return lastVal + val;
        },
        widthMaxFunc = function(lastVal, val) {
          return Math.max(lastVal, val.width);
        },
        inlineHeights = Y.Array.map(this._inlineDims, getHeightFunc),
        blockHeights = Y.Array.map(this._blockDims, getHeightFunc),
        totalHeight = Y.Array.reduce(inlineHeights, 0, addFunc) + Y.Array.reduce(blockHeights, 0, addFunc),
        maxWidth = Y.Array.reduce(this._inlineDims,
          0,
          widthMaxFunc),
        blockDefinition = model.get("blockDefinition");
    
    this._bgGraphic.addShape({
      type: Y.ExpressionBlockShape,
      width: maxWidth,
      height: totalHeight,
      x: 0,
      y: 0,
      fill: this.fill,
      stroke: this.stroke,
      blockHeights: inlineHeights,
      cShapeHeights: blockHeights,
      showTopConnector : blockDefinition.type.allowsTopBlocks,
      showBottomConnector : blockDefinition.type.allowsBottomBlocks
    });
    
    if (totalHeight > container.get("region").height) {
      container.setStyle("height", totalHeight);
    }
  },
  
  _plugDragDrop: function(container) {
    // If this is a drag target, then we should add the drag plug in
    if (this.get("useDrag")) {
      this._plugDrag(container);
    }
  
    if (this.get('useDrop')) {
      this._plugDrop(container);
    }
  },
 
 /**
  * Adds the drag plugin to the container for this expression, and adds the
  * appropriate event listeners on the plugin.
  */ 
  _plugDrag: function(container) {
    container.plug(Y.Plugin.Drag, { dragMode: 'point' });
    container.dd.on('drag:start', this._onDragStart, this);
  },
  
  /**
   * I am a helper method which returns the first ancestor which is a canvas
   * container.
   */
  _getCanvasContainer: function() {
    return this.get('container').ancestor(function(node) {
      return node.hasClass("blockCv");
    });
  },
  
  /**
   * Event listener for dragging this expression.
   */
  _onDragStart: function(e) {
     var drag = e.currentTarget,
         model = this.get("model"),
         parent = model.get("parent"),
         detached, renderable;
          
     if (!parent) {
       throw "It's our assertion that a model that's being dragged must have a parent of some sort";
     }
     
     // Find the parent and detatch this block from the parent.  Detached will return a block list
     // with this model and any other associated models we're dragging
     
     detached = parent.detach(model);
     
     // We need to render the drag proxy
     renderable = Y.BlockRender({
       parent: Y.one("body"),
       model: detached,
       useDrag : false,
       useDrop : false
     });
     
     renderable.render();

     var renderableContainer = renderable.get("container");
     
     drag.set('node', renderableContainer);
     drag.set('dragNode', renderableContainer);
     
      // Add some styles to the proxy node.
     renderableContainer.setStyles({
       opacity: '.5',
       zIndex: 1
     });
     renderableContainer.setAttribute("id", Y.guid());
     drag.render = renderable;
     // We also need to correctly fire render events to re-render the rest of the block list
     // We finally need to fix the block model styles
     drag.model = detached;
     drag.dropStack = new DropStack();
  }

}, {
  ATTRS: {
    isCopyOnDrag : {
      value: false
    }
  }
});

Y.ExpressionBlockRender = ExpressionBlockRender;
