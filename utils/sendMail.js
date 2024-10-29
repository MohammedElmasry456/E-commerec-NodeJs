const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Udemy E-Commerce👻" <www.almasrym66@gmail.com>',
    to: options.email,
    subject: options.subject,
    html: options.message,
  });
};

module.exports = sendMail;
