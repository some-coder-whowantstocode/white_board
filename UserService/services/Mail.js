const nodemailer = require("nodemailer");
const { BadRequest } = require("../ErrorHandler");

// const transporter = nodemailer.createTransport({
//     service: process.env.MAIL_SERVICE,
//     // host:process.env.MAIL_HOST,
//     // port: process.env.MAIL_PORT || 587,
//     // secure:false,
//     auth: {
//         type:'OAuth2',
//         user: process.env.MAIL_AUTH_USER,
//         pass: process.env.MAIL_AUTH_PASS,
//         clientId: process.env.OAUTH_CLIENTID,
//         clientSecret: process.env.OAUTH_CLIENT_SECRET,
//         refreshToken: process.env.OAUTH_REFRESH_TOKEN
//     }
// });

const transporter = nodemailer.createTransport({
  host: process.env.TRANSPORTER_HOST,
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL_AUTH_USER,
    pass: process.env.MAIL_AUTH_PASS,
  }
});




const sendmail= async( sub, text, email, htmlContent )=> {
  try{
    const mailOptions = {
      from: process.env.DEV_MAIL,
      to: email,
      subject: sub,
      text: text,
      html: htmlContent
    };

  let res = await transporter.sendMail(mailOptions);
  console.log(res)
  }catch(err){
    console.log(err);
  }
 
}

module.exports = sendmail;