const { SERVER_HOST, SERVER_PORT } = require('./constants')
const base = require('./webpack.common.js')

const { merge } = require('webpack-merge')

module.exports = merge(base, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: SERVER_HOST, // 指定 host，不设置的话默认是 localhost
    port: SERVER_PORT, // 指定端口，默认是8080
    // stats: 'errors-only', // 终端仅打印 error
    // clientLogLevel: 'silent', // 日志等级
    compress: true, // 是否启用 gzip 压缩
    open: true, // 打开默认浏览器
    hot: true, // 热更新
    historyApiFallback: true, // 地址栏访问指定路由时出现了404需要配置
  },
})
