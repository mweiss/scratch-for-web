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
    
    if (!cfg._noRefresh) {
      this._refreshDefaultInputBlocks();
    }
  },
  
  /**
   * Returns the default input block for the given type.
   */
  _getDefaultInputBlock: function(type) {
    switch (type) {
      case "reporter":
      case "statement":
        return new ExpressionBlockModel({blockDefinition: {
          type: Y.BlockTypes[type],
          statement: []
        },
        parent: this
        });
      case "cShape":
        return new Y.BlockListModel({ parent: this });
      default:
        throw "This block is not supported " + type.name;
    } 
  },
  
  /**
   * I am a method which initializes default input blocks that have not been initialized yet.  If the
   * corresponding input block has not been created, I silently set that input to the default input.
   */
  _refreshDefaultInputBlocks: function() {
    var inputBlocks = this.get("inputBlocks"), 
        defaultInputBlocks = this.defaultInputBlocks;
    
    var setInputBlocks = function(ele, inputIndex) {
      var type, name, size, i, j;
      if (Y.Lang.isObject(ele)) {
        type = ele.type;
        name = ele.name;
        if (type === "repeat") {
          size = ele.size;
          Y.each(ele.subBlocks, function(subBlock) {
            if (Y.Lang.isObject(subBlock)) {
              if (!defaultInputBlocks[subBlock.name]) {
                defaultInputBlocks[subBlock.name] = [];
              }
              if (!inputBlocks[subBlock.name]) {
                inputBlocks[subBlock.name] = [];
              }
              for (i = 0; i < size; i += 1) {
                setInputBlocks.call(this, subBlock, i);
              }
            }
          }, this);
        }
        else {
          if (Y.Lang.isNumber(inputIndex) && !defaultInputBlocks[name][inputIndex]) {
            defaultInputBlocks[name][inputIndex] = this._getDefaultInputBlock(type);
          }
          else if (!defaultInputBlocks[name]) {
            defaultInputBlocks[name] = this._getDefaultInputBlock(type);
          }
          
          if (Y.Lang.isNumber(inputIndex) && !inputBlocks[name][inputIndex]) {
            inputBlocks[name][inputIndex] = defaultInputBlocks[name][inputIndex];
          }
          else if (!inputBlocks[name]) {
            inputBlocks[name] = defaultInputBlocks[name];
          }
        }
      }
    };
    
    Y.each(this.get('blockDefinition').statement, function(ele) {
      setInputBlocks.call(this, ele);
    }, this);
  },
  
  replaceBlock: function(blockToReplace, blockToAdd) {
    var removed = this.removeInputBlock(blockToReplace), key, index, inputBlocks;
    if (removed) {
      key = removed.key;
      index = removed.index;
      inputBlocks = this.get("inputBlocks");
      if (index !== -1) {
        inputBlocks[key][index] = blockToAdd;
      }
      else {
        inputBlocks[key] = blockToAdd;
      }
      blockToAdd.set("parent", this);
    }
    return removed;
  },
  
  /**
   * I am a method which returns a deep copy of myself and any child input or default input blocks.
   */
  copy: function(parent) {
    var copy = new ExpressionBlockModel({
          parent: parent,
          type: this.type,
          blockDefinition: Y.clone(this.get("blockDefinition")),
          _noRefresh: true
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
   * I am a method which returns true if there exists a block in defaultBlocks that is strictly equal to me.
   * I return false otherwise.
   */
  _isDefaultBlock: function(block) {
    var found = false;
    var isDefaultBlock = function(value) {
      if (Y.Lang.isArray(value)) {
        found = Y.each(value, isDefaultBlock);
      }
      else {
        found = found || value === block;
      }
    };
    
    Y.each(this.defaultInputBlocks, isDefaultBlock);
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
  
  incrRepeat: function(name) {
    this._modifyRepeat(name, 1);
  },
  
  _modifyRepeat: function(name, val) {
    var def = this._findDefByName(name);
    if (def && Y.Lang.isNumber(def.size)) {
      def.size += val;
    }
    this._refreshDefaultInputBlocks();
  },
  
  _findDefByName: function(name) {
    return Y.Array.find(this.get("blockDefinition").statement, function(def) {
      if (def.name === name) {
        return true;
      }
    });    
  },
  
  decrRepeat: function(name) {
    this._modifyRepeat(name, -1);  
  },
  
  /**
   * I am a method which removes an input with the given value, and sets its parent attribute to null unless it
   * is a default block.  I replace whatever block I remove with the corresponding default block.
   * I fire the inputBlocksChange event if I successfully remove the block.
   */
  removeInputBlock : function(block) {
    var inputBlocks = this.get('inputBlocks'), 
        success = false,
        skey,
        sindex = -1,
        removeBlock = function() {
          if (!this._isDefaultBlock(block)) {
            block.set('parent', null);
          }
          this.fire('inputBlocksChange');
          success = true;
        };
    
    Y.each(inputBlocks, function(value, key) {
      var index;
      if (Y.Lang.isArray(value)) {
        index = Y.Array.indexOf(value, block);
        if (index !== -1) {
          value[index] = this.defaultInputBlocks[key][index];
          removeBlock.call(this);
          sindex = index;
          skey = key;
        }
      }
      else if (value === block) {
        inputBlocks[key] = this.defaultInputBlocks[key];
        removeBlock.call(this);
        skey = key;
      }
    }, this);
    
    return success ? {block: block, key: skey, index: sindex} : null;
  },
  
  /**
   * Overrides the default isValidDropTarget method.
   */
  isValidDropTarget: function(dragTarget) {
    var parent = this.get('parent'),
        dropType = this.get("blockDefinition").type,
        hasBlockParent = parent && parent.type !== "blockList" && parent.type !== "canvas",
        blocks, firstBlock, lastBlock, firstBlockDef, lastBlockDef;
    
    if (dragTarget.type !== "blockList") {
      return false;
    }
    else if (dropType.name === Y.BlockTypes.reporter.name) {
      return hasBlockParent && dragTarget.get("blocks").item(0).get("blockDefinition").type.name === Y.BlockTypes.reporter.name;
    }
    else if (dropType) {
      blocks = dragTarget.get("blocks");
      firstBlock = blocks.item(0);
      lastBlock = blocks.item(blocks.size() - 1);
      firstBlockDef = firstBlock.get("blockDefinition");
      lastBlockDef = lastBlock.get("blockDefinition");
      
      return (firstBlockDef.type.allowsTopBlocks && dropType.allowsBottomBlocks) ||
             (dropType.allowsTopBlocks && lastBlockDef.allowsBottomBlocks);
    }
    else {
      return false;
    }
  },
  
  /**
   * I am a method which removes the given model from the inputs and returns the model we've removed as a block list.
   * If nothing was removed, I return null.
   */
  detach: function(model) {
    var removed = this.removeInputBlock(model), modelList, blockModelList = null;
    
    if (removed) {
      modelList = new Y.ModelList();
      modelList.add(removed.block);
      
      blockModelList = new Y.BlockListModel({
        blocks: modelList
      });
      this.handleRender();
    }
    
    return blockModelList;
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

Y.ExpressionBlockModel = ExpressionBlockModel;
