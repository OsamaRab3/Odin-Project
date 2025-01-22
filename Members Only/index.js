require('dotenv').config();
const cors = require('cors');
const express = require('express');
const path = require('path')
const connection = require('./config/db');
connection();
const userRouter = require('./routes/user.route');

const app = express();
const PORT = process.env.PORT || 5000


//CORS 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',userRouter)





app.listen(PORT, () => {
    console.log(`server is un on localhost:${PORT}`)
})
