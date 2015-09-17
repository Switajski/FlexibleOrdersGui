# FlexibleOrdersGui

GUI with ExtJs 4.2.1 for [FlexibleOrders](https://github.com/Switajski/FlexibleOrders)


##Building and tooling
I'm trying to seperate Javascript with its npm tooling from the java world. Nevertheless, the REST-API runs on a java-server. Consequently, the deployment is done with maven:
```
mvn clean deploy
```

### Javascript tooling:
The code in this project is minified, when ready to deploy. I'm also planning to do some tests and let them run on Travis-CI. This is all done via grunt:
```
npm install -g grunt-cli
npm install grunt-cli
grunt
```
a folder `node_modules` (Node.js modules) and `deploy` (zipped file for maven build) will appear.

##Adding GUI to a Java project:
For those, who are
In order to deploy the GUI on a webserver add to pom.xml:

```xml
<dependency>
    <groupId>de.switajski</groupId>
    <artifactId>FlexibleOrdersGui</artifactId>
    <version>0.1.0-SNAPSHOT</version>
    <type>zip</type>
</dependency>`
```

and let maven unpack it in the package phase:
```xml
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
```