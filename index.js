const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const PORT = 8080;

const port = process.env.port || PORT;

server.listen(port, ()=>{
    console.log(`server running on ${port}`);
})