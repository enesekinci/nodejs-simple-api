const config = require('dotenv').config().parsed
const createHttpError = require('http-errors');
const Validation = require('../helper/validation_helper');
const MembershipToken = require('../model/membership_token');
const { sendMail, getHtmlTemplate } = require('../helper/mail_helper')
const User = require('../model/user');
const { JWTHelper } = require('../helper/jwt_helper');

class UserController {

    static generateMemberShipToken = async function (request, response) {

        const isEmail = Validation.emailVerify(request.body.email)

        if (!isEmail) throw createHttpError(400, "E-posta adresi geçerli değil.")

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

    static checkMembershipToken = async function (request, response) {
        const token = request.body.token;
        const verify = await JwtHelper.JWTDecode(token)
        request.log.debug("verify => " + verify)

        request.log.debug(token)
        return response.send()
        if (token) {

            const user = await MembershipApplication.findOne({ token: request.body.token });

            if (user) {

                // dogru oldugu için kullanıcı artık oluşturulmuş olmalı -- olamaz required alanlar var.

                return response.status(200).json({
                    statusCode: 200,
                    data: { email: user.email },
                });

            } else {
                throw createHttpError(400, "E-posta adresi kayıt listesinde mevcut değil.");
            }
        } else {

            await User.findOneAndDelete({
                token: request.body.token,
            });

            throw createHttpError(403, "Token Süresi Dolmuş!");
        }

    };
}


module.exports = { UserController }