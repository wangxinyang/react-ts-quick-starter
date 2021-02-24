const SERVER_HOST = '127.0.0.1'
const SERVER_PORT = 3001
const isDev = process.env.NODE_ENV !== 'production'

module.exports = {
  SERVER_HOST,
  SERVER_PORT,
  isDev,
}
