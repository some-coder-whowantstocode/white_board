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


const generateOtp = async()=>{

}

const verifyUser = async(req,res,next)=>{
  const {otp, email} = req.body;
  if(!otp || !email){
    throw new BadRequest('Please provide all required value');      
  }

  const user = await User.findOne({email});
  if(!user){
    throw new BadRequest("invalid credentials");
  }

  const currentdate = new Date();
  if(user.verifycodeexpiry >= currentdate){
    throw new BadRequest("code expired please try again.");
  }

  if(otp !== user.verifycode){
    throw new BadRequest("invalid code");
  }

  await User.findByIdAndUpdate(user._id,{isverified:true});

    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 3600 });
      
      res.cookie('token', token, {
        // secure: true, 
        httpOnly: true, 
        sameSite: "lax" ,
      })

      res.send({
        user: {
          verified:true,
          name:user.name,
          email:user.email
        },
        msg:"successfully signed up."
      })
}

const Register = async(req, res, next) => {
  console.log(req.body)
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
      
      const verifycodeexpiry = date.setHours(date.getHours() + 12);
      let arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      const randomNumber = arr[0] / (0xFFFFFFFF + 1);
      const verifycode =  Math.floor(randomNumber * (999999 - 100000 + 1)) + 100000;
      const resetpasswordToken = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: 3600 });
      const resettokenexpiry = date.setHours(date.getHours() + 12);
    
      // const verifycode = await bcrypt.hash(Math.floor(100000 + crypto.getRandomValues(1) * 900000).toString(), salt) ;
      const newUser = new User({
        name,
        email,
        password: hash,
        verifycode,
        verifycodeexpiry,
        resetpasswordToken,
        resettokenexpiry
      });

      await newUser.save();
      
      
      sendmail(
        'WhiteBoard user verificaiton',
        `For user login otp:${verifycode} please go to this link - ${process.env.CLIENT}/verify/${email}`,
        email,
        `
        <div>Here is your otp:${verifycode}<div/>
        <a href="${process.env.CLIENT}/verify"> verify <a/>`
      )

      res.send({
        user: {
          verified:false
        },
        msg:"successfully signed up an email is sent to you account please verify."
      })
        
  }

const LoginUser =async(req, res, next) => {
  console.log(req.body)
    const { email, password, persist } = req.body;
    if (!email || !password) {
      throw new BadRequest( 'Please enter all fields' );
    }
  console.log(email, password, persist);
    const user = await User.findOne({ email });
    if (!user) {
      throw new UserNotFound( 'user does not exist.' );
    }
  console.log(user);

    const isMatch = await passwordchecker( password, user.password);
    if (!isMatch){
      throw new BadRequest( 'Invalid credentials' );
    } 

  

    if(!user.isverified){
      let verifycodeexpiry = user.verifycodeexpiry;
      let verifycode = user.verifycode;
      const currentdate = new Date();
      if(currentdate >= verifycodeexpiry){
        verifycodeexpiry.setHours(currentdate.getHours() + 12);
        let arr = new Uint32Array(1);
        crypto.getRandomValues(arr);
        const randomNumber = arr[0] / (0xFFFFFFFF + 1);
        verifycode =  Math.floor(randomNumber * (999999 - 100000 + 1)) + 100000;
        await User.findByIdAndUpdate(user._id,{verifycodeexpiry,verifycode})
      }

      sendmail(
        'WhiteBoard user verificaiton',
        `For user login otp:${verifycode} please go to this link - ${process.env.CLIENT}/verify`,
        email,
        `
        <div>Here is your otp:${verifycode}<div/>
        <a href="${process.env.CLIENT}/verify/${email}"> verify <a/>`
      )

      res.send({
        user: {
          verified:false
        },
        msg:"Please verify user from gmail."
      })

    }

    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 3600 });
      
    res.cookie('token', token, {
      // secure: true, 
      httpOnly: true, 
      sameSite: "lax" ,
      expires:  persist ? new Date(Date.now() + 60 * 60 * 1000) : 0,
    })

    res.send({
      user: {
        verified:true,
        name:user.name,
        email:user.email
      },
      msg:"successfully signed up."
    })
}

const DeleteUser = async(req, res,next) => {
    const {pass} = req.body;

    const {token} = req.cookies;
    if(!token){
      throw new Unauthorized("unauthorized access"); 
    }
  
    const data = await jwt.verify(token,process.env.JWT_SECRET)
    if(!data.id){
      throw new Unauthorized('Invalid token');
    }

    if( !pass){
      throw new BadRequest('please provide password.')
    }
    const user = await User.findById(data.id);

    if(!user.password){
      throw new UserNotFound('This email does not have an account.')
    }

    const authentic = await passwordchecker(pass,user.password);
    if(authentic){
      await User.deleteOne({email:user.email})
      res.json({ success: true })
    }else{
    throw new BadRequest("invalid password");      
    }
      
 
  }

const ChangePassword = async(req, res, next) => {
    const { password} = req.body;

    const {token} = req.params;

    if ( !password ) {
      throw new BadRequest('Please provide the password.')
    }

    const data = await jwt.verify(token,process.env.JWT_SECRET);
    if(!data.email){
      throw new Unauthorized('Invalid token');
    }


    const user = await User.findOne({email:data.email});
    if(!user){
      throw new UserNotFound("User does not exist")
    }

    if(token !== user.resetpasswordToken){
      throw new BadRequest('Please provide a valid token');
    }
    let newdate = new Date();
    if(newdate >= user.resettokenexpiry) {
      throw new BadRequest("Token expired please try again");
    }
    
    
  
   
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await User.findOneAndUpdate({email:data.email},{password:hash},{new:true});



      res.send({msg:'password updated'});

  }

const ForgotPassword = async(req, res) => {
    const { email } = req.body;
    if (!email ) {
      throw new BadRequest("Please provide an email")
    }

    const resetpasswordToken = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: 3600 });
    let date = new Date();
    const resettokenexpiry = date.setHours(date.getHours() + 12);
    const user = await User.findOneAndUpdate({email},{resetpasswordToken,resettokenexpiry},{new:true});

        if (!user) {
          throw new BadRequest("Email is not registerd.")
        };

        console.log(user.resetpasswordToken)
  
      let link = process.env.CLIENT +"/resetpass/"+ user.resetpasswordToken;
      sendmail('forgotpassword',
        `For changing password please go to this link - ${link}`,
        email,
        `
        <div>Visit the link to change your password.<div/>
        <a href="${link}"> change password <a/>`)
      
      res.status(200).json({msg: 'A reset email has been sent to your email.'});
          
  }

const UpdateUser =async(req, res, next)=>{
  const {name, email, password} = req.body;
  const {token} = req.cookies;
  if(!token){
    throw new Unauthorized("unauthorized access"); 
  }

  const data = await jwt.verify(token,process.env.JWT_SECRET)
  if(!data.id){
    throw new Unauthorized('Invalid token');
  }
    
  const updateduser = {
    name, email, password
  }

  if(password){
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    updateduser.password = hash;
  }

 
    const user = await User.findByIdAndUpdate(data.id,{...updateduser},{new:true});
      res.send({msg:'user updated',name:user.name,email:user.email})
    

}

module.exports = {
    Register,
    LoginUser,
    DeleteUser,
    UpdateUser,
    ChangePassword,
    ForgotPassword,
    verifyUser,
    generateOtp
}