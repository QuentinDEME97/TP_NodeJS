const MongoClient = require('mongodb').MongoClient;
const assert = require('assert')
const express = require('express')
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

let app = express()

// Mongo Server address
const db_url = "mongodb://localhost:27017/";

// Database name
const dbName = "mongotp"

// Create MongoDB client
const client = new MongoClient(db_url);

const findDocuments = function (db, col, callback) {
    // Get the documents collection
    const collection = db.collection(col);
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

// Use connect method to connect to the Server
client.connect(function(err) {
    assert.equal(err, null);
    console.log("Connected correctly to server");
    const db = client.db(dbName);
    findDocuments(db, 'menu', function(data){
        console.log('data acquired');
    });
    // client.close();
});

app.get('/*', function (req, res) {
    var page = url.parse(req.url).pathname;
    var params = querystring.parse(url.parse(req.url).query);

    fs.readFile(__dirname + '/framework/' + page,
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
var io = require('socket.io').listen(app.listen(port), { log: true });

io.sockets.on('connection', (socket) => {

    console.log("Je reçois une connection à la socket")

    socket.on('menu', function (data) {
        // Use connect method to connect to the Server
    
        console.log("Je reçois bien une demande de menu");
        const db = client.db(dbName);
        findDocuments(db, 'menu', function (docs) {
            console.log('menu', docs);
            let menu = {"items" : docs}
            socket.emit('menu', menu);
        });
    });

})

console.log("listening to " + port);