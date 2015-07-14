exports._ = '/sample/module1';
exports._injects = [
	'/sample/module2'
];
exports._constructor = function(file2) {
	return file2;
};
