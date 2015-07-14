'use strict';
require('blanket')({
	pattern: function(file) {
		// console.log(file);
		return !/node_modules/.test(file) && /lib/.test(file);
	}
});
