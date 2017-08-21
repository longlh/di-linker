'use strict';

var _ = require('lodash');
var glob = require('glob');
var path = require('path');
var BPromise = require('bluebird');
var Context = require('./context');
var store = {};

function walk(pattern) {
	return new BPromise(function(resolve, reject) {
		glob(pattern, function(error, paths) {
			if (error) {
				return reject(error);
			}

			resolve(paths);
		});
	});
}

module.exports = function(name) {
	if (!store[name]) {
		var context = store[name] = new Context();
	}

	return store[name];
};

module.exports.walk = function(patterns, requireFunc) {
	requireFunc = requireFunc || require;

	if (typeof patterns === 'string') {
		patterns = [patterns];
	} else if (!_.isArray(patterns)) {
		return BPromise.reject(new Error('Invalid patterns'));
	}

	var context = new Context(requireFunc);

	return BPromise.all(patterns.map(function(pattern) {
		return walk(pattern);
	})).then(function(paths) {
		return _.union.apply(_, paths);
	}).then(function(paths) {
		_.forEach(paths, function(p) {
			var module = requireFunc(path.resolve('.', p));

			context.register(module);
		});

		return context;
	});
};

module.exports.Context = Context;
