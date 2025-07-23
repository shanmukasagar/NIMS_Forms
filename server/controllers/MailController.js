const { sendMailService } = require("../services/MailService");

const sendMail = async (req, res) => {
    try {
        const { from, to, subject, body } = req.body;
        const attachments = req.files || [];

        await sendMailService({ from, to, subject, body, attachments });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send email' });
    }
};

module.exports = { sendMail };
