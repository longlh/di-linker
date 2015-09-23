'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		clean: {
			dist: 'browser/dist'
		},
		browserify: {
			dist: {
				files: {
					'browser/dist/di-linker.js': 'browser/source/main.js'
				}
			},
			standalone: {
				options: {
					browserifyOptions: {
						standalone: '__'
					}
				},
				files: {
					'browser/dist/di-linker.standalone.js': 'browser/source/main.js'
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'browser/dist/di-linker.min.js': 'browser/dist/di-linker.js',
					'browser/dist/di-linker.standalone.min.js': 'browser/dist/di-linker.standalone.js'
				}
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('build', [
		'clean',
		'browserify',
		'uglify'
	]);
};
