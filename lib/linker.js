'use strict';
var events = require('events');
var glob = require('glob');
var path = require('path');
var util = require('util');
var Promise = require('bluebird');

var REQUIRE_MODULE_INDICATOR = '@';

var Linker = function(patterns, rek) {
	var self = this;
	self._require = rek || require;
	self._modules = {};
	self._cache = {};

	if (typeof patterns === 'string') {
		patterns = [patterns];
	} else if (!Array.isArray(patterns)) {
		process.nextTick(function() {
			self.emit('error', new Error('Invalid patterns'));
		});

		return self;
	}

	self._initialize = Promise.all(patterns.map(function(pattern) {
		return self._scan(pattern);
	})).catch(function(err) {
		self.emit('error', err);
	});
};

util.inherits(Linker, events.EventEmitter);

Linker.prototype.bootstrap = function(name, cb) {
	var self = this;

	if (self._initialize) {
		self._initialize.then(function() {
			return self.get(name);
		}).then(function(main) {
			if (typeof cb === 'function') {
				cb(null, main);
			}
		}).catch(function(err) {
			if (typeof cb === 'function') {
				cb(err);
			}
		});
	}

	return self;
};

Linker.prototype.get = function(name) {
	var self = this;

	// find in _cache
	var cache = self._cache[name];

	// cache hit
	if (cache) {
		// check if module is initialized
		if (cache.value) {
			return Promise.resolve(cache.value);
		}

		return cache.promise;
	}

	self._cache[name] = cache = {};

	// not initialized yet
	if (name.indexOf(REQUIRE_MODULE_INDICATOR) > -1) {
		return cache.promise = self._loadModule(name).then(function(module) {
			cache.value = module;

			return module;
		});
	}

	// initialize module
	return cache.promise = self._inject(name).then(function(result) {
		cache.value = result.injection;

		// if have no activation config
		if (!result.activations) {
			return result.injection;
		}


		// wait all activations
		var waterFallActivation = Promise.resolve();

		result.activations.forEach(function(activation) {
			waterFallActivation = waterFallActivation.then(function() {
				return self.get(activation);
			});
		});

		return waterFallActivation.then(function() {
			return result.injection;
		});
	});
};

// private methods
Linker.prototype._loadModule = function(moduleName) {
	var self = this;
	var lib = moduleName.split(REQUIRE_MODULE_INDICATOR).pop();

	return Promise.resolve(self._require(lib));
};

Linker.prototype._inject = function(moduleName) {
	var self = this;

	var module = self._modules[moduleName];

	if (!module) {
		var error = new Error('Module [' + moduleName + '] is not registered');
		process.nextTick(function() {
			self.emit('error', error);
		});

		return Promise.reject(error);
	}

	var asyncArgs = Array.isArray(module._requires) ?
			module._requires.map(function(dependencyName) {
				return self.get(dependencyName);
			}) : [];

	var activations = Array.isArray(module._activations) ?
			module._activations :
			null;

	return Promise.all(asyncArgs).then(function(args) {
		if (typeof module._factory === 'function') {
			return module._factory.apply(self, args);
		}

		return true;
	}).then(function(injection) {
		return {
			injection: injection,
			activations: activations
		};
	});
};

Linker.prototype._scan = function(pattern) {
	var self = this;

	return new Promise(function(resolve, reject) {
		glob(pattern, function(err, files) {
			if (err) {
				return reject(err);
			}

			files.every(function(file) {
				var module = self._require(path.resolve('.', file));

				if (module._) {
					if (self._modules[module._]) {
						reject(new Error('Dupplicate module [' + module._ + '] declaration'));

						// break the loop
						return false;
					}

					self._modules[module._] = module;
				}

				// continue
				return true;
			});

			return resolve();
		});
	});
};

module.exports = Linker;
