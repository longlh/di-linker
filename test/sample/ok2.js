exports._ = '/sample/module2';
exports._requires = [
	'@events'
];
exports._factory = function(events) {
	return events;
};