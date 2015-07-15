DI-Linker
======
[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]

`di-linker` is a lightweight Dependency Injection Framework for NodeJS.  
It provides some main features:
- No more hard-coded dependencies
- No more confusing `require` statement
- Scan source codes, wire them together then bootstrap main module

### Installation
```bash
npm install di-linker
```

### Wire your codes
Prepare source codes:
```javascript
// index.js
var linker = require('di-linker');
var sources = [
  'app/**/*.js'
];

linker(sources, require)
.on('error', console.error.bind(console))
.bootstrap('/main'); // entry point
```

```javascript
// app/main.js
exports._ = '/main';
exports._requires = [
  '/lib' // require `/lib` module
];
exports._factory = function(lib) {
  // use `lib` here
  console.log('`lib` module injected');
};
```

```javascript
// app/lib.js
exports._ = '/lib';
exports._requires = [
  '@fs', // require `fs` package
  '@path' // require `path` package
];
exports._factory = function(fs, path) {
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
#### Define modules
`exports._`: Define module name.  
`exports._requires`: Define the module's dependencies. Note that `@` prefix means requiring Node packages.  
`exports._factory`: Define a function as factory for the module. Module's dependencies are injected as parameters of this function.  

### Tests
```bash
$ npm install
$ npm test
```

### License
[The MIT License](http://opensource.org/licenses/MIT)

[npm-image]: https://img.shields.io/npm/v/di-linker.svg?style=flat
[npm-url]: https://www.npmjs.org/package/di-linker
[downloads-image]: https://img.shields.io/npm/dm/di-linker.svg?style=flat
[coveralls-image]: https://coveralls.io/repos/longlh/di-linker/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/longlh/di-linker?branch=master
[travis-image]: https://travis-ci.org/longlh/di-linker.svg
[travis-url]: https://travis-ci.org/longlh/di-linker
