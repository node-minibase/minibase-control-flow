'use strict'

var utils = require('lazy-cache')(require)
var fn = require
require = utils // eslint-disable-line no-undef, no-global-assign

/**
 * Lazily required module dependencies
 */

require('each-promise', 'each')
require('extend-shallow', 'extend')
require('minibase-create-plugin', 'createPlugin')
require = fn // eslint-disable-line no-undef, no-global-assign

utils.wrap = function wrap (self, flow) {
  return function (iterable, mapper, options) {
    if (typeof mapper === 'function') {
      self.options = utils.extend(self.options, options)
      return flow(iterable, mapper, self.options)
    }
    self.options = utils.extend(self.options, mapper, options)
    return flow(iterable, self.options)
  }
}

/**
 * Expose `utils` modules
 */

module.exports = utils
