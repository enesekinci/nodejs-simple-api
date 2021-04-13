const config = require('dotenv').config().parsed
const createHttpError = require('http-errors')
const Validation = require('../helper/validation_helper')
const MembershipToken = require('../model/membership_token')
const { sendMail, getHtmlTemplate } = require('../helper/mail_helper')
const User = require('../model/user')
const { JwtHelper } = require('../helper/jwt_helper')
const { UserHelper } = require('../helper/user_helper')
const moment = require('moment')

class UserController {

    static generateMemberShipToken = async function (request, response) {

        const email = request.body.email
        const isEmail = Validation.emailVerify(email)
        if (!isEmail) throw createHttpError(400, "E-posta adresi geçerli değil.")

        const user = await User.findOne({ email: email })
        if (user) throw createHttpError(400, 'E-posta adresi kullanılıyor.')

        const member_token = await MembershipToken.findOneOrCreate({ email: email })
        const token = await JwtHelper.JWTToken({ email })
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

        if (!isVerify) {
            await MembershipToken.findOneAndDelete({ token: token })
            throw createHttpError(403, "Token Süresi Dolmuş!")
        }

        const memberShip = await MembershipToken.findOne({ email: isVerify.data.email })
        if (!memberShip) throw createHttpError(400, "E-posta adresi kayıt listesinde mevcut değil.")

        return response.status(200).send({
            status: true,
            statusCode: 200,
            data: { email: isVerify.data.email },
        })

    }

    static register = async function (request, response) {

        const { error, value } = User.validation({
            name: request.body.name,
            username: request.body.username,
            email: request.body.email,
            password: request.body.password
        })

        if (error) throw createHttpError(400, error.details[0].message)

        const hashedPassword = await UserHelper.passwordHash(value.password)
        value.password = hashedPassword

        const user = new User(value)
        await user.save()

        MembershipToken.findOneAndDelete({ email: user.email })

        response.status(200).send({
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
        })
    }

    static updateMe = async function (request, response) {
        delete request.body.createdAt
        delete request.body.updatedAt
        delete request.body._id

        const { error, value } = User.updateValidation({
            name: request.body.name,
            username: request.body.username, // kaldırılabilir özel bir yere koyulabilir.
            email: request.body.email, // kaldırılabilir özel bir yere koyulabilir.
            password: request.body.password,
        })

        if (error) throw createHttpError(400, error.details[0].message)

        if (request.body.hasOwnProperty('password')) {
            const hashedPassword = await UserHelper.passwordHash(value.password)
            value.password = hashedPassword
        } else {
            delete value.password
        }

        const id = request.user._id

        const user = await User.findByIdAndUpdate(id, value)

        response.send({
            status: true,
            statusCode: 200,
            user: user
        })
    }

    static forgotPassword = async function (request, response) {
        const user = await User.findOne({ email: request.body.email })
        if (!user) throw createHttpError(403, 'Kullanıcı Bulunamadı.')

        const token = await user.generateToken()

        sendMail(
            MAIL_FROM,
            request.body.email,
            'Parola Sıfırlama İşlemi',
            getHtmlTemplate('generateMembershipToken'),
            { name: user.name, token: token, mail_from: MAIL_FROM },
        )

        response.send({
            status: true,
            statusCode: 200,
        })
    }

    static newPassword = async function (request, response) {
        const isVerify = await JWTHelper.JWTDecode(request.body.token)
        if (!isVerify) throw createHttpError(403, "Token Süresi Dolmuş!")

        const user = await User.findOne({ email: isVerify.data.email })
        if (!user) throw createHttpError(403, 'Kullanıcı Bulunamadı.')

        const hashedPassword = await passwordHash(request.body.password)
        await user.update({
            password: hashedPassword,
        })

        const token = await user.generateToken()

        const userLoginLog = await UserLoginLog.findOrCreate({ userId: user._id })

        moment.locale()

        const nowDateTime = moment().format('YYYY-MM-DD HH:mm:ss')

        const logData = {
            log_at: nowDateTime,
            macAddress: request.macAddress,
            device: request.device,
        }

        userLoginLog.setLoginLogs(logData)
        userLoginLog.save()

        return response.status(200).json({
            status: true,
            statusCode: 200,
            data: { user: user, token: token },
            checkMacAdress: checkMacAdress,
        })

    }

}


module.exports = { UserController }