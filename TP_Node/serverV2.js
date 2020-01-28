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
/* ========== */
var io = require('socket.io').listen(app.listen(port), { log: true });
let date = new Date;
let hour = date.getHours()
let minutes = date.getMinutes()
let datestr = hour.toString() + ":" + minutes.toString()
/* ============= */

/* Création du premier message du serveur.
 On utilise une liste pour avoir un historique à fournir si un nouveau
client se connecte. */
var messages = [{ "message": "Bienvenue !", "author": "server", "date": datestr}];
// Set pour contenir les clients connectés aux serveurs
clients = {};
// Quand le client est prêt
io.sockets.on('connection', function (socket) {
    // La socket reçoit un ready
    socket.on('ready', function (data) {
        console.received('received', 'ack');
        // On transmet les messages
        socket.emit("message", messages);
        // On enregistre la socket qui est connectée
        clients[socket.id] = socket;
    });

    // Le serveur reçoit un message
    socket.on('message', (message) => {
        // Ajout du message à l'historique
        messages.push(message)
        // On contact tous les clients pour leur envoyer le nouveau message
        let tab_client = Object.keys(clients)
        tab_client.forEach(client => {
            clients[client].emit('message', messages)
        })
        socket.emit("message", messages) // => Pas sûr que ce soit utile
    })
});