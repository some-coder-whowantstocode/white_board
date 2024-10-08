const { BadRequest } = require("../ErrorHandler");
const nodemailer = require("nodemailer");

// sending mail with nodemailer and mailtrap

// const transporter = nodemailer.createTransport({
//   host: process.env.TRANSPORTER_HOST,
//   port: 587,
//   secure: false, 
//   auth: {
//     user: process.env.MAIL_AUTH_USER,
//     pass: process.env.MAIL_AUTH_PASS,
//   }
// });




// const sendmail= async( sub, text, email, htmlContent )=> {
//   try{
//     const mailOptions = {
//       from: process.env.DEV_MAIL,
//       to: email,
//       subject: sub,
//       text: text,
//       html: htmlContent
//     };

//   let res = await transporter.sendMail(mailOptions);
//   console.log(res)
//   }catch(err){
//     console.log(err);
//   }
 
// }


let transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.SERVER_MAIL,
    pass: process.env.SERVER_MAIL_PASS,
  }
});


const sendmail =async(sub, text, email, htmlContent)=>{


  let mailOptions = {
    from:  process.env.SERVER_MAIL,
    to: email,
    subject: sub,
    html:htmlContent
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);
  });
  
}


module.exports = sendmail;