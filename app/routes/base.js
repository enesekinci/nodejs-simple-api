const { UserController } = require("../controller/user_controller");
const registerSchema = require('../schema/user_register')

module.exports = async function routes(fastify) {

    fastify.get('/', { preValidation: [fastify.JwtAuth] }, async function (request, response) {
        const token = await response.jwtSign({ data: "index" })
        response.send({ token })
    })

    fastify.post('/register', { schema: registerSchema }, UserController.register)

    // fastify.post('/login', { schema: registerSchema }, UserController.login)
}