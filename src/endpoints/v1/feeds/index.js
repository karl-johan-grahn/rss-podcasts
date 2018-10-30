'use strict'
const Router = require('koa-router')
const base = new Router()
const hal = require('halson')

base.get('/', async (ctx) => {
  let resource = hal({title: 'RSS feeds service API'})
    .addLink('self', ctx.request.url)
    .addLink('episodes', ctx.host + '/api/v1/feeds/episodes')
  resource.description = 'Hello, I am the RSS feeds service API'
  ctx.body = resource
})

base.use('/episodes', require('./episodes').routes())

module.exports = base
