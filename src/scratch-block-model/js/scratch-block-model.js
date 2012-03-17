/*global Y*/

/**
 * The scratch block model contains classes related to modeling scratch block and block lists.
 * @module scratch-block-model
 */
var BaseRenderableModel, BaseBlockModel, emptyModelListFn, ProgramModel, BlockListModel;

BaseRenderableModel = Y.Base.create("baseRenderableModel", Y.Model, [], {
  
  initializer : function(config) {
    if (config && config.type) {
      this.type = config.type;
    }
  },
  
  /**
   * Event handler that determines which block should fire the render event.  
   */
  handleRender : function() {
    var parent = this.get('parent');
    if (parent) {
      parent.handleRender();
    }
    else {
      this.fire('render');
    }
  },
  
  getHoverStatus : function(isTop) {
    return 'top';
  },
  
  /**
   * Returns true if it's okay to consider this renderable model a drop target for the given drag target.
   * Drag target is also a BaseRenderableModel.
   */
  isValidDropTarget : function(dragTarget) {
    // By default nothing is a valid drop target.
    return false;
  }
},{
  INVALID_VALUE: "INVALID",
  
  ATTRS: {
    /**
     * The parent block or block list.
     */
    parent : {
      value : null
    }
  }
});

/**
 * The base block model represents a scratch execution block.
 * @class BaseBlockModel
 * @extends Widget
 * @constructor
 */
