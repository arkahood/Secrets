//jshint esversion:6
const express = require("express");
const app = express();
const ejs = require('ejs');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
/////////////hashing the password of the user/////////////////
var md5 = require('md5');
////////////////////using bcrypt and salting/////////////////
const bcrypt = require('bcrypt');
const saltRounds = 5;
////////////////////////////////////////////////////////////
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose  = require("passport-local-mongoose");







app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended :true
}));
/////////////////////////////////////
app.use(session({
    secret: "our little secret",
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());
///////////////////////////////////////  
mongoose.connect('mongodb://localhost:27017/UserDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    email :String,
    password : String
});
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User",userSchema);
passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/register",(req,res)=>{
    res.render("register");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/secrets",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
})
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

app.post("/register",(req,res)=>{
    User.register({username : req.body.username},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })
});
app.post("/login",(req,res)=>{
    const user = new User({
        username: req.body.username,
        password : req.body.password
    });
    req.login(user,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })
})


app.listen(3000,()=>{
    console.log("Server up and running at port 300.");
});