/*!
 * minibase-control-flow <https://github.com/node-minibase/minibase-control-flow>
 *
 * Copyright (c) Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
 * Released under the MIT license.
 */

'use strict'

var utils = require('./utils')

module.exports = function minibaseControlFlow (opts) {
  return utils.createPlugin('minibase-control-flow', function (self) {
    self.options = utils.extend(self.options, opts)

    self.define('serial', utils.wrap(self, utils.each.serial))
    self.define('parallel', utils.wrap(self, utils.each.parallel))
  })
}
