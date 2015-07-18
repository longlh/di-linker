exports._ = '/sample/module1';
exports._requires = [
	'/sample/module2'
];
exports._activations = [
	'/activation'
];
exports._factory = function(file2) {
	return file2;
};
