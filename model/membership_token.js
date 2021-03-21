const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const MembershipSchema = new Schema({
    token: { type: String, trim: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },
}, { collection: 'membership_tokens', timestamps: true });

const schema = Joi.object({
    token: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2 }),
});

MembershipSchema.methods.toJSON = function () {
    const membership_token = this.toObject();
    delete membership_token._id;
    delete membership_token.createdAt;
    delete membership_token.updatedAt;
    delete membership_token.__v;
    return membership_token;
};

MembershipSchema.methods.validation = (membership_token) => {
    schema.required();
    return schema.validate(membership_token);
};


MembershipSchema.static.updateValidation = (membership_token) => {
    schema.required();
    return schema.validate(membership_token);
};

MembershipSchema.statics.findOneOrCreate = async function (data = {}) {
    return await MembershipToken.findOne(data) || new MembershipToken(data);
}

const MembershipToken = mongoose.model('membership_token', MembershipSchema);


module.exports = MembershipToken;