'use strict'
const Router = require('koa-router')
const base = new Router()
const Parser = require('rss-parser')
const parser = new Parser()
//const cs = require('checksum')
const rp = require('request-promise')
const ID3 = require('id3-parser')
const hal = require('halson')

/**
 * Endpoint for getting a list of episodes from an RSS feed
 * @param {Query String} url The url of the RSS feed
 * Example request url: http://localhost:3000/api/v1/feeds/episodes?url=http%3A%2F%2Frss.acast.com%2Ftheeconomistasks
 */
base.get('/', async (ctx) => {
  if (ctx.request.query.url === undefined) {
    return ctx.body = {
      statuscode: 400,
      message: "Please provide the URL of the RSS feed as a 'url' query parameter"
    }
  }
  let resource = hal({title: 'List of episodes'})
    .addLink('self', ctx.request.url)
  resource.description = 'List of episodes from an RSS feed'
  let feed
  try {
    feed = await parser.parseURL(ctx.request.query.url)
  } catch (err) {
    return ctx.body = {
      statuscode: err.statusCode,
      message: "There was an error parsing the URL: " + err.message
    }
  }
  const episodesPromises = feed.items.map(async episode => {
    //const hash = await cs.getChecksum('sha1', episode.enclosure.url)
    return {
      title: episode.title,
      checksum: "hash",
      url: episode.enclosure.url
    }
  })
  const resolvedEpisodesPromises = await Promise.all(episodesPromises)
  resource.episodes = resolvedEpisodesPromises
  ctx.body = resource
})

/**
 * Endpoint for getting the ID3 tag info for a particular MP3
 * @param {Query String} url The url of the MP3
 * Example request url: http://localhost:3000/api/v1/feeds/episodes/id3?url=https%3A%2F%2Fmedia.acast.com%2Ftheeconomistasks%2Ftheeconomistasks-howshouldthewestrespondtorussianmeddling-%2Fmedia.mp3
 */
base.get('/id3', async (ctx) => {
  if (ctx.request.query.url === undefined) {
    return ctx.body = {
      statuscode: 400,
      message: "Please provide the URL of the MP3 file as a 'url' query parameter"
    }
  }
  const options = {
    method: "GET",
    uri: ctx.request.query.url
  }
  let resource = hal({title: 'ID3 tags'})
    .addLink('self', ctx.request.url)
  resource.description = 'ID3 tags for a particular MP3 file'
  try {
    const response = await rp(options)
    const buffer = Buffer.from(response)
    const tags = await ID3.parse(buffer)
    resource.tags = tags
    ctx.body = resource
  } catch(err) {
    ctx.body = {
      statuscode: 404,
      message: "Could not get the ID3 tags from the MP3 file",
      error: err.message
    }
  }
})

module.exports = base
