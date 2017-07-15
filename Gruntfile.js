module.exports = function (grunt) {

    grunt.initConfig({
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '*.css',
                    dest: 'dist',
                    ext: '.min.css',
                    extDot: 'last'
                }]
            }
        },
        uglify: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '*.js',
                    dest: 'dist',
                    ext: '.min.js',
                    extDot: 'last'
                }]
            }
        },

        coveralls: {

            target: {
                // LCOV coverage file (can be string, glob or array)
                src: 'coverage-results/extra-results-*.info',
                options: {
                    // Any options for just this target
                }
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-coveralls');

    grunt.registerTask('build', ['cssmin', 'uglify']);

};