//turn off beep
var oldout = process.stdout.write;
process.stdout.write = function(msg) {
  oldout.call(this, msg.replace('\x07', ''));
};

//GruntFile.js
module.exports = function(grunt){

	grunt.initConfig({

		// JS Tasks ====================================
		//check all js files for errors

		jshint: {
			all: ['public/js/**/*.js']
		},

		// COOL TASKS ===================================
		// watch css and js files and process the above tasks
		watch: {
			js: {
				files: ['public/js/**/*.js'],
				tasks: ['jshint']
			}
		},
		//configure nodemon to watch our node server for changes
		nodemon: {
			dev: {
				script: 'server.js'
			}
		},

		//run watch and nodemon at the same time
		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			tasks: ['nodemon', 'watch']
		}

	});

	//load nodemon
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	//register  the nodemon task when we run grunt
	grunt.registerTask('default', ['jshint', 'concurrent']);

};