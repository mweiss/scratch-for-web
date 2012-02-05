/*global Y*/

/**
 * FIXME: Enter a description for the scratch-block-model module
 * @module scratch-block-model
 */

/**
 * FIXME: Enter a description for the ScratchBlockModel class
 * @class ScratchBlockModel
 * @extends Widget
 * @constructor
 */
var BaseBlockModel = Y.Base.create("baseBlockModel", Y.Model, [/*Y.WidgetParent*/], {
  _innerBlocksAllowed : false,
  _topBlocksAllowed : false,
  _bottomBlocksAllowed : false,
  _returnsValue : false,
  _category : null,
  _defaultInputBlocks : {},
  
  copy : function() {
    
    // TODO: This method shouldn't be necessary
    var innerBlocks = this.get('innerBlocks'),
        statement = this.get('statement'),
        inputBlocks = this.get('inputBlocks');
        
      
    if (innerBlocks) {
      innerBlocks = new Y.ModelList();
      innerBlocks.add(
        innerBlocks.map(function(value) {
          return value.copy();
        }));
    }
    
    if (inputBlocks) {
      inputBlocks = new Y.ModelList();
      inputBlocks.add(
        inputBlocks.map(function(value) {
          return value.copy();
        }));
    }

    var copy = new BaseBlockModel({
      innerBlocks : innerBlocks,
      statement : statement,
      inputBlocks : inputBlocks
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
   * @override Overriding the model init function so we can initialize the default block inputs.
   */
  init : function(cfg) {
    BaseBlockModel.superclass.init.call(this, cfg);
    this.initializeDefaultBlocks();
  },
  
  createDefaultNumberInputBlockPrototype : function(value) {
    return new BaseBlockModel({
      type : 'default',
      value : value
    });
  },
  
  createMenuItemPrototypeWithValues : function(values) {
    return new BaseBlockModel({
      type : 'menuInput',
      values : values
    });
  },
  
  createDegreePrototypeWithValues : function(value) {
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
  
  initializeDefaultBlocks : function() {
    var initializedInputBlocks = {};
    Y.each(this._defaultInputBlocks, function(value, key) {
      var instance;
      if (Y.Lang.isNumber(value)) {
        instance = this.createDefaultNumberInputBlockPrototype(value);
      }
      else if (Y.Lang.isObject(value)) {
        switch (value.type) {
          case 'menu':
            instance = this.createMenuItemPrototypeWithValues(value.values);
            break;
          case 'degree':
            instance = this.createDegreePrototypeWithValues(value.value);
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

	//CSS_PREFIX: "scratch-block-model",

	ATTRS: {
    innerBlocks : {
      value : null
    },
    
    statement : {
      value : null
    },
    
    inputBlocks : {
      value : null
    }
	}
});

/**
 * Helper method which returns an empty model list.
 */
var emptyModelListFn = function() {
  return new Y.ModelList();
};

var ProgramModel = Y.Base.create('programModel', Y.Model, [], {
  
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

var BlockListModel = Y.Base.create('blockListModel', Y.Model, [], {
  
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
      if (newBlocks.size() > 0) {
        this.set('blocks', newBlocks);
      }
      else {
        // TODO: fix this as well
        // this.destroy()
        
        this.set('blocks', newBlocks);
      }
      splitBlockList = new BlockListModel({
        blocks : splitBlocks
      });
    }
    return splitBlockList;
  }
}, {
  ATTRS : {
    /**
     * The x coordinate of this block list.
     */
    x : {
      value : 0
    },
    /**
     * The y coordinate of this block list.
     */
    y : {
      value : 0
    },
    /**
     * A model list of blocks.  This value should never be null.
     */
    blocks : {
      valueFn : emptyModelListFn
    }
  }
});

Y.BlockListModel = BlockListModel;

/////// ----------
// The following is test code, which should be removed later!
Y.MoveBlockModel = Y.Base.create('moveBlockModel', BaseBlockModel, [],{
  _topBlocksAllowed : true,
  _bottomBlocksAllowed : true,
  _category : 'motion',
  statement : 'move {numSteps} steps',
  
  initialize : function() {
  },
  
  evaluate : function(ctx) {
    var inputBlocks = this.get('inputBlocks'), sprite = ctx.sprite, n = inputBlocks.numSteps.evaluate(ctx);
    ctx.sprite.setX(sprite.getX() + n);
  }
});

Y.ConstantBlockModel = Y.Base.create('ConstantBlockModel', BaseBlockModel,[], {
  _returnsValue : true,
  type : 'constant',
  _category : 'variables',
  
  evaluate : function(ctx) {
    return this.get('value');
  }
}, {
  ATTRS : {
    value : {
      value : null
    }
  }
});

Y.LessThanBlockModel = Y.Base.create('LessThanBlockModel', BaseBlockModel, [],{
  _returnsValue : true,
  statement : '{left} < {right}',
  _category : 'operators',
  
  initialize : function() {
  },
  
  evaluate : function(ctx) {
    var inputBlocks = this.get('inputBlocks'), 
        left = inputBlocks.left.evaluate(ctx), 
        right = inputBlocks.right.evaluate(ctx);
    
    if (Y.Lang.isObject(left)) {
      left = left.get();
    }
    
    if (Y.Lang.isObject(right)) {
      right = right.get();
    }
    return left < right;
  }
});


Y.VariableBlockModel = Y.Base.create('VariableBlockModel', BaseBlockModel, [],{
  _returnsValue : true,
  _category : 'variables',
  
  evaluate : function(ctx) {
    return ctx.getVariable(this.get('variableName'));
  }
},
{
  ATTRS: {
    variableName : {
      value : null
    }
  }
});

Y.IncrementVariableBlockModel = Y.Base.create('IncrementBlockModel', BaseBlockModel, [], {
  _returnsValue : true,
  statement : 'increment {x}',
  _category : 'operators',
  
  initialize : function() {
  },
  
  evaluate : function(ctx) {
    var inputBlocks = this.get('inputBlocks'), x = inputBlocks.x.evaluate(ctx);
    x.set(x.get() + 1);
  }
});

Y.WhileBlockModel = Y.Base.create('whileBlockModel', BaseBlockModel, [], {
  _innerBlocksAllowed : true,
  _topBlocksAllowed : true,
  _bottomBlocksAllowed : true,
  _category : 'control',
  
  statement : 'while {expression}',
  initialize : function() {
  },
  
  evaluate : function(ctx) {
    var innerBlocks, inputBlocks = this.get('inputBlocks');
    var ctxEvaluate = function(v) {
      v.evaluate(ctx);
    };
    
    while (inputBlocks.expression.evaluate(ctx)) {
      innerBlocks = this.get('innerBlocks');
      innerBlocks.each(ctxEvaluate);
    }
  }
});

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
