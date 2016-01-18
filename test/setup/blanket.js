'use strict';
require('blanket')({
	pattern: function(file) {
		return !/node_modules/.test(file) && /core/.test(file);
	},
});
