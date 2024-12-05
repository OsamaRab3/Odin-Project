require('dotenv').config();
const express = require("express")
const cors = require('cors');
const path = require('path')
const bookRouter = require('./routes/books.routers')





const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const PORT= process.env.PORT ||8080

app.use(cors())



app.use('/api/books',bookRouter);


app.all('*',(req,res)=>{
  res.status(404).json({})
})



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

