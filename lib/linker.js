'use strict';
var events = require('events');
var glob = require('glob');
var path = require('path');
var util = require('util');
var Promise = require('bluebird');

var Linker = function(patterns, rek) {
	var self = this;
	self._require = rek || require;
	self._container = {};
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
	}));
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
	var module = self._container[moduleName];

	if (!module) {
		var error = new Error('Module [' + moduleName + '] is not registered');
		process.nextTick(function() {
			self.emit('error', error);
		});

		throw error;
	}

	var args = Array.isArray(module._injects) ?
			module._injects.map(function(dependencyName) {
				return self.get(dependencyName);
			}) : null

	return module._constructor.apply(self, args);
};

Linker.prototype._scan = function(pattern) {
	var self = this;

	return new Promise(function(resolve, reject) {
		glob(pattern, function(err, files) {
			if (err) {
				return reject(err);
			}

			files.forEach(function(file) {
				var module = require(path.resolve('.', file));

				if (module._) {
					self._container[module._] = module;
				}
			});

			return resolve();
		});
	});
};

module.exports = Linker;
