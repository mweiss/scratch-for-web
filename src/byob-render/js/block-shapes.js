/*global Y*/
var ExpressionBlockShape, 
    emptyArrayFunc = function() {
      return [];
    };
/**
 * I am a shape that draws the background of an expression block.  I support enabling, disabling
 */
ExpressionBlockShape = Y.Base.create("expressionBlockShape", Y.Shape, [], {
  
  /**
   * I am a function which draws the block shape.
   */
  _draw : function() {
    var w = this.get("width"),
        blockHeights = this.get("blockHeights"),
        cShapeHeights = this.get("cShapeHeights"),
        h = this.get("height"),
        ew = this.get("ellipseWidth"),
        eh = this.get("ellipseHeight"),
        showBottomConnector = this.get("showBottomConnector"),
        showTopConnector = this.get("showTopConnector"),
        connectorIndent = this.get("connectorIndent"),
        connectorWidth = this.get("connectorWidth"),
        blockHeight = blockHeights[blockHeights.length - 1],
        leftConnectorWidth = this.get("leftConnectorWidth"),
        i, heightSoFar = h, drawCShape;
    
    // I am a helper function which draws the inner c shape block from the
    // top right of the last block drawn to the top right of the next block
    // to be drawn.  Essentially I draw this:
    //
    //    |_-_____|  <----To the top of here
    //    |-_-----
    //           |  <--- From the top of here
    drawCShape = function(cShapeHeight, h, blockHeight) {
      
      // The top of the c shape
      var tcsHeight = h - cShapeHeight;
      
      // Bottom of the cShape
      this.quadraticCurveTo(w, h, w - eh, h);
      this.lineTo(leftConnectorWidth + connectorIndent + connectorWidth, h);
      this.quadraticCurveTo(leftConnectorWidth + connectorIndent + connectorWidth, 
        h + eh, 
        leftConnectorWidth + connectorIndent + connectorWidth - ew, 
        h + eh);
      this.lineTo(leftConnectorWidth + connectorIndent + ew, h + eh);
      this.quadraticCurveTo(leftConnectorWidth + connectorIndent, 
        h + eh, 
        leftConnectorWidth + connectorIndent,
        h);
      this.lineTo(leftConnectorWidth + ew, h);
      
      // Top of the cShape
      this.quadraticCurveTo(leftConnectorWidth, h, leftConnectorWidth, h, - eh);
      this.lineTo(leftConnectorWidth, tcsHeight + eh);
      this.quadraticCurveTo(leftConnectorWidth, tcsHeight, leftConnectorWidth + ew, tcsHeight);
      this.lineTo(leftConnectorWidth + connectorIndent, tcsHeight);
      this.quadraticCurveTo(leftConnectorWidth + connectorIndent, 
        tcsHeight + eh, 
        leftConnectorWidth + connectorIndent + ew,
        tcsHeight + eh);
      this.lineTo(leftConnectorWidth + connectorIndent + connectorWidth - ew, tcsHeight + eh);
      this.quadraticCurveTo(leftConnectorWidth + connectorIndent + connectorWidth,
        tcsHeight + eh,
        leftConnectorWidth + connectorIndent + connectorWidth,
        tcsHeight);
      this.lineTo(w - ew, tcsHeight);
      this.quadraticCurveTo(w, tcsHeight, w, tcsHeight - eh);
      this.lineTo(w, tcsHeight - (blockHeight - eh));
    };
    
    this.clear();
    this.moveTo(0, eh);
    
    // Draws the very bottom of the block
    if (showBottomConnector) { 
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
    
    this.lineTo(w, h - (blockHeight - eh));
    heightSoFar -= blockHeight;
    for (i = cShapeHeights.length - 1; i >= 0; i -= 1) {
      drawCShape.call(this, cShapeHeights[i], heightSoFar, blockHeights[i]);
      heightSoFar -= cShapeHeights[i] + blockHeights[i];
    }

    // Draws the very top of the block
    this.quadraticCurveTo(w, 0, w - ew, 0);
    if (showTopConnector) {
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
  NAME: "expressionBlockShape",
  ATTRS: Y.mix({
    /**
     * If true, we show the top connector.
     */
    showTopConnector : {
      value : true
    },
    /**
     * If true, we show the bottom connector.
     */
    showBottomConnector : {
      value : true
    },
    /**
     * The elipse width of the block.
     */
    ellipseWidth: {
      value: 5
    },
    /**
     * The elipse height of the block.
     */
    ellipseHeight: {
      value: 5
    },
    /**
     * The ident of the top and bottom connector.
     */
    connectorIndent: {
      value : 15
    },
    /**
     * The width of the connector.
     */
    connectorWidth: {
      value : 20
    },
    
    /**
     * An array of heights of the block pieces of the element block shape.
     */
    blockHeights: {
      value: emptyArrayFunc
    },
    /**
     * An array heights of the c shape sections of the shape.
     */
    cShapeHeights : {
      value: emptyArrayFunc
    },
    /**
     * The additional offset to add to the inner section for connectors.
     */
    leftConnectorWidth : {
      value : 15
    }
  }, Y.Shape.ATTRS)
});

Y.ExpressionBlockShape = ExpressionBlockShape;