var app = require('express')();
var express = require('express');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var sassMiddleware = require('node-sass-middleware');

app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

let users = [];
let currentusernames = [];
let socketIDs = [];
let possibleUserName = ["Fu","Kyo","Kei","Gin","Kin","Oou","Gyo","Kya","Hi"];
let lastUniqueUserName = 0;
let user = {
    "username": '',
    "colour":'black',
};

let chats=[];

let chat = {
    "timestamp":'',
    "username":null,
    "message":"",
};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/view/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    console.log("Socketid: " + socket.id);
    if(socketIDs.includes(socket.id) === false){
        socketIDs.push(socket.id);
    }
    console.log(socketIDs);
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

});



io.on('connection',function(socket){
    socket.on('chat message', function (msg) {
        console.log("message: " + msg);
        io.emit('chat message',msg);
    });

    socket.on('getCookie',function (cookie) {
        console.log("getCookie: " + cookie);
        let username = '';
        if(cookie === ''){
            username = possibleUserName[lastUniqueUserName];
            console.log("no cookie, new ussername: " + username);
            console.log("username bool: " + users.includes(username));
            while(currentusernames.includes(username)){
                lastUniqueUserName++;
                username = possibleUserName[lastUniqueUserName];
                console.log("generating new username: " + username);
            }
            cookie = 'username=' + username;
            socket.emit('setCookie',cookie);
        }else{
            let userregex = /username=(.*)/;
            let match = userregex.exec(cookie);
            console.log("regex: " + match[1]);
            username = match[1];
            currentusernames.push(username);
            console.log("bool: " + users.filter(users => (users.username === username)));
            // while(users.filter(users => (users.username === username))){
            //     console.log("Username: " + username);
            //     username = possibleUserName[lastUniqueUserName];
            //     lastUniqueUserName++;
            // }
        }
        let tempuser = user;
        tempuser.username = username;
        users.push(tempuser);
        console.log(users);
    });


    socket.on('changeColour',function (command) {
        
    });
    
    socket.on('changeUsername', function (command) {

    });

});




http.listen(3000, function(){
    console.log('listening on *:3000');
});

let userConnection = function () {

};