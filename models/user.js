const { createHmac , randomBytes} = require('node:crypto');
const {Schema , model} = require('mongoose');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName : {
        type : String,
        requird : true,
    },
    email : {
        type : String,
        requird : true,
        unique : true,
    },
    salt : {
        type : String,
    },
    password : {
        type : String,
        requird : true,
    },
    profileImageURL : {
        type : String,
        default : '/images/default.png',
    },
    role : {
        type : String,
        enum : ["USER","ADMIN"],
        default : "USER",
    }
},{timestamps : true})

// when database save any user then it will hash it's password
userSchema.pre('save', function(next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashpassword = createHmac("sha256",salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashpassword;
    next();
})

// we can crete function in schema using static
userSchema.static('matchPasswordandGenerateToken',async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found");
    console.log(user);
    
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac("sha256",salt).update(password).digest("hex");
    
    if(hashedPassword !== userProvidedHash) throw new Error("Incorrect Password");

    const token = createTokenForUser(user);
    return token;
})

const User = model('user',userSchema);

module.exports = User; 