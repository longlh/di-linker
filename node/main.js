'use strict';
var Linker = require('./linker');

module.exports = function(patterns, rek) {
	var linker = new Linker(patterns, rek);

	return linker;
};

module.exports.Linker = Linker;
