const transporter = require('../config/nodemailerTransport');
const path = require('path');
const fs = require('fs');

const sendMailService = async ({ from, to, subject, body, attachments }) => {
    let mailOptions;

    // 🧱 1st try-catch: Preparing mail options
    try {
        const htmlBody = `<p>${body.replace(/\n/g, '<br/>')}</p>`;
        mailOptions = {
            from,
            to,
            subject,
            html: htmlBody,
            attachments: attachments?.map(file => ({
                filename: file.originalname,
                path: file.path
            }))
        };
    } catch (err) {
        console.error('[MailService - Step 1: Preparing Mail]', err);
        throw new Error('Failed to prepare mail content');
    }

    // 🧱 2nd try-catch: Sending mail
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('[MailService - Step 2: Sending Mail]', err);
        throw new Error('Failed to send email');
    }

    // 🧱 3rd try-catch: Cleaning up attachments
    try {
        attachments?.forEach(file => {
            fs.unlink(file.path, err => {
                if (err) console.error('Failed to delete file:', file.path);
            });
        });
    } catch (err) {
        console.error('[MailService - Step 3: File Cleanup]', err);
        // We don't throw here to avoid failing the request after sending mail
    }
};

module.exports = { sendMailService };
