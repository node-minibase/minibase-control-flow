/*!
 * minibase-control-flow <https://github.com/node-minibase/minibase-control-flow>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

/**
 * > Adds `.serial` and `.parallel` methods to your application.
 * The `opts` object is merged with app's options and it is
 * passed to respective [each-promise][] methods.
 * See [options section](#options).
 *
 * **Example**
 *
 * ```js
 * var flow = require('minibase-control-flow')
 *
 * var MiniBase = require('minibase').MiniBase
 * var app = new MiniBase()
 * app.use(flow())
 *
 * // or as Base plugin
 *
 * var Base = require('base')
 * var base = new Base()
 * base.use(flow())
 * ```
 *
 * @param  {Object} `opts` optional, passed directly to [each-promise][]
 * @return {Function} plugin that can be passed to [base][]/[minibase][]'s `.use` method
 * @api public
 */

module.exports = function minibaseControlFlow (opts) {
  return utils.createPlugin('minibase-control-flow', function (self) {
    self.options = utils.extend(self.options, opts)

    /**
     * > Iterate over `iterable` in series (serially)
     * with optional `opts` (see [options section](#options))
     * and optional `mapper` function (see [item section](#item)).
     *
     * **Example**
     *
     * ```js
     * var delay = require('delay')
     * var flow = require('minibase-control-flow')
     * var app = require('minibase')
     *
     * app.use(flow())
     *
     * var arr = [
     *   () => delay(500).then(() => 1),
     *   () => delay(200).then(() => { throw Error('foo') }),
     *   () => delay(10).then(() => 3),
     *   () => delay(350).then(() => 4),
     *   () => delay(150).then(() => 5)
     * ]
     *
     * app.serial(arr)
     * .then((res) => {
     *   console.log(res) // [1, Error: foo, 3, 4, 5]
     * })
     *
     * // see what happens when parallel
     * app.parallel(arr)
     * .then((res) => {
     *   console.log(res) // => [3, 5, Error: foo, 4, 1]
     * })
     *
     * // pass `settle: false` if you want
     * // to stop after first error
     * app.serial(arr, { settle: false })
     * .catch((err) => console.log(err)) // => Error: foo
     * ```
     *
     * @name   .serial
     * @param  {Array|Object} `<iterable>` iterable object like array or object with any type of values
     * @param  {Function} `[mapper]` function to apply to each item in `iterable`, see [item section](#item)
     * @param  {Object} `[opts]` see [options section](#options)
     * @return {Promise}
     * @api public
     */

    self.define('serial', utils.wrap(self, utils.each.serial))

    /**
     * > Iterate concurrently over `iterable` in parallel (support limiting with `opts.concurrency`)
     * with optional `opts` (see [options section](#options))
     * and optional `mapper` function (see [item section](#item)).
     *
     * **Example**
     *
     * ```js
     * var flow = require('minibase-control-flow')
     * var app = require('minibase')
     *
     * app.use(flow())
     *
     * var arr = [
     *   function one () {
     *     return delay(200).then(() => {
     *       return 123
     *     })
     *   },
     *   Promise.resolve('foobar'),
     *   function two () {
     *     return delay(1500).then(() => {
     *       return 345
     *     })
     *   },
     *   delay(10).then(() => 'zero'),
     *   function three () {
     *     return delay(400).then(() => {
     *       coffffnsole.log(3) // eslint-disable-line no-undef
     *       return 567
     *     })
     *   },
     *   'abc',
     *   function four () {
     *     return delay(250).then(() => {
     *       return 789
     *     })
     *   },
     *   function five () {
     *     return delay(100).then(() => {
     *       sasasa // eslint-disable-line no-undef
     *       return 444
     *     })
     *   },
     *   function six () {
     *     return delay(80).then(() => {
     *       return 'last'
     *     })
     *   }
     * ]
     *
     * // does not stop after first error
     * // pass `settle: false` if you want
     * app.parallel(arr).then((res) => {
     *   console.log(res)
     *   // => [
     *   //   'foobar',
     *   //   'abc',
     *   //   'zero',
     *   //   'last',
     *   //   ReferenceError: sasasa is not defined,
     *   //   123,
     *   //   789,
     *   //   ReferenceError: coffffnsole is not defined
     *   //   345
     *   // ]
     * })
     * ```
     *
     * @name   .parallel
     * @param  {Array|Object} `<iterable>` iterable object like array or object with any type of values
     * @param  {Function} `[mapper]` function to apply to each item in `iterable`, see [item section](#item)
     * @param  {Object} `[opts]` see [options section](#options)
     * @return {Promise}
     * @api public
     */

    self.define('parallel', utils.wrap(self, utils.each.parallel))
  })
}
