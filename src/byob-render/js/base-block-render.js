/*global Y*/
var BaseBlockRender;

BaseBlockRender = Y.Base.create("baseBlockRender", Y.View, [], {
  initializer: function(cfg) {   
    if (cfg.model) {
      cfg.model.on("render", this.render, this);
      cfg.model.after("destroy", this.destroy, this);
    }
  },
  
  destroy: function() {
    var container = this.get("container"), model = this.get('model');
    
    if (container) {
      // This is a hack, but these containers keep coming back even after we remove them from the DOM.  The solution
      // for now is to set their display to none until I figure out what's causing them to reappear.  I believe it has
      // to do with the way the drag proxy is being rendered.
      container.setStyle("display", "none");
      container.remove();
    }

    if (container.drop) {
      container.drop.destroy();
    }
    
    if (model) {
      model.detach("render", this.render);
      model.detach("destroy", this.destroy);
    }
    
    // For now, since container gets destroyed in another context, we're not destroying it
    // when we destroy the render
    // container.destroy();
  }
  
}, {
  parent: {
    value: null 
  }
});

Y.BaseBlockRender = BaseBlockRender;