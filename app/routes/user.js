const { UserController } = require("../controller/user_controller");
const Joi = require('joi')
const config = require('dotenv').config().parsed
const registerSchema = require('./schema/user_register')

module.exports = async function routes(fastify) {

    fastify.post('/generate-membership-token', { preValidation: [fastify.JwtAuth] }, UserController.generateMemberShipToken);

    fastify.post('/check-membership-token', UserController.checkMembershipToken);

    fastify.post('/register', { schema: registerSchema }, async (request, response, next) => {
        response.send({ hello: 'world test', request: request.body })
    })

    fastify.post('/login', async (request, response, next) => {
        response.send({ bye: 'good bye' })
    })
}