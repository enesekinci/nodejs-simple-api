const { UserController } = require("../controller/user_controller");

module.exports = async function routes(fastify) {

    fastify.post('/generate-membership-token', { preValidation: [fastify.JwtAuth] }, UserController.generateMemberShipToken)

    fastify.post('/check-membership-token', UserController.checkMembershipToken)


}