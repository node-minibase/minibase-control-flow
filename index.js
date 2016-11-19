/*!
 * minibase-control-flow <https://github.com/node-minibase/minibase-control-flow>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var extend = require('extend-shallow')
var each = require('each-promise')

module.exports = function minibaseControlFlow (opts) {
  return function (self) {
    self.define('serial', function serial (iterable, opts) {
      this.options = extend({}, this.options, opts)
      return each.serial(iterable, this.options)
    })
    self.define('parallel', function parallel (iterable, opts) {
      return each.parallel(iterable, extend(this.options, opts))
    })
  }
}
