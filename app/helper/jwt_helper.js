const createHttpError = require('http-errors');
const JWT = require('jsonwebtoken');
const config = require('dotenv').config().parsed


class JwtHelper {

    static async JWTToken(data = {}, expiresIn = config.MEMBERSHIPAPPLICATIONPERIOD) {
        return await JWT.sign({ data }, config.APP_KEY, { expiresIn: expiresIn });
    }

    static async JWTDecode(token) {
        const decodeToken = await JWT.verify(token, config.APP_KEY, function (error, decoded) {
            if (error) return false;
            return decoded;
        });
        return decodeToken;
    }
}





module.exports = { JwtHelper }