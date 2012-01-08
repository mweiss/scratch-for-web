YUI.add('scratch-block-render', function(Y) {

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
    if (showFooter) { 
      this.lineTo(0, h - 2 * eh);
      this.quadraticCurveTo(0, h - eh, ew, h - eh);
      this.lineTo(connectorIndent, h - eh);
      this.quadraticCurveTo(connectorIndent, h, connectorIndent + ew, h);
      this.lineTo(connectorIndent + connectorWidth - ew, h);
      this.quadraticCurveTo(connectorIndent + connectorWidth, h, connectorIndent + connectorWidth, h - eh);
      this.lineTo(w - ew, h - eh);
      this.quadraticCurveTo(w, h - eh, w, h - 2 * eh);
    }
    else {
      this.lineTo(0, h - eh);
      this.quadraticCurveTo(0, h, ew, h);
      this.lineTo(w - ew, h);
      this.quadraticCurveTo(w, h, w, h - eh);
    }
    
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
  container : '<div class="basicBlock"></div>',  
  blockBody : null,
  
  initializer : function() {
    
  },
  
  _renderBody : function() {
    var block = this.get('block'), 
        inputBlocks = block.get('inputBlocks'), 
        idToBlockMap = {}, 
        maxHeight = 0,
        ctx = {},
        container = this.container,
        statement;
    if (block.type === 'constant') {
      statement = "" + block.get('value');
    }
    else {
      Y.each(inputBlocks, function(value, key) {
        var id = Y.guid();
        idToBlockMap[id] = value;
        ctx[key] = '<div id="' + id + '" class="basicBlock inputParentBlock"></div>';
      });
      statement = block.statement;
    }    
    
    // Split up the statement into blocks that can be centered vertically later
    var variableRegex = /\{[^}]+\}/,
        splitStatement = statement.split(variableRegex),
        matches = statement.match(variableRegex),
        newStatement = "";
    Y.each(splitStatement, function(value, index) {
      var id = Y.guid();
      
      // Add the id to the block map as a null entry.  We're doing this so we can keep track of each
      // block and center them later
      idToBlockMap[id] = null;
      
      newStatement += '<div id="' + id + '" class="basicBlock inputParentBlock">' + value + '</div>';
      if (matches && matches[index]) {
        newStatement += matches[index];
      }
    });

    // Add the block to the container
    container.appendChild(Y.substitute(newStatement, ctx));
    
    // Render each input block in the newly created node and update the max height property
    Y.each(idToBlockMap, function(block, id) {
      var parent = container.one('#' + id);
      if (block) {
        this._renderBlock(container, block, parent);
      }
      // Now update the max height property
      maxHeight = Math.max(maxHeight, parent.get('region').height);
    }, this);
    
    // Now we need to vertically center each block
    Y.each(idToBlockMap, function(block, id) {
      var parent = container.one('#' + id);
      var totalMargin = maxHeight - parent.get('region').height;
      parent.setStyle('marginTop', Math.floor(totalMargin / 2) + "px");
      parent.setStyle('marginBottom', Math.ceil(totalMargin / 2) + "px");
    }, this);
  },
  
  _renderBlock : function(container, block, parent) {
    var region = container.get("region");
    var newBlock = new GraphicsBlockRender({
      block : block,
      blockFillColor : '#999999',
      container : parent
    });
    newBlock.render();
  },
  
  render : function() {
    var block = this.get('block'), container = this.container, basicBlock;
    
    // Make sure the container is in the document
    if (!container.inDoc()) {
      this.get('parent').append(this.container);
    }
    basicBlock = new Y.Graphic({render : container});    
    this._renderBody();
    
    var region = container.get("region");
    var width = region.width, height = region.height;
    basicBlock.addShape({
      type: RoundedBasicBlock,
      width: width,
      height: height,
      x: 0,
      y: 0,
      fill: {
        color : this.get('blockFillColor')
      },
      stroke : {
        weight : 0
      },
      showHeader : block._topBlocksAllowed,
      showFooter : block._bottomBlocksAllowed
    });

    this.container.plug(Y.Plugin.Drag, { dragMode: 'intersect' });
    this.container.plug(Y.Plugin.Drop);
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
    },
    'blockFillColor' : {
      value : '#3851d2'
    }
  }
});

Y.GraphicsBlockRender = GraphicsBlockRender;



}, '@VERSION@' ,{use:['base','view','scratch-block-model','dd-plugin','dd-drop-plugin','graphics','substitute']});
