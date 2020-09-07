//jshint esversion:6
const express = require("express");
const app = express();
const ejs = require('ejs');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended :true
}));
mongoose.connect('mongodb://localhost:27017/UserDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = {
    email :String,
    password : String
};
const User = new mongoose.model("User",userSchema);


app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/register",(req,res)=>{
    res.render("register");
});
app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/register",(req,res)=>{
    const newUser = new User( {
        email :req.body.username,
        password :req.body.password
    });
    newUser.save((err)=>{
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });

});
app.post("/login",(req,res)=>{
    User.findOne({email:req.body.username},(err,user)=>{
        if(err){
            console.log("You are not a user");
        }else{
            if(user){
                if(user.password === req.body.password){
                    res.render("secrets");
                }else{
                    res.send("<h1>WRONG PASSWORD</h1>");
                }
            }
            
        }
    })
})


app.listen(3000,()=>{
    console.log("Server up and running at port 300.");
});