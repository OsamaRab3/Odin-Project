const express = require("express");
const path = require("path");


const messageRouter = require("./router/messages.router")

const app = express();
const port = 8080
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


app.get('/',messageRouter)



app.get('/new',messageRouter )


app.post('/new',messageRouter )

app.listen(port, () => {
    console.log(`run in ${port}`)
})