BaseBlockModel = Y.Base.create("baseBlockModel", BaseRenderableModel, [/*Y.WidgetParent*/], {
  /**
   * If true, this block allows an inner block list.  This is true for blocks like while and if.
   */
  _innerBlocksAllowed : false,
  /**
   * If true, the top connector should show for this block.  Hat blocks and input blocks have this set to false.
   */
  _topBlocksAllowed : false,
  /**
   * If true, the bottom connector should show for this block.  End blocks have this set to false.
   */
  _bottomBlocksAllowed : false,
  /**
   * Returns true if this block returns a value that another block can use as an argument.
   */
  _returnsValue : false,
  /**
   * The category of this block.
   */
  _category : null,
  /**
   * An object of input names to of default input blocks.  Blocks in the object are copied when dragged into
   * the stage.
   */
  _defaultInputBlocks : {},
  
  /**
   * The template text to show for the block.
   */
  statement : null,
  
  /**
   * The type of block.  By default all blocks are type 'block'.  Primitives and input blocks have different types,
   * which is when this property is relevant.
   */
  type : 'block',
  
  /**
   * Makes a complete copy of this block.
   */
  copy : function(parent) {
    
    // TODO: This method shouldn't be necessary
    var innerBlocks = this.get('innerBlocks'), newInnerBlocks,
        inputBlocks = this.get('inputBlocks'), newInputBlocks = {},
        defaultInputBlocks = this._defaultInputBlocks, newDefaultInputBlocks;
      
    if (innerBlocks) {
      newInnerBlocks = new Y.BlockListModel({
        parent : this
      });
      newInnerBlocks.get('blocks').add(
        innerBlocks.get('blocks').map(function(value) {
          return value.copy(newInnerBlocks);
        }));
    }

    var copy = new BaseBlockModel({
      innerBlocks : newInnerBlocks,
      inputBlocks : newInputBlocks,
      value : this.get('value'),
      values : this.get('values'),
      parent : parent
    });
        
    if (inputBlocks) {
      Y.each(inputBlocks, function (value, key) {
        newInputBlocks[key] = value.copy(copy);
      }, this);
    }
    
    if (this._defaultInputBlocks) {
      newDefaultInputBlocks = {};
      Y.each(this._defaultInputBlocks, function (value, key) {
        if (inputBlocks[key] === value) {
          newDefaultInputBlocks[key] = newInputBlocks[key];
        }
        else {
          newDefaultInputBlocks[key] = value.copy(copy);
        }
      }, this);
    }

    copy._innerBlocksAllowed = this._innerBlocksAllowed;
    copy._topBlocksAllowed = this._topBlocksAllowed;
    copy._bottomBlocksAllowed = this._bottomBlocksAllowed;
    copy._returnsValue = this._returnsValue;
    copy._category  = this._category;
    copy._defaultInputBlocks  = newDefaultInputBlocks;
    
    copy.statement  = this.statement;
    copy.type = this.type;
    
    return copy;
  },
  
  /**
   * Sets the input on this block and fires the inputBlocksChange event.
   */
  setInputBlock : function(key, block) {
    var inputBlocks = this.get('inputBlocks');
    block.set('parent', this);
    inputBlocks[key] = block;
    this.fire('inputBlocksChange');
  },
  
  /**
   * Returns true if this block is a valid drop target for the given drag target.
   */
  isValidDropTarget : function(dragTarget) {
    var blocks, topBlock, bottomBlock, blTarget, validDropTarget;
    
    var dragTargetTopBlocksAllowed, dragTargetBottomBlocksAllowed, dragTargetReturnsValue;
    
    // If the drag target is a block list, then we'll allow this as a drop target only
    // if we're allowed to append to the top or bottom block
    if (dragTarget.type === 'blockList') {
      blocks = dragTarget.get('blocks');
      topBlock = blocks.item(0);
      bottomBlock = blocks.item(blocks.size() - 1);
      dragTargetTopBlocksAllowed = topBlock._topBlocksAllowed;
      dragTargetBottomBlocksAllowed = bottomBlock._bottomBlocksAllowed;
      dragTargetReturnsValue = blocks.size() === 1 && topBlock._returnsValue;
    }
    else {
      dragTargetTopBlocksAllowed = dragTarget._topBlocksAllowed;
      dragTargetBottomBlocksAllowed = dragTarget._bottomBlocksAllowed;
      dragTargetReturnsValue = dragTarget._returnsValue;
    }

    // Either the drop allows the top  to connect to the bottom of the drag target, vise versa, or
    // the drop target doesn't allow top or bottom blocks and has a parent block that indicates it's nested
    // in another block.
    return (this._bottomBlocksAllowed && dragTargetTopBlocksAllowed) ||
           (this._topBlocksAllowed && dragTargetBottomBlocksAllowed) ||
           (!this._topBlocksAllowed && 
            !this._bottomBlocksAllowed && 
            dragTargetReturnsValue && 
            this.get('parent').type !== 'blockList');
  },
  
  /**
   * Returns the hover status for this block model.
   */
  getHoverStatus : function(isTop) {
    if (!(this._bottomBlocksAllowed || this._topBlocksAllowed)) {
      return 'self';
    }
    else {
      return isTop ? 'top' : 'bottom';
    }
  },
  /**
   * @override Overriding the model init function so we can initialize the default block inputs.
   */
  init : function(cfg) {
    BaseBlockModel.superclass.init.call(this, cfg);
    this.initializeDefaultBlocks();
    this.after('inputBlocksChange', this.handleRender);
  },
  
  createDefaultNumberInputBlock : function(value) {
    return new BaseBlockModel({
      type : 'numberInput',
      value : value
    });
  },
  
  createMenuItemWithValues : function(values) {
    var defaultValue = Y.Array.find(values, function(v) {
      return v.isDefault;
    });
    
    return new BaseBlockModel({
      type : 'menuInput',
      values : values,
      value : defaultValue
    });
  },
  
  createDegreeWithValues : function(value) {
    return new BaseBlockModel({
      type : 'degreeInput',
      value : value
    });
  },
  
  createPointTowardsWithValues : function(value) {
    return new BaseBlockModel({
      type : 'pointTowards',
      value : value 
    });
  },
  
  createDefaultEmptyInput : function(value) {
    return new BaseBlockModel({
      type : value
    });
  },
  
  initializeDefaultBlocks : function() {
    var initializedInputBlocks = {}, inputBlocks = this.get('inputBlocks');
    Y.each(this._defaultInputBlocks, function(value, key) {
      var instance;
      if (Y.Lang.isNumber(value)) {
        instance = this.createDefaultNumberInputBlock(value);
      }
      else if (Y.Lang.isObject(value)) {
        switch (value.type) {
          case 'menu':
            instance = this.createMenuItemWithValues(value.values);
            break;
          case 'degree':
            instance = this.createDegreeWithValues(value.value);
            break;
          case 'pointTowards':
            instance = this.createPointTowardsWithValues(value.value);
            break;
          default:
            // Do nothing.
        }
      }
      if (!instance) {
        instance = this.createDefaultEmptyInput(value);
      }
      instance.set('parent', this);
      initializedInputBlocks[key] = instance;
      if (!inputBlocks[key]) {
        inputBlocks[key] = instance;
      }
    }, this);
    
    this._defaultInputBlocks = initializedInputBlocks;    
  },
  
	evaluate : function(ctx) {
	  // For the base block model, execute will do nothing.
	}
	
},{
	ATTRS: {
    innerBlocks : {
      valueFn : function() {
        return new BlockListModel({
          parent : this
        });
      },
      setter : function(value) {
        value.set('parent', this);
        return value;
      }
    },
    
    inputBlocks : {
      value : {}
    },
      
    /**
     * If this block represents a primitive or value, then it is stored in this attribute.
     */
    value : {
      value : null
    },
    
    /**
     * The possible values for this block model.
     */
    values : {
      value : null
    }
	}
});

