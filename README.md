# FlexibleOrdersGui

GUI with ExtJs 4.2.1 for FlexibleOrders

In order to deploy on a webserver add to pom.xml:
<dependency>
    <groupId>de.switajski</groupId>
    <artifactId>FlexibleOrdersGui</artifactId>
    <version>0.1.0-SNAPSHOT</version>
    <type>zip</type>
</dependency>

and let maven unpack it:

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-dependency-plugin</artifactId>
            <version>2.2</version>
            <executions>
                <execution>
                    <id>unpack-FlexibleOrdersGui</id>
                    <phase>prepare-package</phase>
                    <goals>
                        <goal>unpack-dependencies</goal>
                    </goals>
                    <configuration>
                        <includeTypes>zip</includeTypes>
                        <outputDirectory>
                            ${project.build.directory}/${project.build.finalName}/
                        </outputDirectory>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
