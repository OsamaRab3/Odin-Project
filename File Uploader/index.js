require('dotenv').config()
const express = require('express')
const cors = require('cors');
const path = require('path')

const  { passport } = require('./config/passport')
const userRouter = require('./routes/user.route')
const folderRouter = require('./routes/folder.route')
const fileRouter = require('./routes/file.route')
const { sessionMiddleware} = require('./middleware/session');
const app = express();
const PORT = process.env.PORT;



app.use(sessionMiddleware);
app.use(passport.initialize()); 
app.use(passport.session());
app.use(cors());

app.use((req,res,next)=>{
    console.log(`${req.method} -${req.url} `);
    // const isAuthenticated = req.session && req.session.id;
    // console.log(`Authenticated: ${isAuthenticated}`);
    console.log(`${req.isAuthenticated()}`)
    
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status:"error", message: err.message });
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/user',userRouter)

app.use('/api/folder',folderRouter)

app.use('/api/file',fileRouter)


app.all('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '404NotFound.html'));
});

app.listen(PORT,()=>{
  console.log(`app run in ${PORT}`)
})



