const {sendEmailWithAttachments} = require('../services/emailService');

const sendEmail = async (req, res) => {
    try {
        const { from, to, subject, body } = req.body;
        const attachments = req.files;

        await sendEmailWithAttachments({ from, to, subject, body, attachments });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error("Email send failed:", error);
        res.status(500).json({ message: 'Failed to send email' });
    }
};

module.exports = {sendEmail};