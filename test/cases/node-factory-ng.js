require('../setup/blanket');
var should = require('should');

describe('DI Factory', function() {
	var lib = require('../../core/node-factory');

	it('should throw error when invalid pattern', function(done) {
		lib().catch(function(error) {
			error.should.be.Error();
			done();
		});
	});

	it('should emit error when bootstrap failed', function(done) {
		lib('test/data/*.js').then(function(context) {
			return context.bootstrap(['/main']);
		}).catch(function(error) {
			error.should.be.Error();
			done();
		});
	});

	it('should return error when module dupplicate', function(done) {
		lib('test/data/dupplicate/*.js').catch(function(error) {
			error.should.be.Error();

			done();
		});
	});
});
