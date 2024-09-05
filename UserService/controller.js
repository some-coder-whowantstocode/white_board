const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  BadRequest,
  Unauthorized,
  UserNotFound
} = require('./ErrorHandler/index.js')

const User  = require('./model.js');

const sendmail = require('./services/Mail.js');
const { passwordchecker } = require('./Middleware/checkpassword.js');

const Register = async(req, res, next) => {
    const { name, email, password, persist } = req.body;
    //use bloom filter to check
    if (!name || !email || !password) {
    throw new BadRequest('Please provide all required');      
    }

    const user = await User.findOne({email});
        if (user){
      next(new BadRequest('User already exists'))
      return;
        } 
        

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password,salt);

      const date = new Date();
      const verifycodeexpiry = new Date(date.getHours() + 12);
      const verifycode = await hashpassword(Math.floor(100000 + Math.random() * 900000).toString()) ;

      const newUser = new User({
        name,
        email,
        password: hash,
        verifycode,
        verifycodeexpiry
      });

      await newUser.save();

      const token = await jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: 3600 });

    sendmail('register',"are you this man",email)


      res.cookie('token', token, {
        // secure: true, 
        httpOnly: true, 
        sameSite: "lax" ,
        expires:  persist ? new Date(Date.now() + 60 * 60 * 1000) : 0,
      })

      res.send({
        user: {
          name: user.name,
          email:user.email
        },
        msg:"successfully signed up."
      })
        
  }

const LoginUser =async(req, res, next) => {
    const { email, password, persist } = req.body;
    if (!email || !password) {
      throw new BadRequest( 'Please enter all fields' );
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      throw new UserNotFound( 'user does not exist.' );
    }
    const isMatch = await passwordchecker( password, user.password);
    if (!isMatch){
      throw new BadRequest( 'Invalid credentials' );
    } 
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 3600 });
    res.cookie('token', token, {
      // secure: true, 
      httpOnly: true, 
      sameSite: "lax" ,
      expires:  persist  ? new Date(Date.now() + 60 * 60 * 1000) : 0,
    })

    res.send({
      user: {
        name: user.name,
        email:user.email
      },
      msg:"successfully logged in."
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
      await User.deleteOne({email})
      res.json({ success: true })
    }else{
    throw new Unauthorized("invalid password");      
    }
      
 
  }

const ChangePassword = async(req, res, next) => {
    const { oldpassword, newpassword, email } = req.body;
  
    if (!oldpassword || !newpassword || !email) {
      throw new BadRequest('Please provide both old, new password and email.')
    }
    const { _id, password } = await User.findOne({email}).select('password');

      if(!password){
        throw new UserNotFound("No such email exists.")
      }
      const authentic = await passwordchecker(password, oldpassword)
      if(!authentic){
        throw new BadRequest("invalid password.");
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newpassword, salt);
      
      await User.findByIdAndUpdate(_id,{password:hash},{new:true});

      res.send({msg:'password updated'});

  }

const ForgotPassword = async(req, res) => {
    const { email } = req.body;
  
    if (!email) {
      throw new BadRequest("Please enter an email")
    }
  
    const user = await User.findOne({ email })
        if (!user) {
          throw new BadRequest("Email is not registerd.")
        };
  
  
      let link = "http://" + req.headers.host + "/api/users/reset/" + user.resetPasswordToken;
      await sendmail('forgotpassword',link,email)
      res.status(200).json({msg: 'A reset email has been sent to ' + user.email + '.'});
          
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
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    updateduser.password = hash;
  }

  const isverified = await jwt.verify(token,process.env.JWT_SECRET)
    if(!isverified){
      throw new Unauthorized("Invalid token.");
    }else{
      const user = await User.findByIdAndUpdate(data.id,{...updateduser},{new:true});
        res.send({msg:'user updated',name:user.name,email:user.email})
      
    }  
}

module.exports = {
    Register,
    LoginUser,
    DeleteUser,
    UpdateUser,
    ChangePassword,
    ForgotPassword
}