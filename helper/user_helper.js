const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { SECRETKEY, membershipApplicationPeriod, MEMBERSHIPAPPLICATIONPERIOD } = require('../App/GlobalConstant');
const JWTHelper = require('./jwt_helper');

const passwordHash = async (password) => {
    return await bcrypt.hash(password, 10);
};

const passwordCheck = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const generateMembershipToken = async (email) => {
    return await JWTHelper.JWTToken(email, MEMBERSHIPAPPLICATIONPERIOD);
};

module.exports = {
    passwordHash,
    passwordCheck,
    generateMembershipToken,
};