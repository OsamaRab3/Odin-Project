//  Basic HTTP Server using Node.js

const { readFile } = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const port = 8080;

function   readfileContent (file,res){
    readFile(file, "utf-8", (err, data) => {
        if (err) {
            console.error(`Error reading file ${file}: ${err.message}`);
            res.writeHead(500, { "Content-Type": "text/html" });
            res.end("<h1>500 - Internal Server Error</h1>");
        } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        }
    });
}

const server = http.createServer((req, res) => {
    file = "";
    switch (req.url) {
        case '/':
            file = path.join(__dirname,"index.html");
            break;
        case '/about':
            file = path.join(__dirname,"about.html");
            break;
        case '/contact-me':
            file = path.join(__dirname,"contact-me.html");
            break;
        default:
            file =path.join(__dirname, "404.html");
            res.writeHead(404);
            break;
    }

    readfileContent(file, res);


});
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});




