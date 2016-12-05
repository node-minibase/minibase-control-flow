<p align="center">
  <a href="https://github.com/node-minibase">
    <img height="250" width="250" src="https://avatars1.githubusercontent.com/u/23032863?v=3&s=250">
  </a>
</p>

# minibase-control-flow [![NPM version](https://img.shields.io/npm/v/minibase-control-flow.svg?style=flat)](https://www.npmjs.com/package/minibase-control-flow) [![NPM downloads](https://img.shields.io/npm/dm/minibase-control-flow.svg?style=flat)](https://npmjs.org/package/minibase-control-flow) [![npm total downloads][downloads-img]][downloads-url]

> Plugin for [minibase][] and [base][] that adds control flow methods `.serial` and `.parallel` to your application, based on the power of [each-promise][] lib for dealing with async flow.

[![code climate][codeclimate-img]][codeclimate-url] 
[![standard code style][standard-img]][standard-url] 
[![linux build status][travis-img]][travis-url] 
[![windows build status][appveyor-img]][appveyor-url] 
[![coverage status][coveralls-img]][coveralls-url] 
[![dependency status][david-img]][david-url]

You might also be interested in [each-promise](https://github.com/tunnckocore/each-promise#readme).

## Table of Contents
- [Install](#install)
- [Usage](#usage)
- [API](#api)
  * [minibaseControlFlow](#minibasecontrolflow)
  * [.serial](#serial)
  * [.parallel](#parallel)
  * [.each](#each)
  * [Options](#options)
  * [Hooks](#hooks)
  * [Item](#item)
  * [Finish hook](#finish-hook)
- [Related](#related)
- [Contributing](#contributing)
- [Building docs](#building-docs)
- [Running tests](#running-tests)
- [Author](#author)
- [License](#license)

_(TOC generated by [verb](https://github.com/verbose/verb) using [markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

## Install
Install with [npm](https://www.npmjs.com/)

```
$ npm install minibase-control-flow --save
```

or install using [yarn](https://yarnpkg.com)

```
$ yarn add minibase-control-flow
```

## Usage
> For more use-cases see the [tests](test.js)

```js
const minibaseControlFlow = require('minibase-control-flow')
```

## API

### [minibaseControlFlow](index.js#L39)
> Adds `.serial` and `.parallel` methods to your application. The `opts` object is merged with app's options and it is passed to respective [each-promise][] methods. See [options section](#options).

**Params**

* `opts` **{Object}**: optional, passed directly to [each-promise][]    
* `returns` **{Function}**: plugin that can be passed to [base][]/[minibase][]'s `.use` method  

**Example**

```js
var flow = require('minibase-control-flow')

var MiniBase = require('minibase').MiniBase
var app = new MiniBase()
app.use(flow())

// or as Base plugin

var Base = require('base')
var base = new Base()
base.use(flow())
```

### [.serial](index.js#L90)
> Iterate over `iterable` in series (serially) with optional `opts` (see [options section](#options)) and optional `mapper` function (see [item section](#item)).

**Params**

* `<iterable>` **{Array|Object}**: iterable object like array or object with any type of values    
* `[mapper]` **{Function}**: function to apply to each item in `iterable`, see [item section](#item)    
* `[opts]` **{Object}**: see [options section](#options)    
* `returns` **{Promise}**  

**Example**

```js
var delay = require('delay')
var flow = require('minibase-control-flow')
var app = require('minibase')

app.use(flow())

var arr = [
  () => delay(500).then(() => 1),
  () => delay(200).then(() => { throw Error('foo') }),
  () => delay(10).then(() => 3),
  () => delay(350).then(() => 4),
  () => delay(150).then(() => 5)
]

app.serial(arr)
.then((res) => {
  console.log(res) // [1, Error: foo, 3, 4, 5]
})

// see what happens when parallel
app.parallel(arr)
.then((res) => {
  console.log(res) // => [3, 5, Error: foo, 4, 1]
})

// pass `settle: false` if you want
// to stop after first error
app.serial(arr, { settle: false })
.catch((err) => console.log(err)) // => Error: foo
```

### [.parallel](index.js#L169)
> Iterate concurrently over `iterable` in parallel (support limiting with `opts.concurrency`) with optional `opts` (see [options section](#options)) and optional `mapper` function (see [item section](#item)).

**Params**

* `<iterable>` **{Array|Object}**: iterable object like array or object with any type of values    
* `[mapper]` **{Function}**: function to apply to each item in `iterable`, see [item section](#item)    
* `[opts]` **{Object}**: see [options section](#options)    
* `returns` **{Promise}**  

**Example**

```js
var flow = require('minibase-control-flow')
var app = require('minibase')

app.use(flow())

var arr = [
  function one () {
    return delay(200).then(() => {
      return 123
    })
  },
  Promise.resolve('foobar'),
  function two () {
    return delay(1500).then(() => {
      return 345
    })
  },
  delay(10).then(() => 'zero'),
  function three () {
    return delay(400).then(() => {
      coffffnsole.log(3) // eslint-disable-line no-undef
      return 567
    })
  },
  'abc',
  function four () {
    return delay(250).then(() => {
      return 789
    })
  },
  function five () {
    return delay(100).then(() => {
      sasasa // eslint-disable-line no-undef
      return 444
    })
  },
  function six () {
    return delay(80).then(() => {
      return 'last'
    })
  }
]

// does not stop after first error
// pass `settle: false` if you want
app.parallel(arr).then((res) => {
  console.log(res)
  // => [
  //   'foobar',
  //   'abc',
  //   'zero',
  //   'last',
  //   ReferenceError: sasasa is not defined,
  //   123,
  //   789,
  //   ReferenceError: coffffnsole is not defined
  //   345
  // ]
})
```

### [.each](index.js#L213)
> Iterate over `iterable` in series or parallel (default), depending on default `opts`. Pass `opts.serial: true` if you want to iterate in series, pass `opts.serial: false` or does not pass anything for parallel.

**Params**

* `<iterable>` **{Array|Object}**: iterable object like array or object with any type of values    
* `[mapper]` **{Function}**: function to apply to each item in `iterable`, see [item section](#item)    
* `[opts]` **{Object}**: see [options section](#options)    
* `returns` **{Promise}**  

**Example**

```js
var delay = require('delay')
var app = require('minibase')
var flow = require('minibase-control-flow')

app.use(flow())

var promise = app.each([
  123,
  function () {
    return delay(500).then(() => 456)
  },
  Promise.resolve(678),
  function () {
    return 999
  },
  function () {
    return delay(200).then(() => 'foo')
  }
])

promise.then(function (res) {
  console.log('done', res) // => [123, 678, 999, 'foo', 456]
})
```

### Options
> You have control over everything, through options.

* `Promise` **{Function}**: custom Promise constructor to be used, defaults to native
* `mapper` **{Function}**: function to apply to each item in `iterable`, see [item section](#item)
* `settle` **{Boolean}**: if `false` stops after first error (also known as _"fail-fast"_ or _"bail"_), default `true`
* `flat` **{Boolean}**: result array to contain only values, default `true`
* `concurrency` **{Number}**: works only with `.parallel` method, defaults to `iterable` length
* `start` **{Function}**: on start hook, see [hooks section](#hooks)
* `beforeEach` **{Function}**: called before each item in `iterable`, see [hooks section](#hooks)
* `afterEach` **{Function}**: called after each item in `iterable`, see [hooks section](#hooks)
* `finish` **{Function}**: called at the end of iteration, see [hooks section](#hooks)

**[back to top](#readme)**

### Hooks
> You can do what you want between stages through hooks - start, before each, after each, finish.

* `start` **{Function}**: called at the start of iteration, before anything
* `beforeEach` **{Function}**: passed with `item, index, arr` arguments
  + `item` is an object with `value`, `reason` and `index` properties, see [item section](#item)
  + `index` is the same as `item.index`
  + `arr` is the iterable object - array or object
* `afterEach` **{Function}**: passed with `item, index, arr` arguments
  + `item` is an object with `value`, `reason` and `index` properties, see [item section](#item)
  + `index` is the same as `item.index`
  + `arr` is the iterable object - array or object
* `finish` **{Function}**: called at the end of iteration, see [finish hook section](#finish-hook)

**[back to top](#readme)**

### Item
> That object is special object, that is passed to `beforeEach` and `afterEach` hooks, also can be found in `result` object if you pass `opts.flat: false` option. And passed to `opts.mapper` function too.

* `item.value` resolved/rejected promise value, if at `beforeEach` hook it can be `function`
* `item.reason` may not exist if `item.value`, if exist it is standard Error object
* `item.index` is number, order of "executing", not the order that is defined in `iterable`

**[back to top](#readme)**

### Finish hook
> This hooks is called when everything is finished / completed. At the very end of iteration. It is passed with `err, result` arguments where:

* `err` is an Error object, if `opts.settle: false`, otherwise `null`
* `result` is always an array with values or [item objects](#item) if `opts.flat: false`

**[back to top](#readme)**

## Related
- [always-done](https://www.npmjs.com/package/always-done): Handle completion and errors with elegance! Support for streams, callbacks, promises, child processes, async/await and sync functions. A drop-in replacement… [more](https://github.com/hybridables/always-done#readme) | [homepage](https://github.com/hybridables/always-done#readme "Handle completion and errors with elegance! Support for streams, callbacks, promises, child processes, async/await and sync functions. A drop-in replacement for [async-done][] - pass 100% of its tests plus more")
- [each-promise](https://www.npmjs.com/package/each-promise): Iterate over promises, promise-returning or async/await functions in series or parallel. Support settle (fail-fast), concurrency (limiting) and hooks system (start… [more](https://github.com/tunnckocore/each-promise#readme) | [homepage](https://github.com/tunnckocore/each-promise#readme "Iterate over promises, promise-returning or async/await functions in series or parallel. Support settle (fail-fast), concurrency (limiting) and hooks system (start, beforeEach, afterEach, finish)")
- [minibase-better-define](https://www.npmjs.com/package/minibase-better-define): Plugin for [base][] and [minibase][] that overrides the core `.define` method to be more better. | [homepage](https://github.com/node-minibase/minibase-better-define#readme "Plugin for [base][] and [minibase][] that overrides the core `.define` method to be more better.")
- [minibase-create-plugin](https://www.npmjs.com/package/minibase-create-plugin): Utility for [minibase][] and [base][] that helps you create plugins | [homepage](https://github.com/node-minibase/minibase-create-plugin#readme "Utility for [minibase][] and [base][] that helps you create plugins")
- [minibase-is-registered](https://www.npmjs.com/package/minibase-is-registered): Plugin for [minibase][] and [base][], that adds `isRegistered` method to your application to detect if plugin is already registered and… [more](https://github.com/node-minibase/minibase-is-registered#readme) | [homepage](https://github.com/node-minibase/minibase-is-registered#readme "Plugin for [minibase][] and [base][], that adds `isRegistered` method to your application to detect if plugin is already registered and returns true or false if named plugin is already registered on the instance.")
- [minibase-results](https://www.npmjs.com/package/minibase-results): Plugin for [minibase][] that adds useful initial properties for test results | [homepage](https://github.com/node-minibase/minibase-results#readme "Plugin for [minibase][] that adds useful initial properties for test results")
- [minibase-tests](https://www.npmjs.com/package/minibase-tests): Tests for applications built on [minibase][] or [base][]. All Base apps passes these tests. | [homepage](https://github.com/node-minibase/minibase-tests#readme "Tests for applications built on [minibase][] or [base][]. All Base apps passes these tests.")
- [minibase-visit](https://www.npmjs.com/package/minibase-visit): Plugin for [minibase][] and [base][], that adds `.visit` method to your application to visit a method over the items in… [more](https://github.com/node-minibase/minibase-visit#readme) | [homepage](https://github.com/node-minibase/minibase-visit#readme "Plugin for [minibase][] and [base][], that adds `.visit` method to your application to visit a method over the items in an object, or map visit over the objects in an array. Using using [collection-visit][] package.")
- [minibase](https://www.npmjs.com/package/minibase): Minimalist alternative for Base. Build complex APIs with small units called plugins. Works well with most of the already existing… [more](https://github.com/node-minibase/minibase#readme) | [homepage](https://github.com/node-minibase/minibase#readme "Minimalist alternative for Base. Build complex APIs with small units called plugins. Works well with most of the already existing [base][] plugins.")
- [try-catch-callback](https://www.npmjs.com/package/try-catch-callback): try/catch block with a callback, used in [try-catch-core][]. Use it when you don't care about asyncness so much and don't… [more](https://github.com/hybridables/try-catch-callback#readme) | [homepage](https://github.com/hybridables/try-catch-callback#readme "try/catch block with a callback, used in [try-catch-core][]. Use it when you don't care about asyncness so much and don't want guarantees. If you care use [try-catch-core][].")

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/node-minibase/minibase-control-flow/issues/new).  
Please read the [contributing guidelines](CONTRIBUTING.md) for advice on opening issues, pull requests, and coding standards.  
If you need some help and can spent some cash, feel free to [contact me at CodeMentor.io](https://www.codementor.io/tunnckocore?utm_source=github&utm_medium=button&utm_term=tunnckocore&utm_campaign=github) too.

**In short:** If you want to contribute to that project, please follow these things

1. Please DO NOT edit [README.md](README.md), [CHANGELOG.md](CHANGELOG.md) and [.verb.md](.verb.md) files. See ["Building docs"](#building-docs) section.
2. Ensure anything is okey by installing the dependencies and run the tests. See ["Running tests"](#running-tests) section.
3. Always use `npm run commit` to commit changes instead of `git commit`, because it is interactive and user-friendly. It uses [commitizen][] behind the scenes, which follows Conventional Changelog idealogy.
4. Do NOT bump the version in package.json. For that we use `npm run release`, which is [standard-version][] and follows Conventional Changelog idealogy.

Thanks a lot! :)

## Building docs
Documentation and that readme is generated using [verb-generate-readme][], which is a [verb][] generator, so you need to install both of them and then run `verb` command like that

```
$ npm install verbose/verb#dev verb-generate-readme --global && verb
```

_Please don't edit the README directly. Any changes to the readme must be made in [.verb.md](.verb.md)._

## Running tests
Clone repository and run the following in that cloned directory

```
$ npm install && npm test
```

## Author
**Charlike Mike Reagent**

+ [github/tunnckoCore](https://github.com/tunnckoCore)
+ [twitter/tunnckoCore](http://twitter.com/tunnckoCore)
+ [codementor/tunnckoCore](https://codementor.io/tunnckoCore)

## License
Copyright © 2016, [Charlike Mike Reagent](http://i.am.charlike.online). Released under the [MIT license](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.2.0, on December 05, 2016._

[assert-kindof]: https://github.com/tunnckocore/assert-kindof
[async-done]: https://github.com/gulpjs/async-done
[base]: https://github.com/node-base/base
[collection-visit]: https://github.com/jonschlinkert/collection-visit
[commitizen]: https://github.com/commitizen/cz-cli
[each-promise]: https://github.com/tunnckocore/each-promise
[is-kindof]: https://github.com/tunnckocore/is-kindof
[kind-of]: https://github.com/jonschlinkert/kind-of
[minibase]: https://github.com/node-minibase/minibase
[standard-version]: https://github.com/conventional-changelog/standard-version
[try-catch-core]: https://github.com/hybridables/try-catch-core
[verb-generate-readme]: https://github.com/verbose/verb-generate-readme
[verb]: https://github.com/verbose/verb

[downloads-url]: https://www.npmjs.com/package/minibase-control-flow
[downloads-img]: https://img.shields.io/npm/dt/minibase-control-flow.svg

[codeclimate-url]: https://codeclimate.com/github/node-minibase/minibase-control-flow
[codeclimate-img]: https://img.shields.io/codeclimate/github/node-minibase/minibase-control-flow.svg

[travis-url]: https://travis-ci.org/node-minibase/minibase-control-flow
[travis-img]: https://img.shields.io/travis/node-minibase/minibase-control-flow/master.svg?label=linux

[appveyor-url]: https://ci.appveyor.com/project/tunnckoCore/minibase-control-flow
[appveyor-img]: https://img.shields.io/appveyor/ci/tunnckoCore/minibase-control-flow/master.svg?label=windows

[coveralls-url]: https://coveralls.io/r/node-minibase/minibase-control-flow
[coveralls-img]: https://img.shields.io/coveralls/node-minibase/minibase-control-flow.svg

[david-url]: https://david-dm.org/node-minibase/minibase-control-flow
[david-img]: https://img.shields.io/david/node-minibase/minibase-control-flow.svg

[standard-url]: https://github.com/feross/standard
[standard-img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

