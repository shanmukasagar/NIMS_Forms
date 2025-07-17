const nodemailer = require('nodemailer');

const sendEmailWithAttachments = async ({ from, to, subject, body, attachments }) => {
    // Setup transporter (use your SMTP credentials)
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password'
        }
    });

    // Format attachments
    const formattedAttachments = attachments.map(file => ({
        filename: file.originalname,
        content: file.buffer
    }));

    const mailOptions = {
        from,
        to,
        subject,
        text: body,
        attachments: formattedAttachments
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {sendEmailWithAttachments};
