require('dotenv').config();

const express = require('express');
const path = require('path');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL)
    .then(e => console.log("MongoDB Connected"))
    .catch(err => console.error("Failed to connect to MongoDB", err));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));


// Middleware for parse form data
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());                       
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
 
app.get('/',async (req,res)=>{
    const allBlog = await Blog.find({});
    return res.render("home",{
        user : req.user,
        blogs : allBlog,
    })
})
 
app.use("/user",userRoute); 
app.use("/blog",blogRoute); 

app.listen(PORT,()=> console.log(`Server Started at PORT : ${PORT}`));
 