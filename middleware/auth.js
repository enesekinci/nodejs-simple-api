const fastifyPlugin = require('fastify-plugin')

module.exports = fastifyPlugin(async (fastify) => {
    fastify.decorate('jwt_verify', async (request, response) => {
        try {
            const result = await request.jwtVerify()
            console.log("middleware => " + result);
        } catch (error) {
            response.send({
                status: 401,
                subStatus: 100,
                message: 'jwt not verify'
            }).status(401)
        }
    })
})