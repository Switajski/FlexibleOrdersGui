# FlexibleOrdersGui

GUI with ExtJs 4.2.1 for [FlexibleOrders](https://github.com/Switajski/FlexibleOrders). Why using a seperate project for a GUI? See [wiki](http://wiki.switajski.de/flexible-orders-gui.md) for a detailed description of this modularized approach.

## Tooling, building, deploying:

### Javascript tooling with Node.js:
The code and css in this project is minified with "Grunt" task runner when building.
```
npm install -g grunt-cli
npm install grunt-cli
grunt
```
a folder `node_modules` (Node.js modules) and `deploy` (zipped file for maven build) will appear.

### Deploying updated artifact on Github
I'm trying to seperate Javascript with its npm tooling from the java world. Nevertheless, the REST-API runs on a java-server. In order to publish a next version GUI as a maven artifact, run:
```
mvn clean deploy
```

### Adding GUI-artifact to a Java project:
In order to deploy the GUI on a java webserver add to pom.xml:

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