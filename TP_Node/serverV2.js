var consoleemoji = require('console-emojis')
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

// npm install socket.io express socket.io-client
var express = require('express');
var app = express();

app.get('/*', function (req, res) {
    var page = url.parse(req.url).pathname;
    var params = querystring.parse(url.parse(req.url).query);

    fs.readFile(__dirname + '/html/' + page,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + page);
            }
            // console.memo('sending document ' + page);
            res.end(data);
        });

    // sending response OK
});

var port = 8080;
console.success("listening to " + port);
var io = require('socket.io').listen(app.listen(port), { log: true });
let date = new Date;
let hour = date.getHours()
let minutes = date.getMinutes()
let datestr = hour.toString() + ":" + minutes.toString()
var messages = [{ "message": "Bienvenue !", "author": "server", "date": datestr}];
clients = {};
// when the client is ready
io.sockets.on('connection', function (socket) {
    socket.on('ready', function (data) {
        console.received('received', 'ack');
        socket.emit("message", messages);
        clients[socket.id] = socket;
    });
    console.log('Bonjour')
    socket.on('message', (message) => {
        messages.push(message)
        console.log("liste des messages", messages)
        let tab_client = Object.keys(clients)
        tab_client.forEach(client => {
            clients[client].emit('message', messages)
        })
        socket.emit("message", messages)
    })
});

// // Chargement de socket.io
// var io = require('socket.io').listen(app.listen(port));

// // Quand un client se connecte, on le note dans la console
// io.sockets.on('connection', function (socket) {
//     console.log('Un client est connecté !');
// });