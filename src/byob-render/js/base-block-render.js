/*global Y*/
var BaseBlockRender;

BaseBlockRender = Y.Base.create("baseBlockRender", Y.View, [], {
  initializer: function(cfg) {   
    if (cfg.model) {
      cfg.model.on("render", this.render, this);
    }
  }
}, {
  parent: {
    value: null 
  }
});

Y.BaseBlockRender = BaseBlockRender;