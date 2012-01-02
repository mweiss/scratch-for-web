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
  template : '<div class=\"front1 bd\">{statement}</div>',
  
  basicBlock : null,
  
  initializer : function() {
    
  },
  render : function() {
    var block = this.get('block');
    this.container.setContent(Y.Lang.sub(this.template, {statement : block.statement}));

    
    if (!this.container.inDoc()) {
      this.get('parent').append(this.container);
    }
    var basicBlock = new Y.Graphic({render : this.container});
    var statement = this.container.one('.bd');
    var region = statement.get("region");
    var width = region.right - region.left, height = region.bottom - region.top;
    
    basicBlock.addShape({
      type: RoundedBasicBlock,
      width: width, // TODO: control this padding more betta
      height: height,
      x: 0,
      y: 0,
      fill: {
        color : '#3851d2'
      },
      stroke: {
        weight: 1,
        color: "#344c94"
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
    var statement = this.container.one('.bd'), bbn = Y.one(this.basicBlock.get('node'));
    statement.removeClass('front1');
    statement.addClass('front3');
    bbn.addClass('front2');
  },
  
  _bringToBack : function(e) {
    var statement = this.container.one('.bd'), bbn = Y.one(this.basicBlock.get('node'));
    statement.removeClass('front3');
    bbn.removeClass('front2');
    statement.addClass('front1');
  },
  
  _setZIndex : function(z1, z2) {
    var statement = this.container.one('.bd'), bbn = Y.one(this.basicBlock.get('node'));
    statement.setStyle('z-index', z1);
    bbn.setStyle('z-index', z2);
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

var BasicBlockRender = Y.Base.create("baseBlockRender", Y.View, [], {
  headTemplate : '<div class="hd">&nbsp;</div>',
  footerTemplate : '<div class="ft">&nbsp;</div>',
  template : '{headTemplate}' +
             '<div class="bd">{statement}</div>' +
             '{footerTemplate}',
  container : '<div class="basicBlock"></div>',
  initializer : function() {
    
  },
  render : function() {
    var ctx = this._buildContext();
    this.container.setContent(Y.Lang.sub(this.template, ctx));
    if (!this.container.inDoc()) {
      this.get('parent').append(this.container);
      this.container.plug(Y.Plugin.Drag, { dragMode: 'intersect' });
      this.container.plug(Y.Plugin.Drop);
      this.container.drop.on('drop:enter', function(e) {
        console.log(e);
      }, this.container);
      this.container.drop.on('drop:exit', function(e) {
        console.log(e);
      }, this.container);
    }
  },
  _buildContext : function() {
    var block = this.get('block'),
        headTemplate = "",
        footerTemplate = "";
    if (block._topBlocksAllowed) {
      headTemplate = this.headTemplate;
    }
    if (block._bottomBlocksAllowed) {
      footerTemplate = this.footerTemplate;
    }
    return {
      headTemplate : headTemplate,
      footerTemplate : footerTemplate,
      statement : this.get('block').statement
    };
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

var ControlBlockRender = Y.Base.create("innerBlockRender", BasicBlockRender, [], {
  template : '<div class="topBlock">' +
             '  <div class="hd">&nbsp;</div>' +
             '  <div class="bd">{statement}</div>' +
             '  <div class="ft">&nbsp;</div>' +
             '</div>' +
             '<div class="middleBlock">' +
             '  <div class="contentsWrapper">' +
             '    <div class="contents">&nbsp;</div>' +
             '  </div>' +
             '</div>' +
             '<div class="bottomBlock">' +
             '  <div class="hd">&nbsp;</div>' +
             '  <div class="bd">&nbsp;</div>' +
             '  <div class="ft">&nbsp;</div>' +
             '</div>',
  container : '<div class="controlBlock"></div>'
});

Y.BasicBlockRender = BasicBlockRender;


}, '@VERSION@' ,{use:['base','view','scratch-block-model','dd-plugin','dd-drop-plugin','graphics']});
