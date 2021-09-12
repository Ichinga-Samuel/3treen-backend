const User = require('./models/userModel')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({path: './config.env'})

let DB = 'mongodb://localhost:27017/3Green';
//let DB = process.env.DB_URL;
if (process.env.NODE_ENV === 'production') {
    DB = process.env.DB_URL;
}

mongoose
    .connect(DB, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB Connection Successful'))
    .catch((err) => console.log(err));

async function createAdmin(){
    let admin = {
        email: "ichingasamuel@gmail.com",
        password: "test1234",
        passwordConfrim: "test1234",
        verified: true,
        fullName: "Samiyol",
        role: "admin",
        workPhone: 9037031782,
        homePhone: 9037031782
    }
    let user = await User.create(admin)
}

let users = [
    u1 = {
        email: "akaichinga@gmail.com",
        password: "test1234",
        passwordConfrim: "test1234",
        verified: true,
        fullName: "Aka Ichinga",
        role: "user",
        workPhone: 9037031782,
        homePhone: 9037031782
    },
    u2 = {
        email: "akaikenga7@gmail.com",
        password: "test1234",
        passwordConfrim: "test1234",
        verified: true,
        fullName: "Aka Ikenga",
        role: "user",
        workPhone: 9037031782,
        homePhone: 9037031782
    },
    u3 = {
        email: "africanebooks@gmail.com",
        password: "test1234",
        passwordConfrim: "test1234",
        verified: true,
        fullName: "Aka Ebooks",
        role: "user",
        workPhone: 9061758716,
        homePhone: 9061758716
    }
]

async function createUsers(){
    let new_users = users.map(async (u) => {
        return await User.create(u)
    })
    await Promise.all(new_users)
}

createUsers().catch(console.error)