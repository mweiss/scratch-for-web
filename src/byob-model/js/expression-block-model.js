/*global Y BaseRenderableModel*/

var ExpressionBlockModel,
    emptyArrayFunc = function() {
      return [];
    }, emptyObjectFunc = function() {
      return {};
    };

/**
 * I am a prototype for any type of expression block.
 * 
 * I have two attributes, an arbitrary object that maps the name of one of my inputs with a block or array of 
 * blocks that should be used as input, and an array of strings and objects which describe how I'm defined.
 * 
 * I have several properties.  I have a category property which describes what namespace I belong to.  I also
 * have a defaultInputBlocks object, which consists of an object which has instantiated default inputs for my
 * block definition.  The default inputs are the first inputs to exist in my inputBlocks attribute, unless I am
 * replaced by a different block via my setInputBlock() method, or silently by another method.
 * 
 */
ExpressionBlockModel = Y.Base.create("expressionBlockModel", BaseRenderableModel, [], {
  category: null,
  
  defaultInputBlocks: null,
  
  initializer: function(cfg) {
    cfg = cfg || {};
    ExpressionBlockModel.superclass.initializer.call(this, cfg);
    this.defaultInputBlocks = cfg.defaultInputBlocks || {};
    this.category = cfg.category;
  },
  
  /**
   * I am a method which returns a deep copy of myself and any child input or default input blocks.
   */
  copy: function(parent) {
    var copy = new ExpressionBlockModel({
          parent: parent,
          type: this.type,
          blockDefinition: Y.clone(this.get("blockDefinition"))
        }),
        
        copiedBlocks = {},
        
        copyBlock = function(block) {
          var id = block.get("id"), alreadyCopiedBlock = copiedBlocks[id], copied;
          if (alreadyCopiedBlock) {
            return alreadyCopiedBlock;
          }
          else {
            copied = block.copy(copy);
            copiedBlocks[id] = copied;
            return copied;
          }
        },
        
        copyInputBlocks = function(srcBlocks, dstBlocks) {
          Y.each(srcBlocks, function(src, inputName) {
            dstBlocks[inputName] = Y.Lang.isArray(src) ? Y.Array.map(src, copyBlock, this) : copyBlock(src);
          }, this);
        };

    copyInputBlocks(this.get("inputBlocks"), copy.get("inputBlocks"));
    copyInputBlocks(this.defaultInputBlocks, copy.defaultInputBlocks);
    return copy;
  },
  
  /**
   * I am a method which returns true if there exists a block in defaultBlocks that is strictly equal to me.  I return
   * false otherwise.
   */
  _isDefaultBlock: function(block) {
    var found = false;
    Y.each(this.defaultInputBlocks, function(value) {
      found = found || value === block;
    });
    return found;
  },
  
  /**
   * I am a method which sets the input with a given key to the passed in block.  If i is specified, 
   * I will look at inputs that are arrays of blocks.  
   * I fire the inputBlocksChange event if I successfully add a block.
   */
  setInputBlock : function(key, block, i) {
    var inputBlocks = this.get('inputBlocks'),
        oldInput = inputBlocks[key],
        oldBlock;
    block.set('parent', this);
    
    if (Y.Lang.isArray(oldInput) && Y.Lang.isNumber(i)) {
      oldBlock = oldInput[i];
      oldInput[i] = block;
    }
    else {
      inputBlocks[key] = block;
      oldBlock = oldInput;
    }
    
    if (oldBlock && !this._isDefaultBlock(oldBlock)) {
      oldBlock.set('parent', null);
    }
    
    this.fire('inputBlocksChange');
    return oldBlock;
  },
  
  /**
   * I am a method which removes an input with the given value, and sets its parent attribute to null unless it
   * is a default block.  I replace whatever block I remove with the corresponding default block.
   * I fire the inputBlocksChange event if I successfully remove the block.
   */
  removeInputBlock : function(block) {
    var inputBlocks = this.get('inputBlocks'), 
        success = false,
        removeBlock = function() {
          if (!this._isDefaultBlock(block)) {
            block.set('parent', null);
          }
          this.fire('inputBlocksChange');
        };
    
    Y.each(inputBlocks, function(value, key) {
      var index;
      if (Y.Lang.isArray(value)) {
        index = Y.Array.indexOf(value, block);
        if (index !== -1) {
          value[index] = this.defaultInputBlocks[key];
          removeBlock();
        }
      }
      else if (value === block) {
        inputBlocks[key] = this.defaultInputBlocks[key];
        removeBlock();
      }
    }, this);
    
    return block;
  }
},{
  ATTRS: {
    inputBlocks: {
      valueFn: emptyObjectFunc
    },
    blockDefinition: {
      valueFn: emptyArrayFunc
    }
  }
});
