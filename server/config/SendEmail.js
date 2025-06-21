// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (fromEmail, toEmail, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
        service: "gmail", // or your email service
        auth: {
            user: "shanmukasagar2019@gmail.com",      // your app email
            pass: "yifn dqib iraq tcmm"     // your app password or app password (not your personal email password!)
        },
        });

        const mailOptions = {
        from: `"Principal Investigator" <${fromEmail}>`,
        to: toEmail,
        subject: subject,
        html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${toEmail}`);
    } catch (error) {
        console.error(`❌ Failed to send email to ${toEmail}`, error);
    }
};

module.exports = sendEmail;
