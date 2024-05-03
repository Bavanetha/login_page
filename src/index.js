const express = require("express");
const app = express();
const path = require("path");
const collection = require("./mongo");
const jwt = require("jsonwebtoken");
const cookies = require("cookie-parser");
const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(cookies());
app.use(express.urlencoded({extended:false}));

const tempelatePath = path.join(__dirname,"../tempelates");
const publicPath = path.join(__dirname,"../public");

app.set('view engine','hbs');
app.set("views",tempelatePath);
app.use(express.static(publicPath));

const hashValidator = async(plainPassword,hashedPassword)=>{
    try{
        const result = await  bcrypt.compare(plainPassword,hashedPassword);
        return result;
    }
    catch(error){
        return false;
    }
    
}


app.get("/",(req,res)=>{
    res.render("login");
})

app.get("/signup",(req,res)=>{
    res.render("signup");
})


app.post("/signup",async (req,res)=>{
    try{
        const check = await collection.findOne({name:req.body.name});

        if(check){
            res.send("user already exist");
        }
        else{
            const  hashedPassword = await bcrypt.hash(req.body.password, 10);
            const token = jwt.sign({name:req.body.name},"igefiurg99h9uwerhfurgurhuherughuwhghriuhgrihgiurhbdigidrgidrhgierhgigbrhg");
            const data = {
                name:req.body.name,
                password:hashedPassword,
                token:token
            };

            await collection.insertMany([data]);
            res.render("home",{name:req.body.name});
        }
    }

    catch(err){
        res.send("wrong details");
        return res.status(500).send("Internal Server Error");
    }
   
});



app.post("/login",async (req,res)=>{

    try{
        const existingUser = await collection.findOne({name:req.body.name});
        const checkUser = await hashValidator(req.body.password,existingUser.password);
            if(existingUser && checkUser){
                res.render("home",{name:req.body.name});
             
            }
            else{
                res.send("Invalid");
            }
        }
    
    catch(error){
        res.send(error);
    }
    
});


app.listen(3000,()=>{
    console.log("server connected");
})