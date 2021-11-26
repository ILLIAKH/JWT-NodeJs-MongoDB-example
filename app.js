require("dotenv").config();
//calling the connect function from db, resulting in db connection
require("./config/database").connect();
//import user data model
const User = require("./model/user");
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//adding middleware for authentication of user
const auth = require("./middleware/auth");

const app = express();

app.use(express.json());

//api call protected by authentication by token
app.get("/test", auth, (req,res)=>{
    res.status(200).json("Test");
})

//User API calls -----------------------

//Registration
//get user input, validate it, validate if user alrady exists, Encryption of password, create a user, create a signe JWT token with expiery date
app.post("/register", async (req, res) => {
    try {
        // Get user input from request body
        const { first_name, last_name, email, password } = req.body;
    
        // basic validation checking for existence of input
        if (!(email && password && first_name && last_name)) {
          res.status(400).send("All input is required");
        }
    
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });
    
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
    
        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in our database
        const user = await User.create({
          first_name,
          last_name,
          email: email.toLowerCase(), // sanitize: convert email to lowercase
          password: encryptedPassword,
        });
    
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h", //expiery time of the token
          }
        );
        // save user token
        user.token = token;
    
        // return new user
        res.status(201).json(user);
      } catch (err) {
        console.log(err);
      }
});

// Login 
app.post("/login", async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;
    
        // Validate user input
        if (!(email && password)) {
          res.status(400).send("All input is required");
        }
        // get the user from database
        const user = await User.findOne({ email });
        //validate if user exists and if passwords match
        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h", //token expiery
            }
          );
    
          // save user token
          user.token = token;
    
          // user
          res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }
});

module.exports = app;