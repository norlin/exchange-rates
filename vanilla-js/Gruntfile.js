module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			build: {
				src: ['build', 'tmp']
			}
		},
		jshint: {
			options: {
				esnext: true,
				reporterOutput: '',
			},
			build: {
				src: ['src/blocks/**/*.js']
			}
		},
		traceur: {
			build: {
				files: {
					'tmp/scripts/scripts.js': [
						'src/blocks/i-*/*.js',
						'src/blocks/g-*/*.js',
						'src/blocks/b-*/*.js'
					]
				}
			}
		},
		less: {
			build: {
				options: {
					paths: 'src/blocks',
				},
				files: {
					'build/css/_styles.css': 'src/blocks/**/*.less'
				}
			}
		},
		dust: {
			build: {
				options: {
					wrapper: false,
					basePath: 'src/blocks/'
				},
				files: {
					'tmp/scripts/templates.js': 'src/blocks/**/*.dust'
				}
			}
		},
		concat: {
			build: {
				src: 'tmp/scripts/*.js',
				dest: 'build/js/_scripts.js'
			}
		},
		copy: {
			build: {
				src: 'src/index.html',
				dest: 'build/index.html'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-traceur');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-dust');

	// Default task(s).
	grunt.registerTask('default', ['clean', 'less', 'jshint', 'traceur', 'dust', 'concat', 'copy',]);

};
