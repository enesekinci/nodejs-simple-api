const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

const passwordHash = async (password) => {
    return await bcrypt.hash(password, 10);
};

const passwordCheck = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};



module.exports = {
    passwordHash,
    passwordCheck,
};