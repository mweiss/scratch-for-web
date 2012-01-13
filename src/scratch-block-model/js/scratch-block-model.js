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

Y.MoveBlockModel = Y.Base.create('moveBlockModel', BaseBlockModel, [],{
  _topBlocksAllowed : true,
  _bottomBlocksAllowed : true,
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
  
  initialize : function() {
    this.set('statement', '{left} < {right}');
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
  
  initialize : function() {
    this.set('statement', 'increment {x}');
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
  
  initialize : function() {
    this.set('statement', 'while {expression}');
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
