/*global Y*/
var BlockCanvasView, CanvasDragDropListener;

CanvasDragDropListener = function() {
  
  var canvasViews = [],
      onDragEnd = function(e) {
        var drag = e.target,
            dragModel = drag.model,
            dragRender = drag.render,
            dropStack = drag.dropStack,
            topOfStack = dropStack && dropStack.peek(),
            dropModel, dropRender, dropParent, firstBlock;
        
        // Destroy the dragRender        
        dragRender.destroy();
        
        // If we have a block on the drop stack, then insert/replace this block
        if (topOfStack) {
          dropModel = topOfStack.model;
          dropRender = topOfStack.render;
          dropParent = dropModel.get("parent");
          
          dropRender.unhighlight();
          if (dropParent.type === "blockList") {
            dropParent.insertBlockList(dragModel, dropModel, topOfStack.isDragTop);
          }
          else {
            
            // TODO: This is really not a good way to do this but I'm going to do it for now.  If the drag
            // model is a drop list consisting of only one reporter, then just pull that block out
            
            firstBlock = dragModel.get("blocks").item(0);
            if (firstBlock.get("blockDefinition").type.name === "reporter") {
              dropParent.replaceBlock(dropModel, firstBlock);
            }
            else {
              dropParent.replaceBlock(dropModel, dragModel);
            }
          }
          dropParent.handleRender();
        }
        // Otherwise, determine if the dragged block list intersects a block canvas, and if it does,
        // place the block on the canvas.
        
        // TODO: What do we do if the user drags the block off a canvas?
        else {
          Y.each(canvasViews, function(canvasView) {
            var container = canvasView.get("container"),
                region = container.get("region"),
                x = drag.actXY[0], y = drag.actXY[1],
                model;
            if (x >= region.left   &&
                x <= region.right  && 
                y >= region.top    && 
                y <= region.bottom) {
              model = canvasView.get("model");
              model.addBlockList(x - region.left, y - region.top, dragModel);
            }
          });
        }
      };
  
  Y.DD.DDM.on('drag:end', onDragEnd);
  /**
   * Look at the top of the drop stack, if an element exists, then we'll append to that element.  
   * The  drop stack should have three values: render, model, and dropType.  
   * dropType can be "replace", "top", or "bottom".
   *
   * If dropType is top or bottom, we fetch the parent blockList and insert 
   * the elements of this blocks list above or below, depending on the type.
   * 
   * If the dropType is replace
   * -  if the drop target is a reporter, then we remove the reporter and replace it with the dragTarget.
   * If the node we're replacing is not a default input, we put that node in its own nodelist at (0, 0).
   * 
   * - if the drop target is a block list, then we're replacing an empty block list.  Since empty block 
   * lists are always default nodes, we can replace it with the node list.
   */
  // For now just return an empty object
  return {
    addCanvasView: function(v) {
      canvasViews.push(v);
    }
  };
};

BlockCanvasView = Y.Base.create('blockCanvasView', Y.View, [], {
  _currentRenders: null,
  
  listener: CanvasDragDropListener(),
  
  initializer: function (cfg) {
    this.listener.addCanvasView(this);
    this._currentRenders = [];
    if (cfg.model) {
      cfg.model.on("addBlockList", this.handleAddBlockList, this);
    }
  },
  
  _clearContent: function() {
    var i;
    for (i = 0; i < this._currentRenders.length; i += 1) {
      this._currentRenders[i].destroy();
    }
  },
  
  handleAddBlockList: function(e) {
    this._renderBlockList(e.details[0]);
  },
  
  // Renders the canvas view
  render: function(partialRefresh) {
    // get the canvas model
    var model = this.get('model'),
        blockLists = model.get('blockLists'),
        container = this.get("container");
    
    this._clearContent();
    container.setContent('');
    container.setStyle("position", "relative");
    container.addClass("blockCv");
    Y.each(blockLists, this._renderBlockList, this);
  },
  
  _renderBlockList: function(blDescriptor) {
    var blRender = new Y.BlockListRender(Y.mix({parent: this.get("container") }, blDescriptor));
    blRender.render();
    this._currentRenders.push(blRender);
  }
});

Y.BlockCanvasView = BlockCanvasView;