YUI.add('scratch-block-model', function(Y) {

/*global Y*/

/**
 * The scratch block model contains classes related to modeling scratch block and block lists.
 * @module scratch-block-model
 */
var BaseRenderableModel, BaseBlockModel, emptyModelListFn, ProgramModel, BlockListModel;

BaseRenderableModel = Y.Base.create("baseRenderableModel", Y.Model, [], {
  
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
        inputBlocks = this.get('inputBlocks'), newInputBlocks;
      
    if (innerBlocks) {
      newInnerBlocks = new Y.BlockListModel({
        parent : this
      });
      newInnerBlocks.get('blocks').add(
        innerBlocks.get('blocks').map(function(value) {
          return value.copy(newInnerBlocks);
        }));
    }
    
    if (inputBlocks) {
      newInputBlocks = new Y.ModelList();
      newInputBlocks.add(
        inputBlocks.map(function(value) {
          return value.copy(newInputBlocks);
        }));
    }

    var copy = new BaseBlockModel({
      innerBlocks : newInnerBlocks,
      inputBlocks : newInputBlocks,
      value : this.get('value'),
      parent : parent
    });
    
    copy._innerBlocksAllowed = this._innerBlocksAllowed;
    copy._topBlocksAllowed = this._topBlocksAllowed;
    copy._bottomBlocksAllowed = this._bottomBlocksAllowed;
    copy._returnsValue = this._returnsValue;
    copy._category  = this._category;
    copy._defaultInputBlocks  = this._defaultInputBlocks;
    copy.statement  = this.statement;
    
    return copy;
  },
  
  /**
   * Returns true if this block is a valid drop target for the given drag target.
   */
  isValidDropTarget : function(dragTarget) {
    // If the drag target is a block list, then we'll allow this as a drop target only
    // if we're allowed to append to the top or bottom block
    if (dragTarget.type === 'blockList') {
      return this._bottomBlocksAllowed || this._topBlocksAllowed;
    }
    // Otherwise, if the drag target is just a block, we need to make sure that the connector's match.
    else if (this._bottomBlocksAllowed) {
      return dragTarget._topBlocksAllowed;
    }
    else if (this._topBlocksAllowed) {
      return dragTarget._bottomBlocksAllowed;
    }
    // If this block has no top or bottom blocks, the drag target needs to return a value to be considered a valid
    // target
    else {
      return dragTarget._returnsValue;
    }
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
  },
  
  createDefaultNumberInputBlock : function(value) {
    return new BaseBlockModel({
      type : 'default',
      value : value
    });
  },
  
  createMenuItemWithValues : function(values) {
    return new BaseBlockModel({
      type : 'menuInput',
      values : values
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
    var initializedInputBlocks = {};
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
      initializedInputBlocks[key] = instance;
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
      value : null
    },
      
    /**
     * If this block represents a primitive or value, then it is stored in this attribute.
     */
    value : {
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
  initializer : function() {
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
      _defaultInputBlocks: blockDefinition.defaultInput,
      statement : blockDefinition.statement
    }, blockTypeProperties);
    return Y.Base.create(Y.guid(), BaseBlockModel, [], properties);
  }
  
};

Y.BlockDefinitionUtils = new BlockDefinitionUtils();
/*global Y console emptyModelListFn */
var CostumeModel = Y.Base.create("costumeModel", Y.Model, [], {
  
}, {
  ATTRS : {
    width: {
      value : 100
    },
    height : {
      value : 100
    },
    type : {
      value : 'rect'
    },
    style : {
      value : {}
    },
    name : {
      value : ""
    }
  }
});
var SpriteModel = Y.Base.create("spriteModel", Y.Model, [/*Y.WidgetParent*/], {
}, {
  ATTRS : {
    /**
     * A list of block lists.
     */
    scripts : {
      value : emptyModelListFn
    },
    /**
     * A list of costumes for this sprite.
     */
    costumes : {
      value : emptyModelListFn
    },
    
    /**
     * The x position of this sprite.
     */
    x : {
      value : 0
    },
    
    /**
     * The y position of this sprite.
     */
    y : {
      value : 0
    },
    
    /**
     * The direction this sprite is facing.
     */
    direction : {
      value : 0
    },
    
    /**
     * The current costume this sprite is using.
     */
    costume : {
      value : null
    },
    
    /**
     * The size of the sprite.
     */
    size : {
      value : 1
    }
  }
});
/*global Y */
var BLOCK_TYPES = {
  simpleBlock: {
    _topBlocksAllowed: true,
    _bottomBlocksAllowed: true
  },
  controlBlock : {
    _topBlocksAllowed: true,
    _bottomBlocksAllowed: true,
    _innerBlocksAllowed: true
  }
};

Y.BLOCK_TYPES = BLOCK_TYPES;

var SPRITE_BLOCK_DEFINITIONS = {
  motion: [
    { 
      statement: "move {numSteps} steps",
      blockType: "simpleBlock",
      defaultInput: {
        numSteps: 10
      }
    },
    {
      statement: "turn \u21bb {turnRight} degrees",
      blockType: "simpleBlock",
      defaultInput: {
        turnRight: {
          type: 'degree',
          value: 15
        }
      }
    },
    {
      statement: "turn \u21ba {turnLeft} degrees",
      blockType: "simpleBlock",
      defaultInput: {
        turnLeft: {
          type: 'degree',
          value: 15
        }
      }
    },
    {
      statement: "point in direction {direction}",
      blockType: "simpleBlock",
      defaultInput : {
        direction: {
          type: 'menu',
          values: [
            { name : 'right', value : 90, isDefault: true},
            { name : 'left', value : -90 },
            { name : 'up', value : 0 },
            { name : 'down', value : 180 }
          ]
        }
      }
    },
    {
      statement: "point towards {sprite}",
      blockType: "simpleBlock",
      defaultInput : {
        sprite: {
          type: 'pointTowards'
        }
      }
    }
    
  ],
  control : [
    {
      statement : "while {expression}",
      blockType : "controlBlock",
      defaultInput : {
        expression : 'blank'
      }
    }
  ]
};

Y.SPRITE_BLOCK_DEFINITIONS = SPRITE_BLOCK_DEFINITIONS;


}, '@VERSION@' ,{requires:['widget','intl','model','model-list','node-screen']});
