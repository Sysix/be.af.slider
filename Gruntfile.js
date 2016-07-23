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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('build', ['cssmin', 'uglify']);

};