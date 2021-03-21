const nodemailer = require('nodemailer');
const config = require('dotenv').config().parsed
const ejs = require('ejs');

const smtpTransport = nodemailer.createTransport({
    service:'gmail',
    host: config.MAIL_HOST,
    port: config.MAIL_PORT,
    auth: {
        user: config.MAIL_USERNAME,
        pass: config.MAIL_PASSWORD
    }
});

const templates = {
    generateMembershipToken: "./email/templates/user/generate_membership.ejs",
    resetPassword: "./email/templates/user/reset_password.ejs",
};

const getHtmlTemplate = (templateName) => {
    return templates[templateName];
};

const sendMail = async (fromEmailAddress, toEmailAddress, emailSubject, htmlTemplate, templateData = {}) => {
    ejs.renderFile(htmlTemplate, templateData, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            smtpTransport.sendMail({
                from: fromEmailAddress,
                to: toEmailAddress,
                subject: emailSubject,
                html: data,
            }, (error, info) => {
                if (error) {
                    return console.log(error.message);
                } else {
                    return true;
                }
            });
        }
    });
};

module.exports = {
    sendMail,
    getHtmlTemplate,
};
