const User = require('../model/user')
const { UserSchema } = require('../schema/user_schema')
const UserLoginLog = require('../model/user_login_log')
const moment = require('moment')

class LoginController {

    static baseLogin = async function (request, response) {

        const { error, value } = UserSchema.schema.validate({
            email: request.body.email,
            password: request.body.password
        })

        if (error) throw createHttpError(400, error.details[0].message)

        const user = await User.login(value.email, value.password)

        const token = await user.generateToken()

        const userLoginLog = await UserLoginLog.findOrCreate({ userId: user._id })


        moment.locale()

        const nowDateTime = moment().format('YYYY-MM-DD HH:mm:ss')

        const logData = {
            log_at: nowDateTime,
            macAddress: request.macAddress,
            device: request.device,
        }

        // Burası patlayacak çünkü kullanıcının mac adresi kontrolünden sonra ekleniyor
        const checkMacAdress = userLoginLog.checkMacAdress(request.macAddress)
        // buraya bir kontrol koyarak mac fitresi dikkate alınacaktır.

        userLoginLog.setLoginLogs(logData)
        userLoginLog.save()

        return response.status(200).send({
            status: true,
            statusCode: 200,
            data: { user: user, token: token },
            checkMacAdress,
        })
    }
}

module.exports = { LoginController }