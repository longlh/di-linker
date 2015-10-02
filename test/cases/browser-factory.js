require('../setup/blanket');
var should = require('should');

describe('Context', function() {
	var __ = require('../../core/browser-factory');

	it('should be required well', function(done) {
		('function').should.be.exactly(typeof __);
		('function').should.be.exactly(typeof __.Context);

		done();
	});

	it('should return same context via top function', function(done) {
		var context = __('name');
		var anotherContext = __('another_name');
		var sameContext = __('name');

		context.should.be.exactly(sameContext);
		context.should.not.be.exactly(anotherContext);

		done();
	});

	it('should provide [@lodash]', function(done) {
		var context = __('test');

		context.resolve('@lodash').then(function(_) {
			_.should.be.exactly(require('lodash'));

			done();
		});
	});

	it('should provide [@bluebird]', function(done) {
		var context = __('test');

		context.resolve('@bluebird').then(function(bluebird) {
			bluebird.should.be.exactly(require('bluebird'));

			done();
		});
	});
});
