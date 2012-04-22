/*global Y*/
var ExpressionBlockRender, 
    DEFAULT_FILL_COLORS = {}, 
    INLINE_BLOCK_VERTICAL_PADDING_WITH_CONNECTORS = 12,
    INLINE_BLOCK_VERTICAL_PADDING_WITHOUT_CONNECTORS = 6,
    INLINE_BLOCK_HORIZONTAL_PADDING = 6;

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
  
  _defaultFill: function() {
    var model = this.get("model");
    return {
      color: DEFAULT_FILL_COLORS[model.category] || "#3851d2"
    };
  },
  
  _defaultStroke: function() {
    return {
      weight: 0
    };
  },
  
  initializer: function(cfg) {
    this.fill = cfg.fill || this._defaultFill();
    this.stroke = cfg.stroke || this._defaultStroke();
    
    if (cfg.model) {
      cfg.model.on("render", this.render, this);
    }
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
          for (i = 0; i < size; i += 1) {
            Y.each(ele.subBlocks, applyRenderables, this);
          }
          renderables.push({
            type: "repeat",
            size: size,
            name: ele.name
          });
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
      parentBlock: this.get("model")
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
    renderable.container = container;
  },
  
  _renderBlock: function(renderable, parent) {
    var blockRender = Y.BlockRender({
          model: renderable.model,
          parent: parent 
        }),
        container;
    
    this._postRenderBlock(blockRender, renderable);
  },
  
  _renderCShape: function(renderable, parent) {
    var bl = new Y.BlockListRender({
      parent: parent,
      model: renderable.model
    });
    renderable.container = bl.get("container");
    bl.render();
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
        maxWidth = Y.Array.reduce(this._inlineDims, 0, widthMaxFunc),
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
  }
}, {
  ATTRS: {
  }
});

Y.ExpressionBlockRender = ExpressionBlockRender;
