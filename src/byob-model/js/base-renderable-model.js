/*global Y*/
var BaseRenderableModel, IdGenerator;

/**
 * I am a unique identifier object with two methods:
 * 
 *   uniqueId -- which generates unique ids for renderable models in this YUI instance
 *   registerId -- registers an id in the usedId hash.
 */
IdGenerator = (function() {
  var usedIds = {};
  return {
    uniqueId: function() {
      var id;
      do {
        id = Y.guid();
      }
      while (usedIds[id]);
      usedIds[id] = true;
      return id;
    },
    registerId: function(id) {
      usedIds[id] = true;
    }
  };
})();


/**
 * I am the base prototype for any object that can be rendered by a Render object.  
 * 
 * My only attribute is 'parent', which is my direct BaseRenderableModel ancestor.  I use this attribute
 * to determine who contains me.
 * 
 * My only property is type, which is an object that is created off of the Type prototype, and helps
 * me determine what type of entity I am.
 * 
 * I contain methods that bubble up render events so that the appropriate objects get rendered if I, 
 * or a child of mine, wants to render itself.  I am also responsible for returning the appropriate hover status,
 * and responding to a requester asking if I'm a valid drop target for a give drag target, which is also
 * of type BaseRenderableModel.
 */
BaseRenderableModel = Y.Base.create("baseRenderableModel", Y.Model, [], {
  
  initializer : function(cfg) {
    var id = this.get('id');
    if (cfg && cfg.type) {
      this.type = cfg.type;
    }    

    if (!id) {
      this.set('id', IdGenerator.uniqueId());
    }
    else {
      IdGenerator.registerId(id);
    }
  },
  
  /**
   * I am a method which looks to see if I have a parent, and if I do, asks it to fire a render event.  If I
   * have no parent, I fire the render event.
   */
  handleRender : function() {
    var parent = this.get('parent');
    if (parent && parent.type && !parent.type.isCanvas) {
      parent.handleRender();
    }
    else {
      this.fire('render');
    }
  },
  
  /**
   * Returns the parent canvas associated with this model.
   */
  getBlockCanvas: function() {
    var parent;
    if (this.type && this.type.isCanvas) {
      return this;
    }
    else {
      parent = this.get('parent');
      if (parent) {
        return parent.getBlockCanvas();
      }
    }
    return null;
  },
  
  /**
   * I am a method which returns the hover status given some data about where a valid drop target
   * is hovering above me.
   */
  getHoverStatus : function(isTop) {
    return 'self';
  },
  
  /**
   * Returns true if it's okay to consider this renderable model a drop target for the given drag target.
   * Drag target is also a BaseRenderableModel.
   */
  isValidDropTarget : function(dragTarget) {
    // By default nothing is a valid drop target.
    // TODO: change back to false
    return true;
  }
},{
  ATTRS: {
    /**
     * The parent block or block list.
     */
    parent : {
      value : null
    }
  }
});