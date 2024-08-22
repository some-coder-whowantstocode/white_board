const bcrypt = require("bcryptjs/dist/bcrypt");

const passwordchecker =async( givenpassword, actualpassword )=>{
        let authentic = await bcrypt.compare( givenpassword, actualpassword )
        return authentic;
}

module.exports = {
    passwordchecker
}