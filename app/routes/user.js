const { UserController } = require("../controller/user_controller");

module.exports = async function routes(fastify) {

    fastify.post('/generate-membership-token', { preHandler: [] }, UserController.generateMemberShipToken)

    fastify.post('/check-membership-token', UserController.checkMembershipToken)

    fastify.post('/get-me', { preValidation: [fastify.JwtAuth] }, UserController.getMe);

    fastify.post('/update-me', { preHandler: [fastify.JwtAuth] }, UserController.updateMe);

}