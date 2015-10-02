require('../setup/blanket');
var should = require('should');

describe('DI Factory', function() {
	var di = require('../../core/node-factory');

	it('should throw error when invalid pattern', function(done) {
		di.walk().catch(function(error) {
			error.should.be.Error();
			done();
		});
	});

	it('should emit error when bootstrap failed', function(done) {
		di.walk('test/data/*.js').then(function(context) {
			return context.bootstrap(['/main']);
		}).catch(function(error) {
			error.should.be.Error();
			done();
		});
	});

	it('should return error when module dupplicate', function(done) {
		di.walk('test/data/dupplicate/*.js').catch(function(error) {
			error.should.be.Error();

			done();
		});
	});
});
