'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/vue-obs-bridge.prod.cjs')
} else {
  module.exports = require('./dist/vue-obs-bridge.cjs')
}
