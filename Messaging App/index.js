require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path');
// const prisma = require('./utils/prisma');
const app = express()
const PORT = process.env.PORT;


// -------------------Socket--------------------------------------------------------------------------------
const {setupSocket} = require('./utils/socket.io')
const http = require('http')
const server = http.createServer(app)



setupSocket(server);

// -------------------Middleware--------------------------------------------------------------------------------

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname,"public")))


const morgan = require('morgan');
app.use(morgan('dev')); 

// --------------------Route----------------------------------------------------------------------------
const userRoute = require('./routes/auth_route')
const groupRoute = require('./routes/group_route')
const messageRoute = require('./routes/message.route')

app.use('/api/user',userRoute)
app.use('/api/group',groupRoute)
app.use('/api/chat',messageRoute)



server.listen(PORT,()=>{
     console.log(`run in ${PORT}`)
 })