'use strict';

var _ = require('lodash');

function doNothing() {}

module.exports = function(def) {
	this.name = def.name;

	if (def.value) {
		this.value = def.value;
	} else {
		this.requires = _.isArray(def.requires) ? def.requires : [];
		this.activations = _.isArray(def.activations) ? def.activations : [];
		this.factory = _.isFunction(def.factory) ? def.factory : doNothing;
	}
};
