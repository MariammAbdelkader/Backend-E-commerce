const { HASH_SALT_ROUNDS } = require("../config");
const bcrypt = require("bcrypt");

const createHash = async (password) => {
    try{
    const salt = await bcrypt.genSalt(parseInt(HASH_SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password , salt);
    return hashedPassword
}
    catch(err){
        throw Error('cannot hash the password');
    }
}

module.exports = createHash