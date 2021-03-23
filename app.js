const config = require('dotenv').config().parsed
const path = require('path')
const errorHandling = require('./app/middleware/error-handling')
const moment = require('moment')
const log_path = path.join(__dirname, './app/storage/logs/' + moment().format('YYYY-MM-DD') + '.log')
require('./app/database/mongodb')
const fastify = require('fastify')({ logger: { level: 'info', file: log_path } })
fastify.register(require('fastify-jwt'), { secret: config.APP_KEY })

// Run the server!
fastify.listen(config.APP_PORT, config.APP_URL, function (err, address) {
    if (err) {
        // fastify.log.error(err)
        process.exit(1)
    }
    // fastify.log.info(`server listening on ${address}`)

})

fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
    try {
        var json = JSON.parse(body)
        done(null, json)
    } catch (err) {
        err.statusCode = 400
        done(err, undefined)
    }
})


fastify.register(require('./app/middleware/auth'))

fastify.get('/', async function (request, response) {
    const token = await response.jwtSign({ data: "index" })
    response.send({ token })
})

fastify.register(require('./app/routes/test'), { prefix: '/test' })
fastify.register(require('./app/routes/user'), { prefix: '/user' })

fastify.setErrorHandler(errorHandling)