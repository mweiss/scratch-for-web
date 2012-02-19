/*global Y, BaseBlockModel */

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
