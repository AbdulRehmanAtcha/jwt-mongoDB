import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import {
    stringToHash,
    varifyHash,
} from "bcrypt-inzi";

const SECRET = process.env.SECRET || "topsecret";
const app = express();
const port = process.env.PORT || 5001;
const MongoDBURI = process.env.MongoDBURI || "mongodb+srv://abdul:abdulpassword@cluster0.zcczzqa.mongodb.net/test?retryWrites=true&w=majority";


app.use(cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3000/signup",
      "http://localhost:3000/login",
      "https://spring-bud-pike-coat.cyclic.app",
      "https://spring-bud-pike-coat.cyclic.app/signup",
      "https://spring-bud-pike-coat.cyclic.app/login",
      "*",
    ],
    credentials: true,
  }));

app.use(express.json());
app.use(cookieParser());

const userSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },

    createdOn: { type: Date, default: Date.now },
});
const userModel = mongoose.model('Users', userSchema);

let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: Number,
    description: String,
    createdOn: { type: Date, default: Date.now }
});
const productModel = mongoose.model('products', productSchema); 

app.post("/signup", (req, res) => {

    let body = req.body;

    if (!body.firstName
        || !body.lastName
        || !body.email
        || !body.password
    ) {
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    req.body.email = req.body.email.toLowerCase();

    // check if user already exist // query email user
    userModel.findOne({ email: body.email }, (err, user) => {
        if (!err) {
            console.log("user: ", user);

            if (user) { // user already exist
                console.log("user already exist: ", user);
                res.status(400).send({ message: "user already exist,, please try a different email" });
                return;

            } else { // user not already exist

                // bcrypt hash
                stringToHash(body.password).then(hashString => {

                    userModel.create({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        email: body.email,
                        password: hashString
                    },
                        (err, result) => {
                            if (!err) {
                                console.log("data saved: ", result);
                                res.status(201).send({ message: "user is created" });
                            } else {
                                console.log("db error: ", err);
                                res.status(500).send({ message: "internal server error" });
                            }
                        });
                })

            }
        } else {
            console.log("db error: ", err);
            res.status(500).send({ message: "db error in query" });
            return;
        }
    })
});

app.post("/login", (req, res) => {

    let body = req.body;
    body.email = body.email.toLowerCase();

    if (!body.email || !body.password) { // null check - undefined, "", 0 , false, null , NaN
        res.status(400).send(
            `required fields missing, request example: 
                {
                    "email": "abc@abc.com",
                    "password": "12345"
                }`
        );
        return;
    }

    // check if user exist
    userModel.findOne(
        { email: body.email },
        "email password",
        (err, data) => {
            if (!err) {
                console.log("data: ", data);

                if (data) { // user found
                    varifyHash(body.password, data.password).then(isMatched => {

                        console.log("isMatched: ", isMatched);

                        if (isMatched) {

                            const token = jwt.sign({
                                _id: data._id,
                                email: data.email,
                                iat: Math.floor(Date.now() / 1000) - 30,
                                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                            }, SECRET);

                            console.log("token: ", token);

                            res.cookie('Token', token, {
                                maxAge: 86_400_000,
                                httpOnly: true
                            });

                            res.send({
                                message: "login successful",
                                profile: {
                                    email: data.email,
                                    firstName: data.firstName,
                                    lastName: data.lastName,
                                    age: data.age,
                                    _id: data._id
                                }
                            });
                            return;
                        } else {
                            console.log("password did not match");
                            res.status(401).send({ message: "Incorrect email or password" });
                            return;
                        }
                    })

                } else { // user not already exist
                    console.log("user not found");
                    res.status(401).send({ message: "Incorrect email or password" });
                    return;
                }
            } else {
                console.log("db error: ", err);
                res.status(500).send({ message: "login failed, please try later" });
                return;
            }
        })
})

app.post("/logout", (req, res) => {

    res.cookie('Token', '', {
        maxAge: 1,
        httpOnly: true
    });

    res.send({ message: "Logout successful" });
})

app.use((req, res, next) => {
    console.log("req.cookies: ", req.cookies);
  
    if (!req?.cookies?.Token) {
      res.status(401).send({
        message: "include http-only credentials with every request",
      });
      return;
    }
  
    jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
      if (!err) {
        console.log("decodedData: ", decodedData);
  
        const nowDate = new Date().getTime() / 1000;
  
        if (decodedData.exp < nowDate) {
          res.status(401);
          res.cookie("Token", "", {
            maxAge: 1,
            httpOnly: true,
          });
          res.send({ message: "token expired" });
        } else {
          console.log("token approved");
  
          req.body.token = decodedData;
          next();
        }
      } else {
        res.status(401).send("invalid token");
      }
    });
  });

app.post("/home", (req,res)=>{
    res.send("It is Home");
})





const __dirname = path.resolve();

app.use('/', express.static(path.join(__dirname, './jwt/build')))
app.use('*', express.static(path.join(__dirname, './jwt/build')))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





mongoose.connect(MongoDBURI);



mongoose.connection.on('connected', function () {
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
