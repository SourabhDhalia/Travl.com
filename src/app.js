const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt =require("bcryptjs");

// var password = require("passport");
// var router = express.Router();
// var User =require("..models/user");
// var Campground = require("../models/campgrund");

require("./db/conn");
// require("./db/db");

const Register = require("./models/registers");
// const Contactu = require("./models/contactus");

// const Contactu = require("./models/contactus");
const {json} =require("express");
const { Mongoose } = require("mongoose");


const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
    res.render("index")
});
app.get("/log", (req, res) => {
    res.render("index1")
});

app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/Moneyconvertor", (req, res) => {
    res.render("Moneyconvertor");
});
app.get("/more", (req, res) => {
    res.render("more");
});
app.get("/morenext1", (req, res) => {
    res.render("morenext1")
});
app.get("/morenext2", (req, res) => {
    res.render("morenext2")
});
app.get("/morenext3", (req, res) => {
    res.render("morenext3")
});
app.get("/forgot", (req, res) => {
    res.render("user")
});




app.get("/amerFort", (req, res) => {
    res.render("amer")
});app.get("/elloraCaves", (req, res) => {
    res.render("ellora")
});app.get("/goldenTemple", (req, res) => {
    res.render("golden")
});app.get("/Hampi", (req, res) => {
    res.render("hampi")
});app.get("/humayunTomb", (req, res) => {
    res.render("Humayun")
});app.get("/khajuraho", (req, res) => {
    res.render("khajuraho")
});app.get("/padmanabhaswamyTemple", (req, res) => {
    res.render("pad temple")
});app.get("/nandaDevi", (req, res) => {
    res.render("nanda devi")
});app.get("/tajMahal", (req, res) => {
    res.render("taj1")
});app.get("/tsongmoLake", (req, res) => {
    res.render("tsongmoLake")
});
// create a new user in our data base
app.post("/register", async (req, res) => {

    try{
        const Password = req.body.Password;
        const cPassword = req.body.ConfirmPassword;
        if(Password === cPassword){
            const registerEmployee = new Register({

                            
                Name : req.body.Name,
                Email : req.body.Email,
                Password : Password,
                ConfirmPassword : cPassword
            })
// We have to hash  or incrypt before save
// this is consept of middleware-> working b/w two things
//see im register.js
            const  registered = await registerEmployee.save();
            // res.status(201).render("index");
            res.status(201).render("login");

        }else{
            res.send(" password!! not are matching");
           
        }
    } catch (error){
        res.status(400).send(error);
    }
});

//login check
app.post("/login", async (req, res) => {
   try{
    const email = req.body.email;
    const password = req.body.password;
   
   const useremail = await Register.findOne({Email:email});
   const isMatch = await bcrypt.compare(password, useremail.Password);
   
   //    res.send(useremail);
   //    console.log(useremail);
// if (useremail.Password===password)
 if(isMatch){
    // res.status(201).render("index");
    res.status(201).render("index1");

}else{
    res.send("Invalid Login Details");
}
   } catch(error){
    res.status(400).send("invalid!!!!!");
       
   }
});


// const employeeController = require('./controllers/employeeController');

// app.use('/employee',employeeController);

app.listen(port, ()=>{
    console.log(`server is running at port no ${port}`);
})



// //extra
// const port = process.env.MONGO_URL || "mongodb://localhost/kitten_db";
// Mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology: true})
// .then(async()=>{
//     await kittenDB.bootstrap();
//     await app.listen(port);
//     console.log(`Kitten API running on port${port}!`);

// })
// .catch(error => console.error(error));