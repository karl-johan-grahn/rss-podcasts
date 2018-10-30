let mocha = require('mocha')
let chai = require('chai')
let chaiHttp = require('chai-http')
let expect = chai.expect
chai.use(chaiHttp)

let Service = require('service.js')

let silent = function() {}

describe('service', function() {
  it('should respond to HTTP request', function(done) {
    let s = new Service({ log: silent })
    s.start()
    chai.request('http://localhost:3000/api/v1/feeds')
      .get('/')
      .end(function(err, response) {
        if (err) return done(err)
        expect(response).to.have.status(200)
        s.stop()
        done()
      })
  })

  it('should be possible to use custom port', function(done) {
    let s = new Service({ port: 4000, log: silent })
    s.start()
    chai.request('http://localhost:4000/api/v1/feeds')
      .get('/')
      .end(function(err, response) {
        if (err) return done(err)
        expect(response).to.have.status(200)
        s.stop()
        done()
      })
  })

})
