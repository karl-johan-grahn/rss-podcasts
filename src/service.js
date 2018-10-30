const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const endpoints = require('./endpoints')
// Support for generators such as 'koa-hal' will be removed in v3 of koa, will convert it for now
const convert = require('koa-convert')
const koahal = require('koa-hal')

const defaultHost = 'localhost'
const defaultPort = 3000
const defaultLog = require('./default-logger')

/**
 * Class that represents an instance of the feeds service
 * In theory it's possible to run multiple services in the same
 * process
 * @param {Object} opts The options that can be injected into the constructor
 */
function Service(opts) {
  this.options = opts || {}
  this.options.log = this.options.log || defaultLog
  this.options.port = this.options.port || defaultPort
  this.options.host = this.options.host || defaultHost

  this.log = this.options.log

  this.app = new Koa()
  this.app.context.log = this.log
  this.app.context.host = this.options.host
  this.app.use(async (ctx, next) => {
    try {
      await next()
    } catch(err) {
      ctx.log(err)
      ctx.status = err.status ? err.status : 500
      ctx.body = {
        error: err.message
      }
    }
  })
  this.app.use(async (ctx, next) => {
    ctx.log(`handling request ${ctx.url} from ${ctx.ip}`)
    await next()
  })
  this.app.use(bodyParser())
  this.app.use(convert(koahal()))
  this.app.use(endpoints.routes())
}

/**
 * Starts listening for incoming connections
 */
Service.prototype.start = async function() {
  if (!this.server) {
    let options = this.options
    this.server = this.app.listen(options.port)
    this.log('Service is listening on port ' + options.port)
  }
}

/**
 * Stop listening for incoming connections
 */
Service.prototype.stop = async function() {
  if (this.server) {
    this.server.close()
    this.server = null
    this.log('Service closed')
  }
}

module.exports = Service
