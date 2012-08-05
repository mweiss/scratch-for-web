/*global Y*/
var DropStack, BaseBlockRender;

/**
 * Helper data structure for ordering drop targets.  Pushing an object from the stack add the item to the top
 * of the stack, or if it already is in the stack, moves it to the front.
 */    
DropStack = function(cfg) {
  Y.mix(this, cfg, true);
  this._stack = [];
};

DropStack.prototype = {
  _stack: null,
  
  push: function(model, render, isDragTop) {
    this.pop(model);
    this._stack.push({
      model: model,
      render: render,
      isDragTop: isDragTop
    });
  },
  
  pop: function(model) {
    this._stack = Y.Array.filter(this._stack, function(v) {
      return v.model !== model;
    });
  },
  
  peek: function() {
    var l = this._stack.length;
    return (l === 0 ? null : this._stack[l - 1]);
  },
  
  contains: function(model) {
    var found = Y.Array.find(this._stack, function(v) {
      return model === v.model;
    }) !== null;
    return found;
  }
  
};

BaseBlockRender = Y.Base.create("baseBlockRender", Y.View, [], {
  initializer: function(cfg) {   
    if (cfg.model) {
      cfg.model.on("render", this.render, this);
      cfg.model.after("destroy", this.destroy, this);
    }
  },
  
  destroy: function() {
    var container = this.get("container"), model = this.get('model');
    
    if (container) {
      // This is a hack, but these containers keep coming back even after we remove them from the DOM.  The solution
      // for now is to set their display to none until I figure out what's causing them to reappear.  I believe it has
      // to do with the way the drag proxy is being rendered.
      container.setStyle("display", "none");
      container.remove();
    }

    if (container.drop) {
      container.drop.destroy();
    }
    
    if (model) {
      model.detach("render", this.render);
      model.detach("destroy", this.destroy);
    }
    
    // For now, since container gets destroyed in another context, we're not destroying it
    // when we destroy the render
    // container.destroy();
  },
  
  
  _onDropEnter: function(e) {
    var drop = e.drop, drag = e.drag, dropModel, dragModel, topOfStack, isDragTop;
    dropModel = this.get("model");
    dragModel = drag.model;
    if (dragModel && !drag.dropStack.contains(dropModel) && dropModel.isValidDropTarget(dragModel)) {
      topOfStack = drag.dropStack.peek();
      isDragTop = this._isDragTop(drag, drop);
      if (topOfStack) {
        topOfStack.render.unhighlight();
      }  
      drag.dropStack.push(dropModel, this, isDragTop);
      this.highlight(isDragTop, dropModel, dragModel);
    }
  },
  
  highlight: function(isTop, dropModel, dragModel) {
    var container = this.get("container"),
        region = container.get("region"),
        x, y;
    
    if (!this._highlightNode || isTop !== this._isTopHighlightNode) {
      this.unhighlight();
      this._highlightNode = Y.Node.create('<div class="highlightEle"></div>');
      Y.one("body").append(this._highlightNode);
      if (isTop) {
        x = region.left;
        y = region.top;
      }
      else {
        x = region.left;
        y = region.bottom;
      }
      this._highlightNode.setXY([x, y]);
      this._isTopHighlightNode = isTop;
    }
  },
  
  unhighlight: function() {
    if (this._highlightNode) {
      this._highlightNode.remove();
      this._highlightNode = null;
    }
  },
  
  /**
   * Returns true if the mouse position is closer to the top of this block then the bottom
   * of it.
   */
  _isDragTop : function(drag, drop) {
    var dropTop = drop.region.top,
        dropBottom = drop.region.bottom,
        mouseY = drag.mouseXY[1];
    
    return Math.abs(mouseY - dropTop) < Math.abs(mouseY - dropBottom);
  },
  
  _onDropExit: function(e) {
    var drag = e.drag, top;
    if (drag.dropStack) {
      drag.dropStack.pop(this.get("model"));
      top = drag.dropStack.peek();
      if (top) {
        top.render.highlight();
      }
    }
    this.unhighlight();
  },
    
  _plugDrop: function(container, model) {
    container.plug(Y.IgnoreOffsetDrop, {
      block: model
    });
    container.drop.on('drop:over', this._onDropEnter, this);
    container.drop.on('drop:enter', this._onDropEnter, this);
    container.drop.on('drop:exit', this._onDropExit, this);
  }
  
}, {
  ATTRS: {

    parent: {
      value: null 
    },
    
    /**
     * True if this block and any sub blocks should use drag if they're the type of blocks that can
     * have drag enabled.
     */
    useDrag: {
      value: true
    },
    
    /**
     * True if this block and any sub blocks should use drop if they're the type of blocks that can
     * have drop enabled.
     */
    useDrop: {
      value: true
    }  
    
  }
});

Y.BaseBlockRender = BaseBlockRender;