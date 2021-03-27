const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const { passwordCheck } = require('../helper/user_helper');
const createHttpError = require('http-errors');

const UserSchema = new Schema({
    name: { type: String, required: true, trim: true, minlength: 3, maxlength: 50 },
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, trim: true, minlength: 6 },
    status: { type: Number, required: true, default: 1 },
    // userType: { type: Object, default: 1 },
}, { collection: 'users', timestamps: true });

const schema = Joi.object({
    name: Joi.string().min(3).max(50).trim(),
    username: Joi.string().min(3).max(50).trim(),
    email: Joi.string().trim().email(),
    password: Joi.string().trim().min(6),
    // userType: Joi.object(),
});

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    // delete user._id;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;
    delete user._id;
    delete user.password;
    return user;
};

UserSchema.statics.validation = (user) => {
    schema.required();
    return schema.validate(user);
};

UserSchema.statics.updateValidation = (user) => {
    return schema.validate(user);
};

UserSchema.statics.login = async (email, password) => {

    const { error } = schema.validate({ email: email, password: password })
    if (error) throw createHttpError(400, error);

    const user = await User.findOne({ email: email });
    if (!user) throw createHttpError(400, 'Email veya Şifre Yanlış');

    const result = await passwordCheck(password, user.password);
    if (result) throw createHttpError(400, 'Email veya Şifre Yanlış'); // buraya bakılacak. yanlıs olabilir.

    if (user.status != 1) throw createHttpError(403, 'Hesabınız Aktif Değil.');

    return user;
};


const User = mongoose.model('User', UserSchema);


module.exports = User;