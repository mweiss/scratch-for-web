
// Note: this file is auto-generated by meta_join.js. Don't Modify me !
YUI().use(function(Y) {

	/**
 	* YUI 3 module metadata
 	* @module scratch-for-web-loader
	 */
	var CONFIG = {
		groups: {
			'clicrdv': {
				base: '../../../build/',
				combine: false,
				modules: {"byob-model":{"path":"byob-model/byob-model.js","requires":["base","intl","model","model-list","node-screen"]},"byob-render":{"path":"byob-render/byob-render.js","requires":["base","view","byob-model","dd-plugin","dd-drop-plugin","graphics","substitute","escape","tabview"],"skinnable":true},"byob-render-tests":{"path":"byob-render-tests/byob-render-tests.js","requires":["byob-render"]},"scratch-block-model":{"path":"scratch-block-model/scratch-block-model.js","requires":["widget","intl","model","model-list","node-screen"],"skinnable":true},"scratch-block-render":{"path":"scratch-block-render/scratch-block-render.js","requires":["base","view","scratch-block-model","dd-plugin","dd-drop-plugin","graphics","substitute","escape","tabview"],"skinnable":true}}
			}
		}
	};

	if(typeof YUI_config === 'undefined') { YUI_config = {groups:{}}; }
	Y.mix(YUI_config.groups, CONFIG.groups);

});