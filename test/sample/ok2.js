exports._ = '/sample/module2';
exports._injects = [
	'@events'
];
exports._constructor = function(events) {
	return events;
};