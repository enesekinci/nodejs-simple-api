const config = require('dotenv').config().parsed
// Require the framework and instantiate it
const fastify = require('fastify')({ logger: config.APP_DEBUG })
require('./database/mongodb')
// Run the server!
fastify.listen(config.APP_PORT, config.APP_URL, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
})

// Declare a route
fastify.get('/', function (request, response) {
    response.send({ hello: 'world', request: request.headers })
})

fastify.register(require('./routes/test'), { prefix: '/v1/test' })
