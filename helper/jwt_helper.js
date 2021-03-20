const createHttpError = require('http-errors');
const JWT = require('jsonwebtoken');
const { SECRETKEY, MEMBERSHIPAPPLICATIONPERIOD } = require('../App/GlobalConstant');


const JWTToken = async (data = {}, expiresIn = MEMBERSHIPAPPLICATIONPERIOD) => {
    return await JWT.sign({ data }, SECRETKEY, { expiresIn: expiresIn });
};

const JWTDecode = async (token) => {
    const decodeToken = await JWT.verify(token, SECRETKEY, function (error, decoded) {
        if (error) {
            return false;
        }
        if (decoded) {
            return decoded;
        }
    });
    return decodeToken;
};


module.exports = {
    JWTDecode,
    JWTToken,
};