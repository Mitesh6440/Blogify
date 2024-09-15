const JWT = require('jsonwebtoken')

const secrete = "$uperman@123"

// it will create token for user object
function createTokenForUser(user){
    const payload = {
        _id : user._id,
        fullName : user.fullName,
        email : user.email,
        profileImageURL : user.profileImageURL,
        role : user.role,
    };
    const token = JWT.sign(payload,secrete);
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token,secrete);
    return payload;
}

module.exports = {createTokenForUser,validateToken};