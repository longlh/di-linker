'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		clean: {
			dist: 'dist/**'
		},
		browserify: {
			dist: {
				files: {
					'dist/di-linker.js': 'core/browser-factory.js'
				}
			},
			standalone: {
				options: {
					browserifyOptions: {
						standalone: '__'
					}
				},
				files: {
					'dist/di-linker.standalone.js': 'core/browser-factory.js'
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'dist/di-linker.min.js': 'dist/di-linker.js',
					'dist/di-linker.standalone.min.js': 'dist/di-linker.standalone.js'
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

	grunt.registerTask('default', [
		'build'
	]);
};
