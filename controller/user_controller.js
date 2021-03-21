const createError = require('http-errors');
const Validation = require('../helper/validation_helper')

class UserController {

    static generateMemberShipTokken = async function (request, response) {
        const email = request.body.email
        const token = await response.jwtSign({
            asdasd: "sadasdsa",
        })
        console.log(response);
        response.send({
            token,
        })
        throw new createError(400, 'parametreler geçerli değil.');
        if (!Validation.emailVerify(email))
            response.send({
                'status': 400,
                'statusCode': 101,
                'message': 'email not verify',
            })
        response.send({
            message: 'successful!'
        })
    }
}


module.exports = { UserController }