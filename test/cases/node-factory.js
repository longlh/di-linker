require('../setup/blanket');
var should = require('should');

describe('DI Factory', function() {
	var lib = require('../../core/node-factory');

	it('should be required well', function(done) {
		('function').should.be.exactly(typeof lib);
		('function').should.be.exactly(typeof lib.Context);

		done();
	});

	it('should be initialized well via top function', function(done) {
		lib('test/data/*.js').then(function(context) {
			(context instanceof lib.Context).should.be.exactly(true);

			done();
		});
	});

	it('should wire modules correctly', function(done) {
		lib('test/data/*.js', require).then(function(context) {
			return context.bootstrap(['/sample/module1']);
		}).then(function(context) {
			return context.resolve('/sample/module1');
		}).then(function(main) {
			(main).should.be.exactly(require('events'));

			done();
		});
	});
});
