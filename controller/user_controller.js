const config = require('dotenv').config().parsed
const createHttpError = require('http-errors');
const Validation = require('../helper/validation_helper');
const MembershipToken = require('../model/membership_token');
const { sendMail, getHtmlTemplate } = require('../helper/mail_helper')
const User = require('../model/user')

class UserController {

    static generateMemberShipToken = async function (request, response) {

        const email = request.body.email

        if (!Validation.emailVerify(email))
            throw createHttpError(400, "E-posta adresi geçerli değil.")

        const user = await User.findOne({ email: request.body.email })

        if (user) throw createHttpError(400, 'E-posta adresi kullanılıyor.')

        const member_token = await MembershipToken.findOneOrCreate({ email: email })
        const token = await response.jwtSign({ email })
        member_token.token = token
        const result = await member_token.save();

        if (result) {
            sendMail(
                config.MAIL_FROM_ADDRESS,
                email,
                'Kullanıcı Kayıt Aktivasyon İşlemi',
                getHtmlTemplate('generateMembershipToken'),
                { name: '', token: token, mail_from: config.MAIL_FROM_ADDRESS }
            );
            return response.status(200).send({
                status: true,
                statusCode: 200,
                data: { token: token }
            });

        } else {
            throw createHttpError(500, "İşlem yapılamıyor.");
        }

    }
}


module.exports = { UserController }