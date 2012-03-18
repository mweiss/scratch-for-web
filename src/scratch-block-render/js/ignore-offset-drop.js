/*global Y console*/
/**
 * Custom drop plugin which ignores offset width and offset height when determining the drop target region.
 */
var IgnoreOffsetDrop = function(config) {
  config.node = config.host;
  this.block = config.block;
  IgnoreOffsetDrop.superclass.constructor.apply(this, arguments);
};

Y.extend(IgnoreOffsetDrop, Y.Plugin.Drop, {
  
  initDropAndRegion : function() {
    Y.DD.DDM._addValid(this);
    this.region = this.get('node').get('region');
    Y.DD.DDM.useHash = false;
  },
  
  /**
   * Overrides the destroy method to unregester this drop and to remove it from the
   * other drops property on the drag and drop manager.
   */
  destroy : function() {
    Y.DD.DDM._unregTarget(this);
    Y.each(Y.DD.DDM.otherDrops, function(value, key) {
      if (value === this) {
        delete Y.DD.DDM.otherDrops[key];
      }
    }, this);
    IgnoreOffsetDrop.superclass.destroy.call(this);
  },
  
  initializer : function() {
    // If this is not a regular block, we need to wait until everything renders before 
    // initializing.  For now, we'll just set an artificial timeout.
    if (!this.block) {
      Y.later(0, this, function() {
        this.initDropAndRegion();
      });      
    }
    else {
      this.initDropAndRegion();
    }
  },
  
  /**
   * Overrides the size shim method so that we only use the node's region, and not the offset width or padding
   * of the node.
   */
  sizeShim : function() {
    if (!Y.DD.DDM.activeDrag) {
      return false; //Nothing is dragging, no reason to activate.
    }
    if (this.get('node') === Y.DD.DDM.activeDrag.get('node')) {
      return false;
    }
    if (this.get('lock')) {
      return false;
    }
    if (!this.shim) {
      Y.later(100, this, this.sizeShim);
      return false;
    }
    this.region = this.get('node').get('region');
  }
}, {
  NAME : "ignore-offset-drop-plugin",
  NS : "drop"
});

Y.IgnoreOffsetDrop = IgnoreOffsetDrop;