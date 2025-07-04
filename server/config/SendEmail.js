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

const sendProjectSubmissionMail = async ({ toEmail, fromEmail }) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "shanmukasagar2019@gmail.com",
        pass: 'yifn dqib iraq tcmm', // Use app password if 2FA is enabled
      },
    });

    // Email content
    const mailOptions = {
        from: fromEmail,
        to: toEmail,
        subject: 'Project Submission Confirmation',
        text: `Dear Principal Investigator,

        Your project has been successfully submitted.`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};


module.exports = {sendEmail, sendProjectSubmissionMail};
