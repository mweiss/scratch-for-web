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


var RoundedContainerBlock = Y.Base.create("roundedContainerBlock", RoundedBasicBlock, [], {
  _draw : function() {
    var w = this.get("width"),
        h = this.get("height"),
        ew = this.get("ellipseWidth"),
        eh = this.get("ellipseHeight"),
        showFooter = this.get("showFooter"),
        showHeader = this.get("showHeader"),
        connectorIndent = this.get("connectorIndent"),
        connectorWidth = this.get("connectorWidth"),
        bodyHeight = this.get("bodyHeight"),
        footerHeight = this.get("footerHeight"),
        leftConnectorWidth = this.get("leftConnectorWidth");
    
    this.clear();
    this.moveTo(0, eh);
    
    // Bottom of the footer    
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
    this.lineTo(w, h - (footerHeight - eh));
    
    // Top of the footer
    this.quadraticCurveTo(w, h - footerHeight, w - eh, h - footerHeight);
    this.lineTo(leftConnectorWidth + connectorIndent + connectorWidth, h - footerHeight);
    this.quadraticCurveTo(leftConnectorWidth + connectorIndent + connectorWidth, 
      h - footerHeight + eh, 
      leftConnectorWidth + connectorIndent + connectorWidth - ew, 
      h - footerHeight + eh);
    this.lineTo(leftConnectorWidth + connectorIndent + ew, h - footerHeight + eh);
    this.quadraticCurveTo(leftConnectorWidth + connectorIndent, 
      h - footerHeight + eh, 
      leftConnectorWidth + connectorIndent,
      h - footerHeight);
    this.lineTo(leftConnectorWidth + ew, h - footerHeight);
    
    // Bottom of the header
    this.quadraticCurveTo(leftConnectorWidth, h - footerHeight, leftConnectorWidth, h - footerHeight - eh);
    this.lineTo(leftConnectorWidth, bodyHeight + eh);
    this.quadraticCurveTo(leftConnectorWidth, bodyHeight, leftConnectorWidth + ew, bodyHeight);
    this.lineTo(leftConnectorWidth + connectorIndent, bodyHeight);
    this.quadraticCurveTo(leftConnectorWidth + connectorIndent, 
      bodyHeight + eh, 
      leftConnectorWidth + connectorIndent + ew,
      bodyHeight + eh);
    this.lineTo(leftConnectorWidth + connectorIndent + connectorWidth - ew, bodyHeight + eh);
    this.quadraticCurveTo(leftConnectorWidth + connectorIndent + connectorWidth,
      bodyHeight + eh,
      leftConnectorWidth + connectorIndent + connectorWidth,
      bodyHeight);
    this.lineTo(w - ew, bodyHeight);
    this.quadraticCurveTo(w, bodyHeight, w, bodyHeight - eh);
    this.lineTo(w, eh);
    
    // Top of the header
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
  NAME: "roundedContainerBlock",
  ATTRS: Y.mix({
    bodyHeight : {
      value : 15
    },
    leftConnectorWidth : {
      value : 15
    },
    footerHeight : {
      value : 25
    }
  }, RoundedBasicBlock.ATTRS)
});
/**
 * This is a prototype class for rendering a list of block commands.
 */
var GraphicsBlockListRender = Y.Base.create("graphicsBlockListRender", Y.View, [], {
  container : '<div class="blockList"></div>',
  
  render : function() {
    var blockList = this.get('blockList');
    if (!this.container.inDoc()) {
      this.get('parent').append(this.container);
    }
    blockList.each(function(block) {
      // Wrap the block wrapper
      var blockWrapper = Y.Node.create('<div class="blockWrapper"></div>'), 
          region,
          graphicsBlock;
      this.container.append(blockWrapper);
      graphicsBlock = new Y.GraphicsBlockRender({
        block : block,
        parent : blockWrapper
      });
      graphicsBlock.render();
      region = graphicsBlock.container.get('region');
      blockWrapper.setStyle('width', region.width);
      blockWrapper.setStyle('height', region.height);
    }, this);
  }
}, {
  ATTRS : {
    'blockList' : {
      value : null
    },
    'parent' : {
      value : null
    }
  }
});

Y.GraphicsBlockListRender = GraphicsBlockListRender;

/**
 * This is a prototype class for using YUI graphics to render a scratch block.
 */
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
    
    // escape the statement
    statement = Y.Escape.html(statement);
    // Split up the statement into blocks that can be centered vertically later
    var variableRegex = /\{[^}]+\}/g,
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

    var subbedVal = Y.substitute(newStatement, ctx);

    // Add the block to the container
    container.appendChild(subbedVal);
    
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
      blockFillColor : block.type === 'constant' ? '#999999' : '#55BA00', // TODO : remove
      container : parent
    });
    newBlock.render();
  },
  
  _renderInnerBlock : function(bodyHeight) {
    var block = this.get('block'), innerBlocks = block.get('innerBlocks');
    if (block._innerBlocksAllowed) {
      var gbList = new GraphicsBlockListRender({
        parent : this.container,
        blockList : innerBlocks
      });
      gbList.render();
      // TODO:
      // Indent as far as the width of the left bar, for now we'll say it's 15, but
      // we need to get this property dynamically
      
      // TODO: I NEED TO RETHINK THIS
      var paddingLeft = parseInt(this.container.getStyle('paddingLeft').split("px")[0], 10);
      var paddingTop = parseInt(this.container.getStyle('paddingTop').split("px")[0], 10);
      gbList.container.setStyle('marginLeft', 15 - paddingLeft);   
      gbList.container.setStyle('marginTop', bodyHeight - paddingTop);
    }
  },
  
  render : function() {
    var block = this.get('block'), container = this.container, basicBlock, region, width, height, bodyWidth, bodyHeight;
    
    // Make sure the container is in the document
    if (!container.inDoc()) {
      this.get('parent').append(this.container);
    }
    basicBlock = new Y.Graphic({render : container});    
    this._renderBody();
    bodyWidth = container.get("region").width;
    bodyHeight = container.get("region").height;
    this._renderInnerBlock(bodyHeight);
    region = container.get("region");
    width = region.width;
    height = region.height;
    
    if (block._innerBlocksAllowed) {
      basicBlock.addShape({
        type: RoundedContainerBlock,
        width: bodyWidth,
        height: height + 20, // TODO: come up with a better way of doing the footer height, also why can't this be 25?
        bodyHeight: bodyHeight,
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
    }
    else {
      basicBlock.addShape({
        type: RoundedBasicBlock,
        width: width,
        height: height + (block._bottomBlocksAllowed ? 5 : 0),
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
    }
    

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

