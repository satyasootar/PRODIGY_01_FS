const mongoose = require("mongoose")
const connnect = mongoose.connect('mongodb+srv://satyasootar:admin1234@cluster02.gijuf.mongodb.net/user')
connnect.then(()=>{
    console.log("Database connected Successfully")
})
.catch(()=>{
    console.log("Unable to connect to DataBase");
})


const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
})


const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;