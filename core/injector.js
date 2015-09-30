'use strict';

var _ = require('lodash');
var BPromise = require('bluebird');

var Injector = module.exports = function(context) {
	this._context = context;
};

var proto = Injector.prototype;

proto.get = function(name) {
	var dependency = this._context._container[name];

	if (!dependency) {
		throw new Error('Dependency [' + name + '] is not registered!');
	}

	// if resolved already
	if (dependency.value) {
		return BPromise.resolve(dependency.value);
	}

	// if during resolving
	if (dependency.promise) {
		return dependency.promise;
	}

	// collect requires
	var requires = _.map(dependency.requires, function(name) {
		return this.resolve(name);
	}, this._context);

	dependency.promise = BPromise.all(requires).then(function(requires) {
		dependency.value = dependency.factory.apply(null, requires);

		return dependency.value;
	});

	// activate any declared activations then return resolved dependency value
	return _.reduce(dependency.activations, function(promise, name) {
		return promise.then(this.resolve.bind(this, name));
	}, BPromise.resolve(), this._context).then(function() {
		return dependency.promise;
	});
};
