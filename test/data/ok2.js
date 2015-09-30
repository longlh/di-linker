'use strict';

exports.name = '/sample/module2';
exports.requires = [
	'@events'
];
exports.factory = function(events) {
	return events;
};
