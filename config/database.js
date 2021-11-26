//create connection to database
const mongoose = require("mongoose");

const {MONGO_URI} = process.env;

exports.connect = () => {
    mongoose.connect(MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=>{
        console.log("Connected to DB successfuly...");
    })
    .catch((error)=>{
        console.log("Error - connection to DB failed: ", error);
    })
}