'use strict';

var _ = require('lodash');
var BPromise = require('bluebird');

var Injector = require('./injector');
var Dependency = require('./dependency');

var Context = module.exports = function(requireFunc) {
	this._injector = new Injector(this);
	this._require = requireFunc || require;
	this._container = {};
	this._requireIndicator = '@';
	this._config = {
		verboseLog: false
	};

	// register some build-in dependencies
	this.value('#injector', this._injector);
	this.value('#require', this._require);
};

var proto = Context.prototype;

proto.config = function(config) {
	this._config = _
		.chain(config)
		.pick(['verboseLog'])
		.defaults(this._config)
		.value();

	return this;
};

proto.register = function(def) {
	var dependency = new Dependency(def);

	if (this._container[dependency.name]) {
		throw new Error('Dependency [' + dependency.name + '] has been registered!');
	}

	// store dependency
	this._container[dependency.name] = dependency;

	return this;
};

proto.value = function(name, value) {
	return this.register({
		name: name,
		value: value
	});
};

proto.factory = function(name, def) {
	if (!_.isArray(def)) {
		throw new Error('Invalid factory format');
	}

	return this.register({
		name: name,
		factory: def.pop(),
		requires: def
	});
};

proto.bootstrap = function(dependencies) {
	var self = this;

	return _.reduce(dependencies, function(promise, name) {
		return promise.then(function() {
			return self.resolve(name);
		});
	}, BPromise.resolve()).then(function() {
		return self;
	});
};

proto.resolve = function(name) {
	if (!name) {
		return BPromise.reject(new Error('Invalid dependency name'));
	}

	var verboseLog = !!(this._config && this._config.verboseLog);

	if (verboseLog) {
		console.log('[di-linker] >> Resolving [' + name + ']');
	}

	var promise;

	if (this._requireIndicator && this._requireIndicator === name[0]) {
		promise = BPromise.resolve(this._require(name.substr(1)));
	} else {
		promise = this._injector.get(name);
	}

	if (verboseLog) {
		promise.finally(function() {
			console.log('[di-linker] >> Resolved [' + name + ']');
		});
	}

	return promise;
};
