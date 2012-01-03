/*global Y console*/
/**
 * FIXME: Enter a description for the scratch-block-render module
 * @module scratch-block-render
 */

var RoundedBasicBlock = Y.Base.create("roundedBasicBlock", Y.Shape, [],{
  _draw: function() {
    var w = this.get("width"),
        h = this.get("height"),
        ew = this.get("ellipseWidth"),
        eh = this.get("ellipseHeight"),
        showFooter = this.get("showFooter"),
        showHeader = this.get("showHeader"),
        connectorIndent = this.get("connectorIndent"),
        connectorWidth = this.get("connectorWidth");
    this.clear();
    this.moveTo(0, eh);
    this.lineTo(0, h - 2 * eh);
    this.quadraticCurveTo(0, h - eh, ew, h - eh);
    if (showFooter) {
      this.lineTo(connectorIndent, h - eh);
      this.quadraticCurveTo(connectorIndent, h, connectorIndent + ew, h);
      this.lineTo(connectorIndent + connectorWidth - ew, h);
      this.quadraticCurveTo(connectorIndent + connectorWidth, h, connectorIndent + connectorWidth, h - eh);
    }
    this.lineTo(w - ew, h - eh);
    this.quadraticCurveTo(w, h - eh, w, h - 2 * eh);
    this.lineTo(w, eh);
    this.quadraticCurveTo(w, 0, w - ew, 0);
    if (showHeader) {
      this.lineTo(connectorIndent + connectorWidth, 0);
      this.quadraticCurveTo(connectorIndent + connectorWidth, eh, connectorIndent + connectorWidth - ew, eh);
      this.lineTo(connectorIndent + ew, eh);
      this.quadraticCurveTo(connectorIndent, eh, connectorIndent, 0);
    }
    this.lineTo(ew, 0);
    this.quadraticCurveTo(0, 0, 0, eh);
    this.end();
  }  
}, {
  NAME: "roundedBasicBlock",
  ATTRS: Y.mix({
    showHeader : {
      value : true
    },
    showFooter : {
      value : true
    },
    ellipseWidth: {
      value: 5
    },
    ellipseHeight: {
      value: 5
    },
    connectorIndent: {
      value : 15
    },
    connectorWidth: {
      value : 20
    }
  }, Y.Shape.ATTRS)
});
    
var GraphicsBlockRender = Y.Base.create("graphicsBlockRender", Y.View, [], {
  container : '<div class="basicBlock"></div>' ,
  template : '<div class=\"bd\">{statement}</div>',
  
  basicBlock : null,
  
  initializer : function() {
    
  },
  _renderInnerBlock : function() {
    var block = this.get('block'), 
        inputBlocks = block.get('inputBlocks'), 
        idToBlockMap = {}, 
        ctx = {statement : block.statement},
        innerBlock;
    
    // Populate the id map and ctx
    Y.each(inputBlocks, function(value, key) {
      var id = Y.guid();
      idToBlockMap[id] = value;
      ctx[key] = '<div id="' + id + '" class="relativeBlock"></div>';
    });
    
    // Create a div for each inner block we need to create
    innerBlock = Y.Node.create(Y.substitute(this.template, ctx, null, true));
    
    // Render each input block in the newly created node
    Y.each(idToBlockMap, function(block, id) {
      var parent = innerBlock.one('#' + id);
      this._renderBlock(block, parent);
    }, this);
    return innerBlock;
  },
  
  _renderBlock : function() {
    
  },
  
  render : function() {
    var block = this.get('block');
    
    if (!this.container.inDoc()) {
      this.get('parent').append(this.container);
    }
    var basicBlock = new Y.Graphic({render : this.container});    
    this.container.appendChild(this._renderInnerBlock());

    var statement = this.container.one('.bd');
    var region = statement.get("region");
    var width = region.width, height = region.height;
    basicBlock.addShape({
      type: RoundedBasicBlock,
      width: width,
      height: height,
      x: 0,
      y: 0,
      fill: {
        color : '#3851d2'
      },
      stroke : {
        weight : 0
      },
      showHeader : block._topBlocksAllowed,
      showFooter : block._bottomBlocksAllowed
    });
    
    this.container.plug(Y.Plugin.Drag, { dragMode: 'intersect' });
    this.container.plug(Y.Plugin.Drop);
    this.basicBlock = basicBlock;
    this.container.dd.on('drag:start', this._bringToFront, this);
    this.container.dd.on('drag:end', this._bringToBack, this);
  },
  
  _bringToFront : function(e) {
    this.container.setStyle("zIndex", 1);
  },
  
  _bringToBack : function(e) {
    this.container.setStyle("zIndex", 0);
  }
}, {
  ATTRS : {
    'block' : {
      value : null,
      writeOnce : true
    },
    'parent' : {
      value : null
    }
  }
});

Y.GraphicsBlockRender = GraphicsBlockRender;

