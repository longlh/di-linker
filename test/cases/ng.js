require('../setup/blanket');
var should = require('should');

describe('Linker', function() {
	var lib = require('../../lib');

	it('should throw error when invalid pattern', function(done) {
		lib().on('error', function(err) {
			err.should.be.Error();
			done();
		});
	});

	it('should emit error when bootstrap failed', function(done) {
		lib('test/sample/*.js').on('error', function(err) {
			err.should.be.Error();
			done();
		}).bootstrap('/main');
	});

	it('should return error when bootstrap failed', function(done) {
		lib('test/sample/*.js').bootstrap('/main', function(err, main) {
			err.should.be.Error();
			done();
		});
	});

	it('should return error when module dupplicate', function(done) {
		lib('test/sample/dupplicate/*.js').on('error', function(err) {
			err.should.be.Error();

			done();
		});
	});
});