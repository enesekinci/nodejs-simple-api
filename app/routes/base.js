const { UserController } = require("../controller/user_controller");
const { LoginController } = require("../controller/login_controller");

module.exports = async function routes(fastify) {

    fastify.get('/', { preValidation: [fastify.JwtAuth] }, async function (request, response) {
        const token = await response.jwtSign({ data: "index" })
        response.send({ token })
    })

    fastify.post('/register', UserController.register)

    fastify.post('/login', LoginController.baseLogin)
}