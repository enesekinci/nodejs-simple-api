const { JwtHelper } = require("../helper/jwt_helper");
const createHttpError = require('http-errors')
const fastifyPlugin = require('fastify-plugin')


module.exports = fastifyPlugin(async (fastify) => {
    fastify.decorate('JwtAuth', async (request, response) => {
        const getToken = request.headers.authorization;
        if (!getToken) throw createHttpError(403, 'Token Bilgisi Yok!');

        const token = getToken.replace('Bearer ', '');
        const result = await JwtHelper.JWTDecode(token);

        if (!result) throw createHttpError(403, "Token Süresi Dolmuş!")

        const user = await User.findById({ email: result.user.email })
        if (user && user.status != 0) request.user = user

        throw createHttpError(403, 'Kullanıcı Bulunamadı.')
    })
})
