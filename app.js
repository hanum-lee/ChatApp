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

// let user = {
//     "username": '',
//     "colour":'black',
// };



let chats=[];

// let chat = {
//     "timestamp":'',
//     "username":null,
//     "message":"",
// };

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/view/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');

    let username = '';
    socket.on('getCookie',function (cookie) {
        // console.log("getCookie: " + cookie);

        if(cookie === ''){
            username = possibleUserName[lastUniqueUserName];
            // console.log("no cookie, new ussername: " + username);
            // console.log("username bool: " + users.includes(username));
            while(currentusernames.includes(username)){
                lastUniqueUserName++;
                username = possibleUserName[lastUniqueUserName];
                // console.log("generating new username: " + username);
            }
            currentusernames.push(username);
            cookie = 'username=' + username;
            socket.emit('setCookie',cookie);
        }else{
            let userregex = /username=(.*)/;
            let match = userregex.exec(cookie);
            // console.log("regex: " + match[1]);
            username = match[1];
            currentusernames.push(username);
            // console.log(currentusernames);
        }
        let user = {};
        user.username = username;
        user.colour = "black";
        users.push(user);
        // console.log(users);
        io.emit('userlist',currentusernames);
    });

    socket.on('changeUsername',function (msg) {
       let index = currentusernames.indexOf(msg.username);
       currentusernames[index] = msg.newusername;
       users[index] = msg.newusername;
       username = msg.newusername;
       let cookie = "username=" + username;
       socket.emit('setCookie', cookie);
       io.emit('userlist',currentusernames);
    });



    socket.on('disconnect', function(){
        let index = currentusernames.indexOf(username);
        if(index > -1){
            currentusernames.splice(index,1);
            users.splice(index,1);
        }
        console.log('user disconnected ' + username);
        // console.log(users);
        // console.log(currentusernames);
        io.emit('userlist',currentusernames);
    });
    socket.emit('chat message',chats);



});



io.on('connection',function(socket){
    socket.on('chat message', function (msg) {
        // console.log("Username: " + msg.username + " message: " + msg.content);

        let date = new Date(Date.now());
        let localeSpecificTime = date.toLocaleTimeString();
        localeSpecificTime.replace(/:\d+ /, ' ');
        // console.log("timestamp: " + localeSpecificTime);
        let chat = {
            "timestamp":'',
            "username":null,
            "message":"",
            "colour":null
        };
        chat.timestamp = localeSpecificTime;
        chat.username = msg.username;
        chat.message = msg.content;
        for(let i = 0; i < users.length; i++){
            if(users[i].username === msg.username){
                chat.colour = users[i].colour;
            }
        }
        chats.push(chat);
        // console.log(chats);
        io.emit('chat message',chats);
    });


    socket.on('changeColour',function (msg) {
        let index = currentusernames.indexOf(msg.username);
        users[index].colour = msg.colour;
    });
    

});




http.listen(3000, function(){
    console.log('listening on *:3000');
});
