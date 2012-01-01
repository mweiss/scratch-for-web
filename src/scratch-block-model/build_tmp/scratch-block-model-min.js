YUI.add("scratch-block-model",function(B){var A=B.Base.create("baseBlockModel",B.Model,[],{_innerBlocksAllowed:false,_topBlocksAllowed:false,_bottomBlocksAllowed:false,_returnsValue:false,evaluate:function(C){}},{ATTRS:{innerBlocks:{value:null},statement:{value:null},inputBlocks:{value:null}}});B.MoveBlockModel=B.Base.create("moveBlockModel",A,[],{_topBlocksAllowed:true,_bottomBlocksAllowed:true,statement:"move {numSteps} steps",initialize:function(){},evaluate:function(C){var E=this.get("inputBlocks"),D=C.sprite,F=E.numSteps.evaluate(C);C.sprite.setX(D.getX()+F);}});B.ConstantBlockModel=B.Base.create("ConstantBlockModel",A,[],{_returnsValue:true,evaluate:function(C){return this.get("value");}},{ATTRS:{value:{value:null}}});B.LessThanBlockModel=B.Base.create("LessThanBlockModel",A,[],{_returnsValue:true,initialize:function(){this.set("statement","{left} < {right}");},evaluate:function(C){var E=this.get("inputBlocks"),F=E.left.evaluate(C),D=E.right.evaluate(C);if(B.Lang.isObject(F)){F=F.get();}if(B.Lang.isObject(D)){D=D.get();}return F<D;}});B.VariableBlockModel=B.Base.create("VariableBlockModel",A,[],{_returnsValue:true,evaluate:function(C){return C.getVariable(this.get("variableName"));}},{ATTRS:{variableName:{value:null}}});B.IncrementVariableBlockModel=B.Base.create("IncrementBlockModel",A,[],{_returnsValue:true,initialize:function(){this.set("statement","increment {x}");},evaluate:function(D){var E=this.get("inputBlocks"),C=E.x.evaluate(D);C.set(C.get()+1);}});B.WhileBlockModel=B.Base.create("whileBlockModel",A,[],{_innerBlocksAllowed:true,_topBlocksAllowed:true,_bottomBlocksAllowed:true,initialize:function(){this.set("statement","while {expression}");},evaluate:function(C){var E,D=this.get("inputBlocks");var F=function(G){G.evaluate(C);};while(D.expression.evaluate(C)){E=this.get("innerBlocks");E.each(F);}}});},"@VERSION@",{requires:["widget","intl","model","model-list","node-screen"]});