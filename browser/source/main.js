'use strict';

var _ = require('lodash');
var Promise = require('bluebird');

var Dependency = function(args) {
	if (_.isArray(args)) {
		// factory type
		this.factory = args.pop();
		this.requires = args;
	} else {
		// value type
		this.value = args;
	}
};

var Context = function() {
	this.container = {};
	this.cache = {};
	this.autoload = [];

	// register built-in dependency
	this.register('@promise', Promise);
	this.register('@lodash', _);
};

var proto = Context.prototype;

proto.register = function(name, args, autoload) {
	if (this.container[name]) {
		throw new Error('Dependency [' + name + '] has been registered!');
	}

	this.container[name] = new Dependency(args);

	if (autoload) {
		this.autoload.push(name);
	}

	return this;
};

proto.resolve = function(name) {
	// look at cache
	var cached = this.cache[name];

	if (cached) {
		if (cached.value) {
			return Promise.resolve(cached.value);
		}

		return cached.promise;
	}

	// look at container
	var dependency = this.container[name];

	if (!dependency) {
		throw new Error('Dependency [' + name + '] is not registered yet!');
	}

	var self = this;

	cached = this.cache[name] = {};

	// value type
	if (dependency.value) {
		cached.value = dependency.value;
		cached.promise = Promise.resolve(cached.value);

		return cached.promise;
	}

	// factory
	var requires = [];
	var resolve = function(requires, promise, name) {
		return promise.then(function() {
			return self.resolve(name);
		}).then(function(module) {
			requires.push(module);

			return module;
		});
	};

	cached.promise = _.reduce(dependency.requires, function(promise, name) {
		// resolve require and push to requires array
		return resolve(requires, promise, name);
	}, Promise.resolve()).then(function() {
		return dependency.factory.apply(self, requires);
	}).then(function(module) {
		cached.value = module;

		return module;
	}).catch().finally(function() {
		// clear pointers
		requires.length = 0;
		requires = undefined;
		self = undefined;
	});

	return cached.promise;
};

proto.bootstrap = function() {
	_.forEach(this.autoload, function(name) {
		this.resolve(name);
	}, this);
};

var contexts = {};

module.exports = function(name) {
	if (!contexts[name]) {
		contexts[name] = new Context();
	}

	return contexts[name];
};
