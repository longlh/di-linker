require('../setup/blanket');
var should = require('should');

describe('DI Factory', function() {
	var di = require('../../core/node-factory');

	it('should be required well', function(done) {
		('function').should.be.exactly(typeof di);
		('function').should.be.exactly(typeof di.walk);
		('function').should.be.exactly(typeof di.Context);

		done();
	});

	it('should return same context via top function', function(done) {
		var context = di('name');
		var anotherContext = di('another_name');
		var sameContext = di('name');

		context.should.be.exactly(sameContext);
		context.should.not.be.exactly(anotherContext);

		done();
	});

	it('should be initialized well via `walk` function', function(done) {
		di.walk('test/data/*.js').then(function(context) {
			(context instanceof di.Context).should.be.exactly(true);

			done();
		});
	});

	it('should wire modules correctly', function(done) {
		di.walk('test/data/*.js', require).then(function(context) {
			return context.bootstrap(['/sample/module1']);
		}).then(function(context) {
			return context.resolve('/sample/module1');
		}).then(function(main) {
			(main).should.be.exactly(require('events'));

			done();
		});
	});
});
