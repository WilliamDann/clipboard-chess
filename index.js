const express    = require('express');
const bodyParser = require('body-parser');
const http       = require('http');
const {Server}     = require('socket.io');

const app    = express();
const server = http.createServer(app); 
const io     = new Server(server);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const parseCmdArgs = () => {
    const args = {}

    for (let i = 0; i < process.argv.length; i++) {
        if (process.argv[i].indexOf('-') != -1) {
            if (i+1 > process.argv.length)
                throw new Error("Invalid args")

            args[process.argv[i].replaceAll('-', '')] = process.argv[i+1]
        }
    }

    return args
}

let PORT   = process.env.PORT;
const args = parseCmdArgs()
if (args['port'])
    PORT = args['port']


// TODO save database object
const db = { games: {} }

// web socket server
io.on('connection', (sock) => {
    require('./src/websocks')(sock, db);
})

server.listen(PORT, () => console.log("Running on port " + PORT))