const {Router} = require("express");
const User = require("../models/user");
const { log } = require("async");

const router = Router();

router.get("/signin",(req,res)=>{
    return res.render("signin");
})

router.get("/signup",(req,res)=>{
    return res.render("signup");
})

router.get("/logout",(req,res)=>{
    return res.clearCookie("token").redirect('/');
})

router.post("/signup",(req,res)=>{ 
    const {fullName,email,password} = req.body;
    User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/")
})

router.post("/signin",async (req,res)=>{
    const {email,password} = req.body;
    try{
        const token = await User.matchPasswordandGenerateToken(email,password);
        // console.log('Token : ' + token);
    
        return res.cookie("token",token).redirect("/")
    }catch(error){
        return res.render("signin",{
            error : "Incorrect email or password",
        })
    }
})

module.exports = router;