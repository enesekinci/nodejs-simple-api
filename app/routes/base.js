module.exports = async function routes(fastify) {

    fastify.get('/', { preValidation: [fastify.JwtAuth] }, async function (request, response) {
        const token = await response.jwtSign({ data: "index" })
        response.send({ token })
    })
}