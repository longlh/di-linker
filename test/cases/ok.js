require('../setup/blanket');
var should = require('should');

describe('Linker', function() {
	var lib = require('../../lib');

	it('should be required well', function(done) {
		('function').should.be.exactly(typeof lib);
		('function').should.be.exactly(typeof lib.Linker);

		done();
	});

	it('should be initialized well via top function', function(done) {
		var linker = lib('test/sample/*.js');

		(linker instanceof lib.Linker).should.be.exactly(true);

		done();
	});

	it('can require other NodeJS packages', function(done) {
		var linker = lib('test/sample/*.js', require);

		linker.get('@events').then(function(events) {
			events.should.be.exactly(require('events'));

			done();
		});
	});

	it('should wire modules correctly', function(done) {
		lib('test/sample/*.js', require).bootstrap('/sample/module1', function(err, main) {
			(main).should.be.exactly(require('events'));

			done();
		});
	});

	it('should cache modules correctly', function(done) {
		var linker = lib('test/sample/*.js', require).bootstrap('/sample/module1', function(err, main) {

			linker.get('/sample/module1').then(function(module1) {
				(main).should.be.exactly(module1);

				done();
			});
		});
	});
});
