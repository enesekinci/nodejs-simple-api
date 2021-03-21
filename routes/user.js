const { UserController } = require("../controller/user_controller");
const Joi = require('joi')
const config = require('dotenv').config().parsed
const registerSchema = require('./schema/user_register')

module.exports = async function routes(fastify, options, next) {

    fastify.post('/register', { schema: registerSchema }, async (request, response, next) => {
        response.send({ hello: 'world test', request: request.body })
    })

    fastify.post('/login', async (request, response, next) => {
        response.send({ bye: 'good bye' })
    })

    fastify.post('/generate-membership-token', UserController.generateMemberShipTokken);

    fastify.get('/check-membership-token', { preValidation: [fastify.jwt_verify] }, async (request, reply) => {
        return null
    });

    next()
}