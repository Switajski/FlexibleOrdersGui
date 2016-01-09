module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-rename');
    grunt.initConfig({
        compress: {
            main: {
                options: {
                    archive: 'deploy/FlexibleOrdersGui.zip'
                },
                files: [
                    { expand: true, cwd: 'app/', src: ['**'], app: '/'}
                ]}
        },
        rename: {
            toJar: {
                src: 'deploy/FlexibleOrdersGui.zip',
                dest: 'deploy/FlexibleOrdersGui.jar'
            }
        }

    });

    grunt.registerTask('default', [
        'compress', 'rename'
    ]);
};