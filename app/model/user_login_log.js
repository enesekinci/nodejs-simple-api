const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { UserLoginLogSchemaSchema } = require('../schema/user_login_log_schema')

const UserLoginLogSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    logs: {
        type: Array,
    },
}, { collection: 'userloginlogs', timestamps: true })



UserLoginLogSchema.methods.toJSON = function () {
    const UserLoginLogSchema = this.toObject()
    // delete user._id
    // delete user.createdAt
    // delete user.updatedAt
    delete UserLoginLogSchema.__v

    return UserLoginLogSchema
}

UserLoginLogSchema.methods.validation = (userLoginLogs) => {
    return UserLoginLogSchemaSchema.schema.validate(userLoginLogs)
}

UserLoginLogSchema.methods.setLoginLogs = function (log = {}) {
    if (this.logs.length == 20) this.logs.shift()
    this.logs.push(log)
}

UserLoginLogSchema.methods.checkMacAdress = function (macAdress) {
    for (let i = 0; i < this.logs.length; i++)
        if (this.logs[i].macAdress == macAdress) return true
    return false
}

UserLoginLogSchema.statics.findOrCreate = async (data = {}) => {
    return await UserLoginLog.findOne(data) || new UserLoginLog(data)
}

const UserLoginLog = mongoose.model('UserLoginLog', UserLoginLogSchema)
module.exports = UserLoginLog