/**
 * Helper method which returns an empty model list.
 */
emptyModelListFn = function() {
  return new Y.ModelList();
};

ProgramModel = Y.Base.create('programModel', Y.Model, [], {
  
}, {
  ATTRS : {
    background : {
      valueFn : emptyModelListFn
    },
    sprites : {
      valueFn : emptyModelListFn
    }
  }
});

/**
 * Model that represents a consecutive set of blocks.
 */
BlockListModel = Y.Base.create('blockListModel', BaseRenderableModel, [], {
  
  /**
   * Initializes the render handler when the blocks property changes.
   */
  initializer : function(config) {
    this.after('blocksChange', this.handleRender);
  },
  
  type : 'blockList',
  
  /**
   * A block list is only a valid drop target if it's empty.  Otherwise, we defer any drop actions
   * to the individual blocks.
   */
  isValidDropTarget : function(dragTarget) {
    return this.get('blocks').size() === 0;
  },
  
  /**
   * Helper method which removes the blocks from this block to the end of the model list and
   * replaces the blocks model list.
   */
  splitBlockList : function(model) {
    var blocks = this.get('blocks'),
        index = blocks.indexOf(model),
        newBlocks = new Y.ModelList(), splitBlocks = new Y.ModelList(), splitBlockList, i;
    
    if (index !== -1) {
      for (i = 0; i < blocks.size(); i += 1) {
        if (i < index) {
          newBlocks.add(blocks.item(i));
        }
        else {
          splitBlocks.add(blocks.item(i));
        }
      }
      
      this.set('blocks', newBlocks);
      if (newBlocks.size() === 0 && !this.isInline()) {
        this.destroy();
      }
      splitBlockList = new BlockListModel({
        blocks : splitBlocks
      });
    }
    return splitBlockList;
  },
  
  isInline : function() {
    return this.get('parent') !== null;
  }
}, {
  ATTRS : {
    /**
     * The parent block model that contains this block list.
     */
    parent : {
      value : null
    },
    /**
     * The x coordinate of this block list.  This attribute only matters if parent is null.
     */
    x : {
      value : 0
    },
    /**
     * The y coordinate of this block list.  This attribute only matters if parent is null.
     */
    y : {
      value : 0
    },
    /**
     * A model list of blocks.  This value should never be null.
     */
    blocks : {
      valueFn : emptyModelListFn,
      
      setter : function(value) {
        if (value) {
          value.each(function(v) {
            v.set('parent', this);
          }, this);
        }
        return value;
      }
    }
  }
});

Y.BlockListModel = BlockListModel;

/**
 * A temporary utility class for loading blocks.  TODO: needs to know the context of how it's loading block definitions
 * and in general is not a good pattern so it's something I need to replace.
 */
var BlockDefinitionUtils = function() {
};

BlockDefinitionUtils.prototype = {
  loadBlocksForCategory : function(category) {
    return Y.Array.map(Y.SPRITE_BLOCK_DEFINITIONS[category], function(blockDefinition) {
      return this.initBlockPrototype(blockDefinition, category);
    }, this);
  },
  
  initBlockPrototype : function(blockDefinition, category) {
    var blockTypeProperties = Y.BLOCK_TYPES[blockDefinition.blockType],
        defaultInputBlocks = blockDefinition.defaultInputBlocks;
    var properties = Y.mix({
      _category: category,
      _defaultInputBlocks: blockDefinition.defaultInput ? blockDefinition.defaultInput : {},
      statement : blockDefinition.statement
    }, blockTypeProperties);
    return Y.Base.create(Y.guid(), BaseBlockModel, [], properties);
  }
  
};

Y.BlockDefinitionUtils = new BlockDefinitionUtils();
