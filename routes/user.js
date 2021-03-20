async function routes(fastify, options) {

    fastify.post('/register', async (request, response) => {
        response.send({ hello: 'world test', request:request.body })
    })

    fastify.post('/login', async (request, response) => {
        response.send({ bye: 'good bye' })  
    })

    fastify.post('/generate-membership-token', async (request, reply) => {
        return null
    });
    fastify.post('/check-membership-token', async (request, reply) => {
        return null
    });
}

module.exports = routes