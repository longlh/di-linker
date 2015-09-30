require('../setup/blanket');
var should = require('should');

describe('Context', function() {
	var Context = require('../../core/context');

	it('should register factory well', function(done) {
		var context = new Context();

		context.factory('/main', [
			function() {
				done();
			}
		]);

		context.bootstrap(['/main']);
	});

	it('should return promise during resolving', function(done) {
		var context = new Context();

		context.factory('defer-component', [
			'@bluebird',
			function(Promise) {
				var deferred = Promise.defer();

				setTimeout(function() {
					deferred.resolve();
				}, 1e3);

				return deferred.promise;
			}
		]);

		context.factory('main', [
			'defer-component',
			function(component) {
			}
		]);

		context.factory('worker', [
			'defer-component',
			function(component) {
				done();
			}
		]);

		context.bootstrap(['main']);
		context.bootstrap(['worker']);
	});
});
