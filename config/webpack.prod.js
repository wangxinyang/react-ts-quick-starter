const base = require('./webpack.common.js')

const { merge } = require('webpack-merge')

module.exports = merge(base, {
  mode: 'production',
  devtool: false,
})
