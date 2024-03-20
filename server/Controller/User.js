const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  BadRequest
} = require('../ErrorHandler/index.js')

const User  = require('../Models/User.js');

const sendmail = require('../services/Mail.js');

const Register = async(req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
     throw new BadRequest('Please provide all required');      
    }

    await sendmail('login',"are you this man",email)
    .catch(err=>{
      throw new BadRequest('Please provide a valid email')
    })
  
    User.findOne({ email })
      .then(async(user) => {
        if (user) return res.status(400).json({ msg: 'User already exists' });
        
        
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err,salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                jwt.sign(
                  { id: user.id },
                  process.env.JWT_SECRET,
                  { expiresIn: 3600 },
                  (err, token) => {
                    if (err) throw err;
                    res.json({
                      token,
                      user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                      }
                    });
                  }
                );
              });
          });
        });
      });
 
    
  }

const LoginUser =(req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
  
    User.findOne({ email })
      .then(user => {
        if (!user) return res.status(400).json({ msg: 'User does not exist' });
  
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
            jwt.sign(
              { id: user.id },
              process.env.JWT_SECRET,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                  }
                });
              }
            )
          })
      })
  }

const DeleteUser = (req, res) => {
    User.findById(req.params.id)
      .then(user => user.remove().then(() => res.json({ success: true })))
      .catch(err => res.status(404).json({ success: false }));
  }

const ChangePassword = (req, res) => {
    const { password } = req.body;
  
    if (!password) {
      return res.status(400).json({ msg: 'Please enter a password' });
    }
  
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        User.findByIdAndUpdate(req.params.id, { password: hash }, { new: true })
          .then(user => res.json({ success: true }))
          .catch(err => res.status(404).json({ success: false }));
      });
    });
  }

const ForgotPassword = (req, res) => {
    const { email } = req.body;
  
    // Simple validation
    if (!email) {
      return res.status(400).json({ msg: 'Please enter an email' });
    }
  
    // Check for existing user
    User.findOne({ email })
      .then(user => {
        if (!user) return res.status(400).json({ msg: 'User does not exist' });
  
        // Generate and set password reset token
        user.generatePasswordReset();
  
        // Save the updated user object
        user.save()
          .then(user => {
            // send email
            let link = "http://" + req.headers.host + "/api/users/reset/" + user.resetPasswordToken;
            const mailOptions = {
              to: user.email,
              from: process.env.FROM_EMAIL,
              subject: "Password change request",
              text: `Hi ${user.name} \n 
              Please click on the following link ${link} to reset your password. \n\n 
              If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };
  
            // setup email data with unicode symbols
            let transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true, // true for 465, false for other ports
              auth: {
                user: process.env.EMAIL_USER, // generated ethereal user
                pass: process.env.EMAIL_PASSWORD, // generated ethereal password
              },
            });
  
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
  
            res.status(200).json({message: 'A reset email has been sent to ' + user.email + '.'});
          })
          .catch(err => res.status(500).json({ message: err.message }));
      });
  }

module.exports = {
    Register,
    LoginUser,
    DeleteUser,
    ChangePassword,
    ForgotPassword
}