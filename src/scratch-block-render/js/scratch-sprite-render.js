/*global Y*/

/**
 * Renders the scratch sprite.
 */
var ScratchSpriteRender = Y.Base.create("ScratchSpriteRender", Y.View, [], {
  container : '<div class="sprite"></div>',
  
  initialize : function() {
    // When the sprite's costume changes, change the rendered costume.
    this.model.after('costumeChange', this.renderCostume, this);
    this.model.after('xChange', this._shapeChange, this);
    this.model.after('yChange', this._shapeChange, this);
    this.model.after('sizeChange', this._shapeChange, this);
  },
  
  _shapeChange : function(e) {
    var container = this.container, 
        model = this.model, 
        size = model.get('size'), 
        costume = model.get('costume');
        
    container.set('x', model.get('x'));
    container.set('y', model.get('y'));
    container.set('width', costume.get('width') * size);
    container.set('height', costume.get('height') * size);
  },
  
  render : function() {
    var model = this.model;
    this.renderCostume();
  },
  
  renderCostume : function() {
    var costume = this.model.get('costume'), type = costume.get('type');
    switch (type) {
      case 'rect':
      case 'circle':
        this._renderShape(costume);
        break;
      default:
        break;
    }
  },
  
  _renderShape : function(costume) {
    var style = costume.get('style'),
        model = this.model,
        graphics = this.graphics,
        size = model.get('size');
    this.container = graphics.addShape(Y.mix({ 
      type : costume.get('type'),
      x : model.get('x'),
      y : model.get('y'),
      width : costume.get('width') * size,
      height : costume.get('height') * size
    }, style));
  }
}, {
  ATTRS : {
    parent : {
      value : null
    },
    graphics : {
      value : null
    }
  }
});

Y.ScratchSpriteRender = ScratchSpriteRender;

var ScratchStageRender = Y.Base.create("ScratchStageRender", Y.View, [], {
  _spriteRenders : null,
  
  container : '<div class="scratchStageRender"></div>',
  render : function() {
    var container = this.container, sprites = this.get('sprites'), graphics = new Y.Graphics(container);
    
    container.width = this.get('width');
    container.height = this.get('height');
    
    // Add each sprite in its appropriate spot
    this._spriteRenders = sprites.map(function(sprite) {
      var spriteRender = new ScratchSpriteRender({
        parent : this.container,
        model : sprite,
        graphics : graphics
      });
      spriteRender.render();
    }, this);
  }
},
{
  ATTRS: {
    sprites : {
      values : null
    },
    width : {
      value : 600
    },
    height : {
      value : 600
    }
  }
});

Y.ScratchStageRender = ScratchStageRender;
