const fs = require('fs')
const sums = require('sums')
const rp = require('request-promise')

async function getChecksum(algorithm, url) {
  let options = {
    method: "GET",
    uri: url
  }
  const stream = await rp(options)
  return await sums.checksum(stream, algorithm)
}

module.exports = {
  getChecksum: getChecksum
}
