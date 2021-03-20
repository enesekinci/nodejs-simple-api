const nodemailer = require('nodemailer');
const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD } = require('../App/Settings');
const ejs = require('ejs');

const smtpTransport = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
    }
});

const templates = {
    generateMembershipToken: "./Email/templates/user/GenerateMembershipToken.ejs",
    resetPassword: "./Email/templates/user/ResetPassword.ejs",
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
