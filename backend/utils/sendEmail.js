const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log(process.env.SMPT_HOST,process.env.SMPT_PORT,process.env.SMTP_SERVICE,process.env.SMTP_MAIL,process.env.SMTP_PASSWORD)
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;