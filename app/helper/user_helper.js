const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');

class UserHelper {
    static async passwordHash(password) {
        return await bcrypt.hash(password, 10);
    }

    static async passwordCheck(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}



module.exports = { UserHelper }