const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
// const PrismaSessionStore = require('@quixo3/prisma-session-store');
const { prisma } = require('../config/prisma');


const sessionMiddleware = session({
  secret: "ugoub8g8noqf;kjk7y6",
  resave: false,
  saveUninitialized: false,
  // expires: new Date(Date.now() + 1000 * 60 * 60),
  // store: new PrismaSessionStore(
  //   prisma,
  //   {
  //     sessionModelName: 'Session',
  //     // sessionIdLookupName: 'sid',
  //     checkPeriod: 10 * 60 * 1000,  
  //     // dbRecordIdIsSessionId:true,

  

  //   }
  // ),
  cookie:  { secure: false }
});



module.exports = {
  sessionMiddleware,

};