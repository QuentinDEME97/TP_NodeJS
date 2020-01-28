var emojis = require('console-emojis')
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    var page = url.parse(req.url).pathname;
    var params = querystring.parse(url.parse(req.url).query);

    fs.readFile(__dirname + '/html/' + page,
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + page);
            }
            console.memo('sending document ' + page);
            res.end(data);
        });

    // sending response OK
});

var port = 8080;
// console.log("listening to " + port);
console.success("Server listening to " + port);
server.listen(8080);