require('../setup/blanket');
var should = require('should');

describe('Context', function() {
	var Context = require('../../core/context');

	it('should throw [Invalid factory format] error when register invalid factory', function(done) {
		var context = new Context();

		try {
			context.factory('ng', function() {});
		} catch(error) {
			done();
		}
	});

	it('should throw [Invalid dependency name]', function(done) {
		var context = new Context();

		context.bootstrap(['']).catch(function(error) {
			error.should.be.Error();

			done();
		});
	});
});
