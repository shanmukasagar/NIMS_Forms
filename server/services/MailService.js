const transporter = require('../config/nodemailerTransport');
const path = require('path');
const fs = require('fs');

const sendMailService = async ({ from, to, subject, body, attachments }) => {
    let mailOptions;

    // 🧱 1. Prepare email content
    try {
        const htmlBody = `<p>${body.replace(/\n/g, '<br/>')}</p>`;
        const recipients = typeof to === 'string' ? to.split(',').map(email => email.trim()) : to;

        mailOptions = {
            from,
            to: recipients,
            subject,
            html: htmlBody,
            attachments: (attachments || []).map(file => ({
                filename: file.originalname,
                path: file.path,
            })),
        };
    } catch (err) {
        console.error('[MailService - Step 1: Preparing Mail]', err);
        throw new Error('Failed to prepare mail content');
    }

    // 🧱 2. Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('[MailService] Email sent successfully to:', mailOptions.to);
    } catch (err) {
        console.error('[MailService - Step 2: Sending Mail]', err);
        throw new Error('Failed to send email');
    }

    // 🧱 3. Cleanup uploaded files
    try {
        if (attachments?.length) {
            await Promise.all(
                attachments.map(file =>
                    fs.promises.unlink(file.path).catch(err =>
                        console.error('Failed to delete file:', file.path, err)
                    )
                )
            );
        }
    } catch (err) {
        console.error('[MailService - Step 3: File Cleanup]', err);
        // Don't rethrow — email already sent
    }
};

module.exports = { sendMailService };
