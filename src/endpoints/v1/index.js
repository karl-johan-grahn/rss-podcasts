'use strict'
const Router = require('koa-router')
const base = new Router()

base.use('/feeds', require('./feeds').routes())

module.exports = base
