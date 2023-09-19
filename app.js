const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const fs = require('fs');
const io = require('socket.io')(server);

app.use(express.static('src'));

app.get('/', function(req, res){
    fs.readFile('./src/index.html', (err, data) => {
        if(err) throw err;

        res.writeHead(200, {
            'Content-Type' : 'text/html'
        })
        .write(data)
        .end();
    });
});

io.sockets.on('connection', function(socket){
    socket.on('newUserConnect', function(name){
        socket.name = name;

        io.sockets.emit('updateMessage', {
            name : 'SERVER',
            message : name + ' Connected.'
        });
    });

    socket.on('disconnect', function(){
        io.sockets.emit('updateMessage', {
            name : 'SERVER',
            message : socket.name + ' Left.'
        });
    });

    socket.on('sendMessage', function(data){
        data.name = socket.name;
        io.sockets.emit('updateMessage', data);
    });
});

server.listen(8080, function(){
    console.log('Starting Server...');
});