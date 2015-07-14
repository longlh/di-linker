'use strict';
var events = require('events');
var glob = require('glob');
var path = require('path');
var util = require('util');
var Promise = require('bluebird');

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

Linker.prototype.bootstrap = function(moduleName, cb) {
	var self = this;

	if (self._initialize) {
		self._initialize.then(function() {
			var main = self.get(moduleName);

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

Linker.prototype.get = function(moduleName) {
	if (this._cache[moduleName]) {
		return this._cache[moduleName];
	}

	var module = moduleName.indexOf('@') > -1 ?
			this._loadModule(moduleName) :
			this._inject(moduleName);

	return this._cache[moduleName] = module;
};

// private methods
Linker.prototype._loadModule = function(moduleName) {
	var lib = moduleName.split('@').pop();

	return this._require(lib);
};

Linker.prototype._inject = function(moduleName) {
	var self = this;
	var module = self._modules[moduleName];

	if (!module) {
		var error = new Error('Module [' + moduleName + '] is not registered');
		process.nextTick(function() {
			self.emit('error', error);
		});

		throw error;
	}

	var args = Array.isArray(module._requires) ?
			module._requires.map(function(dependencyName) {
				return self.get(dependencyName);
			}) : null

	return module._factory.apply(self, args);
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
