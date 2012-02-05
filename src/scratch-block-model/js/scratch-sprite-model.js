/*global Y console emptyModelListFn */
var CostumeModel = Y.Base.create("costumeModel", Y.Model, [], {
  
}, {
  ATTRS : {
    width: {
      value : 100
    },
    height : {
      value : 100
    },
    type : {
      value : 'rect'
    },
    style : {
      value : {}
    },
    name : {
      value : ""
    }
  }
});
var SpriteModel = Y.Base.create("spriteModel", Y.Model, [/*Y.WidgetParent*/], {
}, {
  ATTRS : {
    /**
     * A list of block lists.
     */
    scripts : {
      value : emptyModelListFn
    },
    /**
     * A list of costumes for this sprite.
     */
    costumes : {
      value : emptyModelListFn
    },
    
    /**
     * The x position of this sprite.
     */
    x : {
      value : 0
    },
    
    /**
     * The y position of this sprite.
     */
    y : {
      value : 0
    },
    
    /**
     * The direction this sprite is facing.
     */
    direction : {
      value : 0
    },
    
    /**
     * The current costume this sprite is using.
     */
    costume : {
      value : null
    },
    
    /**
     * The size of the sprite.
     */
    size : {
      value : 1
    }
  }
});