const bcrypt = require('bcryptjs')

module.exports.hashpassword =(pass)=>{
    return new Promise(async(resolve,reject)=>{
        bcrypt.genSalt(10, (err,salt) => {
            if (err){
            reject(err);
            }
            else{
                try {
                    bcrypt.hash(pass, salt, (err, hash) => {
                        if (err){
                            reject(err);
                            return;
                        };
                        resolve(hash);    
                        });
                } catch (error) {
                    reject(error)
                }
            }  
            });
    })
}