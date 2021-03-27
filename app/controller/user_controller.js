const config = require('dotenv').config().parsed
const createHttpError = require('http-errors')
const Validation = require('../helper/validation_helper')
const MembershipToken = require('../model/membership_token')
const { sendMail, getHtmlTemplate } = require('../helper/mail_helper')
const User = require('../model/user')
const { JwtHelper } = require('../helper/jwt_helper')
const { UserHelper } = require('../helper/user_helper')

class UserController {

    static generateMemberShipToken = async function (request, response) {

        const email = request.body.email
        const isEmail = Validation.emailVerify(email)
        if (!isEmail) throw createHttpError(400, "E-posta adresi geçerli değil.")

        const user = await User.findOne({ email: email })
        if (user) throw createHttpError(400, 'E-posta adresi kullanılıyor.')

        const member_token = await MembershipToken.findOneOrCreate({ email: email })
        const token = await response.jwtSign({ email })
        member_token.token = token
        const result = await member_token.save()

        if (result) {
            sendMail(config.MAIL_FROM_ADDRESS, email,
                'Kullanıcı Kayıt Aktivasyon İşlemi',
                getHtmlTemplate('generateMembershipToken'),
                { name: '', token: token, mail_from: config.MAIL_FROM_ADDRESS },
            )
            return response.status(200).send({
                status: true,
                statusCode: 200,
                data: { token: token }
            })
        }

        throw createHttpError(500, "İşlem yapılamıyor.")
    }

    static checkMembershipToken = async function (request, response) {
        const token = request.body.token
        const isVerify = await JwtHelper.JWTDecode(token)

        if (isVerify) {
            const memberShip = await MembershipApplication.findOne({ token: request.body.token })
            if (memberShip)
                return response.status(200).send({
                    statusCode: 200,
                    data: { email: user.email, token },
                })
            throw createHttpError(400, "E-posta adresi kayıt listesinde mevcut değil.")
        } else {
            await User.findOneAndDelete({ token: request.body.token })
            throw createHttpError(403, "Token Süresi Dolmuş!")
        }

    }

    static register = async function (request, response) {

        const { error, value } = User.validation({
            name: request.body.name,
            username: request.body.username,
            email: request.body.email,
            password: request.body.password
        })

        if (error)
            throw createHttpError(400, error.details[0].message)

        value.password = await UserHelper.passwordHash(value.password)

        const user = new User(value)
        await user.save()

        return response.status(200).send({
            status: true,
            statusCode: 200,
            data: { user },
        })

    }

    static getMe = async function (request, response) {
        return response.status(200).send({
            status: true,
            statusCode: 200,
            data: { user: request.user },
        });
    };

}


module.exports = { UserController }