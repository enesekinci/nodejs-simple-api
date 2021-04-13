const mongoose = require('mongoose');
const MongooseSchema = mongoose.Schema;
const Joi = require('joi');

const MembershipToken = new MongooseSchema({
    token: { type: String, trim: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },
}, { collection: 'membership_tokens', timestamps: true });

const schema = Joi.object({
    token: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2 }),
});

MembershipToken.methods.toJSON = function () {
    const membership_token = this.toObject();
    delete membership_token._id;
    delete membership_token.createdAt;
    delete membership_token.updatedAt;
    delete membership_token.__v;
    return membership_token;
};

MembershipToken.methods.validation = (membership_token) => {
    schema.required();
    return schema.validate(membership_token);
};


MembershipToken.static.updateValidation = (membership_token) => {
    schema.required();
    return schema.validate(membership_token);
};

MembershipToken.statics.findOneOrCreate = async function (data = {}) {
    return await this.findOne(data) || new this(data);
}

module.exports = mongoose.model('MembershipToken', MembershipToken);

