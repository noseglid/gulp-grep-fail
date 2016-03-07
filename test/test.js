'use strict'

var File = require('vinyl')
  , should = require('should')
  , grepFail = require('..')
require('mocha')

describe('Grep fail', function() {

  var exampleData = JSON.stringify({
    key1: 'value1',
    subkey: {
      key1: 'value2',
      grep: 'grepme'
    }
  })

  var fakeFile = null

  beforeEach(function() {
    fakeFile = new File({
      base: 'test/',
      cwd: 'test/',
      path: 'test/test-file.json',
      contents: new Buffer(exampleData)
    })
  })

  describe('Straight grep', function() {

    it('fail if value is found', function(done) {
      var output = grepFail('grep')

      output.on('error', function(e) {
        should.exist(e)
        done()
      })
      output.write(fakeFile)
    })

    it('should not fail if value not found', function (done) {
      var output = grepFail('grepyou')

      output.once('data', function() {
        done()
      })
      output.on('error', function(e) {
        done(e)
      })
      output.write(fakeFile)
    })

  })

  describe('Inverse grep', function() {

    it('fail if value is not found', function(done) {
      var output = grepFail('grepyou', { inverse: true })

      output.once('data', function() {
        done('Should have failed')
      })
      output.on('error', function(e) {
        should.exist(e)
        done()
      })
      output.write(fakeFile)
    })

    it('should not fail if value not found', function (done) {
      var output = grepFail('grepme', { inverse: true })

      output.once('data', function() {
        done()
      })
      output.on('error', function(e) {
        done(e)
      })
      output.write(fakeFile)
    })

  })

})
