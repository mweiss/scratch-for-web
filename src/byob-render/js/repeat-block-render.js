/*global Y*/
var RepeatBlockRender;

RepeatBlockRender = Y.Base.create("repeatBlockRender", Y.BaseBlockRender, [], {  
  size: 0,
  parentBlock: null,
  name: null,
  
  initializer: function(cfg) {
    RepeatBlockRender.superclass.initializer.call(this, cfg);
    this.size = Y.Lang.isNumber(cfg.size) ? cfg.size : 0;
    this.parentBlock = cfg.parentBlock;
    this.name = cfg.name;
  },
  
  render: function() {
    var container = this.get("container"),
        parent = this.get("parent"),
        size = this.size;
        
    if (!container.inDoc() && parent) {
      parent.append(container);
    }
    // Clear out anything that was in the container before.
    container.setContent('');
    
    container.addClass("blkExpr");
    if (size > 0) {
      container.appendChild("<div class=\"leftArrow\">&larr;</div>");
      container.one(".leftArrow").on("click", function(e) {
        this.parentBlock.decrRepeat(this.name);
        this.parentBlock.handleRender();
      }, this);
    }
    container.appendChild("<div class=\"rightArrow\">&rarr;</div>");
    container.one(".rightArrow").on("click", function(e) {
      this.parentBlock.incrRepeat(this.name);
      this.parentBlock.handleRender();
    }, this);
    container.set("width", container.getStyle("width") + 2);
    container.set("height", container.getStyle("height"));
  }
});

Y.RepeatBlockRender = RepeatBlockRender;