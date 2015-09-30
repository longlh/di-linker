require('../setup/blanket');
var should = require('should');

describe('Context', function() {
	var __ = require('../../core/browser-factory');

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
