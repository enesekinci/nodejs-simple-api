// get env keys
const config = require('dotenv').config().parsed
// base path
const path = require('path')
// mongo-db start
require('./app/database/mongodb')
// error trapping process
const errorHandling = require('./app/middleware/error-handling')
// date
const moment = require('moment')
// create a daily log file
const log_path = path.join(__dirname, './app/storage/logs/' + moment().format('YYYY-MM-DD') + '.log')
// fastify create
const fastify = require('fastify')({ logger: { level: 'error', file: log_path } })
// jwt auth token check
fastify.register(require('./app/middleware/jwt_auth'))

// Run the server!
fastify.listen(config.APP_PORT, config.APP_URL, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})
// content type parser
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (request, body, done) {
    try {
        var json = JSON.parse(body)
        done(null, json)
    } catch (err) {
        err.statusCode = 400
        done(err, undefined)
    }
})
// base routes
fastify.register(require('./app/routes/base'), { prefix: '/' })
// user routes
fastify.register(require('./app/routes/user'), { prefix: '/user' })
// error handling and response create
fastify.setErrorHandler(errorHandling)