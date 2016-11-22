/*!
 * minibase-control-flow <https://github.com/node-minibase/minibase-control-flow>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

/* jshint asi:true */

'use strict'

var assert = require('assert')
var isPromise = require('is-promise')
var MiniBase = require('minibase').MiniBase
var minitest = require('minibase-tests')
var plugin = require('./index')

var suite = minitest(MiniBase)

suite.addTest('should have `.parallel`, `.serial` and `.each`  methods', function () {
  var app = new MiniBase()
  app.use(plugin())
  assert.strictEqual(typeof app.each, 'function')
  assert.strictEqual(typeof app.serial, 'function')
  assert.strictEqual(typeof app.parallel, 'function')

  return Promise.resolve()
})

suite.addTest('should both methods return promises', function () {
  var base = new MiniBase()
  base.use(plugin())

  var p1 = base.serial([Promise.resolve(11)], function noop () {})
  var p2 = base.parallel(['foo', Promise.resolve(22), 33])
  var p3 = base.each([1, Promise.reject(new Error('foo')), 'qux'])

  assert.strictEqual(isPromise(p1), true)
  assert.strictEqual(isPromise(p2), true)
  assert.strictEqual(isPromise(p3), true)

  return Promise.resolve()
})

suite.runTests().then(function (result) {
  if (result.length) {
    result.forEach(function (test) {
      console.log('not ok', test.index, test.title)
      console.log('  ---')
      console.log(test.reason.stack.split('\n').slice(0, 4).map((line) => {
        return '  ' + line
      }).join('\n'))
      console.log('  ...')
    })
    return
  }

  // all tests count
  console.log('# tests', result.tests)
  // all tests minus errored tests is passed tests count
  console.log('# pass', result.tests - result.length)
  console.log('# ok')
})
