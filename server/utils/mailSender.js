const nodemailer = require("nodemailer");

const mailSender = async (email, title, body, textBody = "") => {
  try {
    let transpoter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: true,
    });

    let info = await transpoter.sendMail({
      from: "StudyNotion || Nikhil Rathod",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
      text: textBody || undefined,
    });

    return info;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = mailSender;
