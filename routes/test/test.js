async function routes(fastify, options) {

    fastify.get('/test', async (request, reply) => {
        return { hello: 'world test' }
    })

    fastify.get('/bye', async (request, reply) => {
        return { bye: 'good bye' }
    })
}

module.exports = routes