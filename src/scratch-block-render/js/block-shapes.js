/*global Y console*/

/**
 * A shape that represents a rounded basic block.  The top and bottom connectors can be modified
 * by setting the showBottomConnector and showTopConnector properties.
 */
var RoundedBasicBlock = Y.Base.create("roundedBasicBlock", Y.Shape, [],{
  
  /**
   * Draws the rounded basic block.
   */
  _draw: function() {
    var w = this.get("width"),
        h = this.get("height"),
        ew = this.get("ellipseWidth"),
        eh = this.get("ellipseHeight"),
        showBottomConnector = this.get("showBottomConnector"),
        showTopConnector = this.get("showTopConnector"),
        connectorIndent = this.get("connectorIndent"),
        connectorWidth = this.get("connectorWidth");
    this.clear();
    this.moveTo(0, eh);
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
    
    this.lineTo(w, eh);
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
  NAME: "roundedBasicBlock",
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
    }
  }, Y.Shape.ATTRS)
});

/**
 * A shape that represents a control block.  This block has a space in the middle to contain inner blocks.
 */
var RoundedContainerBlock = Y.Base.create("roundedContainerBlock", RoundedBasicBlock, [], {
  
  /**
   * Draws the rounded container block.
   */
  _draw : function() {
    var w = this.get("width"),
        h = this.get("height"),
        ew = this.get("ellipseWidth"),
        eh = this.get("ellipseHeight"),
        showBottomConnector = this.get("showBottomConnector"),
        showTopConnector = this.get("showTopConnector"),
        connectorIndent = this.get("connectorIndent"),
        connectorWidth = this.get("connectorWidth"),
        bodyHeight = this.get("bodyHeight"),
        footerHeight = this.get("footerHeight"),
        leftConnectorWidth = this.get("leftConnectorWidth");
    
    this.clear();
    this.moveTo(0, eh);
    
    // Bottom of the footer    
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
  NAME: "roundedContainerBlock",
  ATTRS: Y.mix({
    /**
     * The default height of the inner section of the container.
     */
    bodyHeight : {
      value : 15
    },
    /**
     * The additional offset to add to the inner section for connectors.
     */
    leftConnectorWidth : {
      value : 15
    },
    /**
     * The height of the footer part of the connector.
     */
    footerHeight : {
      value : 25
    }
  }, RoundedBasicBlock.ATTRS)
});

Y.RoundedBasicBlock = RoundedBasicBlock;
Y.RoundedContainerBlock = RoundedContainerBlock;