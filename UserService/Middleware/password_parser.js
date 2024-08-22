const bcrypt = require('bcryptjs');

const p_parser =(req,res,next)=>{
    const {password} = req.body;
    bcrypt.genSalt(10, (err,salt) => {
      if (err) throw err;
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          req.body.password = hash;
        //   newUser.save()
        //     .then(user => {
        //       jwt.sign(
        //         { id: user.id },
        //         process.env.JWT_SECRET,
        //         { expiresIn: 3600 },
        //         (err, token) => {
        //           if (err) throw err;
        //           res.json({
        //             token,
        //             user: {
        //               id: user.id,
        //               name: user.name,
        //               email: user.email
        //             }
        //           });
        //         }
        //       );
        //     });
        });
      });

    next();
}

module.exports = p_parser