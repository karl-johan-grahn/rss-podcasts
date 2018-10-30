'use strict'
const Router = require('koa-router')
const base = new Router()

base.use('/api/v1', require('./v1').routes())

module.exports = base
