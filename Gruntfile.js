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

    grunt.registerTask('mavenpom', function () {

        var pom = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<project xmlns="http://maven.apache.org/POM/4.0.0"' +
            ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
            ' xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">\n' +
            '  <modelVersion>4.0.0</modelVersion>\n' +
            '  <groupId>de.switajski</groupId>\n' +
            '  <artifactId>FlexibleOrdersGui</artifactId>\n' +
            '  <packaging>pom</packaging>\n' +
            '  <version>0.1.0-SNAPSHOT</version>\n' +
            '  <build>\n' +
            '    <plugins>\n' +
            '      <plugin>\n' +
            '        <groupId>org.codehaus.mojo</groupId>\n' +
            '        <artifactId>build-helper-maven-plugin</artifactId>\n' +
            '        <version>1.8</version>\n' +
            '        <executions>\n' +
            '          <execution>\n' +
            '            <id>attach-artifacts</id>\n' +
            '            <phase>package</phase>\n' +
            '            <goals>\n' +
            '              <goal>attach-artifact</goal>\n' +
            '            </goals>\n' +
            '            <configuration>\n' +
            '              <artifacts>\n' +
            '                <artifact>\n' +
            '                  <file>deploy/FlexibleOrdersGui.zip</file>\n' +
            '                  <type>zip</type>\n' +
            '                </artifact>\n' +
            '              </artifacts>\n' +
            '            </configuration>\n' +
            '          </execution>\n' +
            '        </executions>\n' +
            '      </plugin>\n' +
            '    </plugins>\n' +
            '  </build>\n' +
            '</project> ';

        grunt.log.writeln('Writing deploy/pom.xml');
        grunt.file.write('deploy/pom.xml', pom);
    });

    grunt.registerTask('default', [
        'compress',
        'mavenpom'
    ]);
};