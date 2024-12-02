const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;
const JWT_SECRET = "jwtkey";

const users = [];

app.use(express.json());

function auth(req , res , next) {
    const token = req.headers.token;
    const decoded_data = jwt.verify(token , JWT_SECRET);

    if (decoded_data.username) {
        req.username = decoded_data.username;
        next();
    }
    else {
        res.status(403).json({
            message: "You are not logged in, Access Denied!"
        })
    }
}

// SIGNUP
app.post('/signup' , (req , res) => {
    const username = req.body.username;
    const password = req.body.password;

    // CONDITION CHECK, WHETHER THE USER IS ALREADY REGISTERED OR NOT!

    if (users.find(u => u.username === username)) { // USER ALREADY EXISTS IN THE DATABASE
        res.status(400).json({
            msg: `${username} is already Registered!!`
        })
    }
    else {
        users.push({
            username: username,
            password: password
        });
        res.json({
            msg: `${username} Successfully Signed UP!!`
        })
    }

    console.log(req.route.path);
    console.log(users);
    console.log('\n');
})

//SIGNIN
app.post('/signin' , (req , res) => {
    const username = req.body.username;
    const password = req.body.password;

    let searchUser = null;
    for (let i = 0 ; i < users.length ; i++) {
        if (users[i].username === username && users[i].password === password) { // user found, creds correct
            searchUser = users[i];
        }
        // else { // user NOT found, creds INCORRECT!
        //     searchUser = null;
        // }
    }

    if (!searchUser) { // what to do if the user not found, creds incorrect!!
        res.status(403).json({
            msg: "user not found, incorrect credentials!"
        })
    }
    else { // MAIN LOGIC of jwt token generating and assigining, if the user found, creds correct!
        // const token = jwt.sign(kiske_basis_per , kis_zariye_se)
        const token = jwt.sign({username} , JWT_SECRET);

        res.json({
            msg: `${searchUser.username} Successfully Logged IN!!`,
            token: token
        });

    }

    console.log(req.route.path);
    console.log(users);
    console.log('\n');
})

// AUTHENTICATED ENDPOINT: /me
app.get('/me', auth , (req , res) => {
    const username = req.username;

    let searchUser = null;
    for (let i = 0 ; i < users.length ; i++) {
        if (users[i].username === username) {
            searchUser = users[i];
        }
        // else {
        //     searchUser = null;
        // }
    }


    res.json({
        username: searchUser.username,
        password: searchUser.password,
        msg: "AUTHENTICATION SUCCESS!"
    })

    console.log(req.route.path);
    console.log(users);
    console.log('\n');
    
})

app.get("/" , (req,res) => {res.json({msg: "Welcome to the Home page of the website!"})});
app.listen(PORT);