let Service = require('./src/service')
let service = new Service()

service.start()

process.on('SIGTERM', () => service.stop())
process.on('SIGINT', () => service.stop())
