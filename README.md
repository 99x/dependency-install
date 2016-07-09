# dependency-install
This plugin provides API to install npm dependancies in multiple package.json files by providing the root directory. It also allows to define custom local dependencies inside package.json.

## Installation
To include dependency-install in your project use
`npm install dependency-install --save`

## Usage
```javascript
var di = require('dependency-install');
/* Executes npm install for all the nested pacakge.json files inside "<your-directory>" */
di.install(["<your-directory>"], function() {
    // Things to do after dependency installation completes.
});
```

### Custom dependencies
What if you need to share code, but don't wish to publish packages in NPM Registry?
You can use the Custom Dependancies feature.

1. Create a directory(e.g 'your_local_dependancies') in your codebase to store each local dependency(library) code. Create directories for each of the dependencies with a index.js inside, as shown below.
    ```
    __/your_local_dependancies
        |__dependency-a
            |__index.js
        |__dependency-b
            |__index.js   
            |__package.json // Optional if you have other npm dependancies
    ```

    e.g of index.js inside dependency-a
    ```javascript
    var sayHello = function() {
        console.log("hello");
    };
    module.exports.sayHello = sayHello;
    ```

2. Open a package.json file in your code base which depends on a local dependency (lets say 'dependency-a' and 'dependency-b') and include the section 'customDependencies', as shown below.
    ```json
    {
            "dependencies": {},
            "dependencies": {
                "dependency-a" : "local",
                "dependency-b" : "local"
            }
    }
    ```

3. Initialize the custom dependency path for the library, as shown below.
    ```javascript
    var di = require('dependency-install');
    /* This is to register the cusotm dependancies path */
    di.init('your_local_dependancies');
    /* Executes npm install for all the pacakge.json files inside "<your-directory>" */
    di.install(["<your-directory>"], function() {
        // Things to do after dependency installation completes.
    });
    ```
    Note: After running 'install' for all the nested package.json file dependencies installed from NPM Registry(Similar to running 'npm install' for each of the package) and also copies the custom dependancies from 'your_local_dependancies' directory to the respective 'node_modules' directory.

4. Finally in your code requrie the dependency similar in using a module from NPM Registry, as shown below.
    ```javascript
    var dependencyA = require('dependency-a');
    dependencyA.sayHello(); // Prints "Hello"
    ```

## License

  [MIT](LICENSE)
