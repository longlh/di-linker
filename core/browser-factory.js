'use strict';

var _ = require('lodash');
var BPromise = require('bluebird');
var Context = require('./context');
var store = {};

module.exports = function(name) {
	if (!store[name]) {
		var context = store[name] = new Context();

		// disable require
		context._requireIndicator = undefined;

		// add two built-in libraries
		context.value('@lodash', _);
		context.value('@bluebird', BPromise);
	}

	return store[name];
};

module.exports.Context = Context;
