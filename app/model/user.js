const config = require('dotenv').config().parsed
const mongoose = require('mongoose')
const MongooseSchema = mongoose.Schema
const { UserHelper } = require('../helper/user_helper')
const createHttpError = require('http-errors')
const { UserSchema } = require('../schema/user_schema')
const { JwtHelper } = require('../helper/jwt_helper')

const User = new MongooseSchema({
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, trim: true, minlength: 6 },
    status: { type: Number, required: true, default: 1 },
    // userType: { type: Object, default: 1 },
}, { collection: 'users', timestamps: true })

User.methods.toJSON = function () {
    const user = this.toObject()
    delete user.createdAt
    delete user.updatedAt
    delete user.__v
    delete user._id
    delete user.password
    return user
}

User.statics.validation = (user) => {
    return UserSchema.requiredSchema.validate(user)
}

User.statics.updateValidation = (user) => {
    return UserSchema.schema.validate(user)
}

User.statics.login = async function (email, password) {

    const { error, value } = this.updateValidation({ email: email, password: password })
    if (error) throw createHttpError(400, error)


    const user = await this.findOne({ email: value.email })
    if (!user) throw createHttpError(400, 'Email veya Şifre Yanlış')
    const isCheck = await UserHelper.passwordCheck(value.password, user.password)
    if (!isCheck) throw createHttpError(400, 'Email veya Şifre Yanlış') // buraya bakılacak. yanlıs olabilir.

    if (user.status == 0) throw createHttpError(403, 'Hesabınız Aktif Değil.')

    return user
}

User.methods.generateToken = async function () {
    const user = this.toObject()
    const token = await JwtHelper.JWTToken({
        name: user.name,
        userName: user.userName,
        email: user.email,
    }, config.AUTHTIME)
    return token
};


module.exports = mongoose.model('User', User)