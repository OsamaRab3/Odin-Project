require('dotenv').config()

const express = require('express');
const passport = require('passport');
const path = require('path')
const http = require('http')
const socket = require('socket.io')
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const  cors =  require('cors')
const app = express();
const server = http.createServer(app)
const io = socket(server)



require('./config/passportGoogle')
require('./config/passportLocal')
app.use(passport.initialize());

const morgan = require('morgan');
app.use(morgan('dev'));



app.use(cors({
    origin: 'http://localhost:8081',
  }));

app.use(express.json()); 
app.use(express.static(path.join(__dirname,"public")))


const userRouter = require('./routes/user.route')
const postRouter = require('./routes/post.route')
const messageRouter = require('./routes/message.route')

app.use('/api/users',userRouter)
app.use('/api/posts',postRouter)
app.use('/api/messages',messageRouter)




// --------------------------- googl authO2 ----------------------------------------
const auth = require('./controller/authController')

app.get('/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);


app.get('/auth/google/callback',  
    passport.authenticate('google', { 
      session: false,
      failureRedirect: '/api/fail' 
    }),
    (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));

  }
  );


app.get('/api/success', (req, res) => res.send("Authentication successful!"));
app.get('/api/fail', (req, res) => res.send("Authentication failed!"));



// ---------Socket-------------------------

io.on('connection',(socket)=>{
  console.log(`user connction`,socket.id)


  socket.on('disconnect',()=>{
    console.log("User disconnect");
  })
})

module.exports = io;



server.listen(8080, () => {
    console.log(`lisitin on :8080`)
})