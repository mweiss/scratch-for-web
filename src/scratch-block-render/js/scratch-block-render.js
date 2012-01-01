/*global Y*/
/**
 * FIXME: Enter a description for the scratch-block-render module
 * @module scratch-block-render
 */

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
      this.get('parent').plug(Y.Plugin.Drag);
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
