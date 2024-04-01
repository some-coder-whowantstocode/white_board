const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host:process.env.MAIL_HOST,
    port: process.env.MAIL_PORT || 587,
    secure:false,
    auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS
    }
});

async function sendmail(sub,text,email) {
 const info = await transporter.sendMail({
    from: process.env.MAIL_FROM ,
    to: email,
    subject: sub,
    text: text,
  });
  console.log("Message sent: %s", info);
  
 
}

module.exports = sendmail;