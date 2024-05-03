const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://bava:bava123@cluster0.crz8n3g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
              .then(() => {
                console.log('Connected to MongoDB');
              })
              .catch(err => {
                console.error('Error connecting to MongoDB: ' + err.message);
              });

const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    }
});



module.exports = mongoose.model("AuthCollections",schema);