module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.initConfig({
        compress: {
            main: {
                options: {
                    archive: 'deploy/FlexibleOrdersGui.zip'
                },
                files: [
                    { expand: true, cwd: 'app/', src: ['**'], app: '/'}
                ]}
        }
    });

    grunt.registerTask('default', [
        'compress'
    ]);
};