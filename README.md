DI-Linker 2.0.1
======
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

`di-linker` is a lightweight Dependency Injection for Javascript.
It provides some main features:
* No more hard-coded dependencies
* No more confusing `require` statement
* Scan source codes, wire them together then bootstrap main module
* Work both in server and client

# Server

## Installation
```bash
npm install di-linker
```

## Wire your codes
Prepare source codes:
```javascript
// index.js
var di = require('di-linker');
var sources = [
  'app/**/*.js'
];

di(sources, require).then(function(context) {
  return context.bootstrap(['/main']); // entry point
}).catch(console.error.bind(console))
```

```javascript
// app/main.js
exports.name = '/main';
exports.requires = [
  '/lib' // wire `/lib` module
];
exports.factory = function(lib) {
  // use `lib` here
  console.log('`lib` module injected');
};
```

```javascript
// app/lib.js
exports.name = '/lib';
exports.requires = [
  '@fs', // require `fs` package
  '@path' // require `path` package
];
exports.factory = function(fs, path) {
  return {
    fs: fs,
    path: path
  };
};
```

That is all, now you can run your application:
```bash
node ./index.js
```
## Define modules
* `exports.name` {String} Define module name
* `exports.requires` {Array} Define the module's dependencies. Note that `@` prefix means requiring Node packages
* `exports.factory` {Function} Define a function as factory for the module. Module's dependencies are injected as parameters of this function
* `exports.activations` {Array} List of other modules need be activated after the module initialized (can be omitted)
* `exports.value` {Object} Use a specified value insteads of factory. This option will override `factory` option

# Client

## Installation
```bash
bower install di-linker
```

## Wire your codes
In HTML:
```
<script src="bower_components/di-linker/dist/di-linker.standalone.min.js"></script>
```

In Javascript:
```
var context = __('app_name');

context.factory('main', [
  'lib',
  function(lib) {
    // lib is injected and can be used here
  }
]);

context.factory('lib', [
  function() {
    return {
      veryUsefulFunction: function() {}
    };
  }
]);

context.bootstrap(['main']);
```

## Built-in modules for client-side
Because `di-linker` use `lodash` and `bluebird` internally, so those modules are built-in. They can be injected via reversed words `@lodash` and `@bluebird`.

```
__('app_name').factory('lib', [
  '@lodash',
  '@bluebird',
  function(_, Promise) {
  }
]);
```

# APIs

`Context` is core class of `di-linker`. It can be created by the following methods:

Server-side:
```
var di = require('di-linker');

// scan code folder and return a context instance via promise
di(patterns).then(function(context) {

});

// another way
var context = new di.Context();
```

Client-side:
```
// get a context instance via global function `__`
var newContext = __('context_name');
var sameContext = __('context_name');

console.log(newContext === sameContext) // true

// another way
var context = new __.Context();
```

## Methods

### context.register(def)

* `def` {Object}
  * `name` {String} Define module name
  * `requires` {Array} Define the module's dependencies. Note that `@` prefix means requiring Node packages
  * `activations` {Array} List of other modules need be activated after the module initialized (can be omitted)
  * `factory` {Function} Define a function as factory for the module. Module's dependencies are injected as parameters of this function
  * `value` {Object} Use a specified value insteads of factory. This option will override `factory` option
* return: current context

Register a dependency

### context.value(name, value)
* `name` {String} Dependency name
* `value` {Object} Dependency value, will be injected
* return: current context

Sugar method of `context.register()` for value-type dependency, with `name` and `value` only


### context.factory(name, def)
* `name` {String} Dependency name
* `def` {Array} Last element is factory function, other are name of dependencies need to injected
* return: current context

Sugar method of `context.register()` for factory-type dependency, width `name`, `requires` and `factory` only

### context.bootstrap(modules)
* `modules` {Array} Array of module name that need to execute
* return: a promise that resolve the current context when bootstrap is done

Execute some modules that registered already in the context

# Tests
```bash
$ npm install
$ npm test
```

# License
[The MIT License](http://opensource.org/licenses/MIT)

[npm-image]: https://img.shields.io/npm/v/di-linker.svg?style=flat
[npm-url]: https://www.npmjs.org/package/di-linker
[downloads-image]: https://img.shields.io/npm/dm/di-linker.svg?style=flat
[coveralls-image]: https://coveralls.io/repos/longlh/di-linker/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/longlh/di-linker?branch=master
[travis-image]: https://travis-ci.org/longlh/di-linker.svg
[travis-url]: https://travis-ci.org/longlh/di-linker
