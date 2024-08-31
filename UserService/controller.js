const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongoose').mongo


const {
  BadRequest,
  Unauthorized,
  CustomErr,
  UserNotFound
} = require('./ErrorHandler/index.js')

const User  = require('./model.js');

const sendmail = require('./services/Mail.js');
const { passwordchecker } = require('./Middleware/checkpassword.js');
const { hashpassword } = require('./services/hashpassword.js');

const Register = async(req, res, next) => {
    const { name, email, password } = req.body;
    //use bloom filter to check
    if (!name || !email || !password) {
    throw new BadRequest('Please provide all required');      
    }

  
    User.findOne({ email })
      .then(async(user) => {
        if (user){
      next(new BadRequest('User already exists'))
      return;
        } 
        
    await sendmail('register',"are you this man",email)
    .then(()=>{
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
                  res.cookie('token', token, {
                    // secure: true, 
                    httpOnly: true, 
                    sameSite: "lax" ,
                    expires: persist ? new Date(Date.now() + 60 * 60 * 1000) : 0,
                  })
  
                  res.send({
                    user: {
                      name: user.name,
                      email:user.email
                    },
                    msg:"successfully signed up."
                  })
                }
              );
            });
        });
      });
    })
    
    .catch(err=>{
      next(new BadRequest('Please provide a valid email'))
    })
        
    
      });
 
    
  }

const LoginUser =(req, res, next) => {
    const { email, password, persist } = req.body;
  
    if (!email || !password) {
      throw new BadRequest( 'Please enter all fields' );
    }
  
    User.findOne({ email })
      .then(user => {
        if (!user) {
          next(new UserNotFound( 'user does not exist.' ))
          return;
        }
        passwordchecker( password, user.password)
          .then(isMatch => {
            if (!isMatch){
              next(new BadRequest( 'Invalid credentials' ));
              return;
            } 
  
            jwt.sign(
              { id: user.id },
              process.env.JWT_SECRET,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) next(err);
                console.log(token)

                res.cookie('token', token, {
                  // secure: true, 
                  httpOnly: true, 
                  sameSite: "lax" ,
                  expires: persist ? new Date(Date.now() + 60 * 60 * 1000) : 0,
                })

                res.send({
                  user: {
                    name: user.name,
                    email:user.email
                  },
                  msg:"successfully logged in."
                })
              }
            )
          })

          .catch((err)=>{
            err.message = "something went wrong with server."
            next(err);
          })
      })
  }

const DeleteUser = async(req, res,next) => {
    const {email, pass} = req.body;
    if(!email || !pass){
      throw new BadRequest('please provide all values.')
    }
    const password = await User.findOne({email}).select('password');

    if(!password){
      throw new UserNotFound('This email does not have an account.')
    }

    const authentic = await passwordchecker(pass,password.password);
    if(authentic){
          User.deleteOne({email})
          .then(() => {
            res.json({ success: true })
          })
          .catch(err =>{
            return next(err);
            });
    }else{
    throw new Unauthorized("invalid password");      
    }
      
 
  }

const ChangePassword = async(req, res, next) => {
    const { oldpassword, newpassword, email } = req.body;
  
    if (!oldpassword || !newpassword || !email) {
      throw new BadRequest('Please provide both old, new password and email.')
    }
    User.findOne({email}).select('password')
    .then(async({_id, password})=>{

      if(!password){
        throw new UserNotFound("No such email exists.")
      }
      const authentic = await passwordchecker(password, oldpassword)
      if(!authentic){
        next( new BadRequest("invalid password."))
        return;
      }

      bcrypt.genSalt(10, (err,salt) => {
        if (err){
          next(err);
          return;
        };
          bcrypt.hash(newpassword, salt, (err, hash) => {
            if (err){
              next(err);
              return;
            };

              User.findByIdAndUpdate(_id,{password:hash},{new:true})
              .then(()=>{
                res.send({msg:'password updated'})
              })
              .catch((err)=>next(err));

          });
        });
      
    })

    .catch((err)=>{
      next(err);
    })


  }

const ForgotPassword = async(req, res) => {
    const { email } = req.body;
  
    if (!email) {
      throw new BadRequest("Please enter an email")
    }
  
    User.findOne({ email })
      .then(user => {
        if (!user) {
          throw new BadRequest("Email is not registerd.")
        };
  
  
            let link = "http://" + req.headers.host + "/api/users/reset/" + user.resetPasswordToken;
      sendmail('forgotpassword',link,email)
      .then(()=>{
        res.status(200).json({msg: 'A reset email has been sent to ' + user.email + '.'});
        
      })
      .catch(err => next(err));

            // const mailOptions = {
            //   to: user.email,
            //   from: process.env.FROM_EMAIL,
            //   subject: "Password change request",
            //   text: `Hi ${user.name} \n 
            //   Please click on the following link ${link} to reset your password. \n\n 
            //   If you did not request this, please ignore this email and your password will remain unchanged.\n`
            // };
  
            // let transporter = nodemailer.createTransport({
            //   host: 'smtp.gmail.com',
            //   port: 465,
            //   secure: true,
            //   auth: {
            //     user: process.env.EMAIL_USER,
            //     pass: process.env.EMAIL_PASSWORD,
            //   },
            // });
  
            // transporter.sendMail(mailOptions, (error, info) => {
            //   if (error) {
            //     console.log(error);
            //   } else {
            //     console.log('Email sent: ' + info.response);
            //   }
            // });
  
      });
  }

const UpdateUser =async(req, res, next)=>{
  const {name, email, password} = req.body;
  const {token} = req.cookies;
  if(!token){
    throw new Unauthorized("Token expired."); 
  }

  const updateduser = {
    name, email, password
  }

  if(password){
    updateduser.password = await hashpassword(password);
  }

  jwt.verify(token,process.env.JWT_SECRET,(err,data)=>{
    if(err){
      next(new Unauthorized("Invalid token."));
    }else{

      User.findByIdAndUpdate(data.id,{...updateduser},{new:true})
      .then((data)=>{
        res.send({msg:'user updated',name:data.name,email:data.email})
      })
      .catch((err)=>{
        next(err)
        return;
      });
    }
  })

  
  
}

module.exports = {
    Register,
    LoginUser,
    DeleteUser,
    UpdateUser,
    ChangePassword,
    ForgotPassword
}