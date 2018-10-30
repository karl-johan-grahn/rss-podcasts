/**
 * The default log function
 */
function defaultLog() {
  console.log.apply(console, arguments)
}

module.exports = defaultLog
