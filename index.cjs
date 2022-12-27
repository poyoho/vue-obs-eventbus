'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/vue-obs-eventbus.prod.cjs')
} else {
  module.exports = require('./dist/vue-obs-eventbus.cjs')
}
