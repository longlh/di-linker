'use strict';

exports.name = '/sample/module1';
exports.requires = [
	'/sample/module2'
];
exports.activations = [
	'/activation'
];
exports.factory = function(file2) {
	return file2;
};
