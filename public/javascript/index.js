
let message = '';
let namechange = /\/nick\s([^\s]*)(.*)/;
let colorchange = /\/nickcolor\s([^\s]*)(.*)/;

$(function (){
    let socket = io();
    //socket.emit('socketID',socket.id);
    let cookietest = document.cookie;
    console.log("socketid:" + cookietest);
    socket.emit('getCookie',document.cookie);
    if(cookietest !== ''){
        //$('#UserNameLabel').text()
    }
    $('form').submit(function(e){
       e.preventDefault();
       message = $('#message').val();
       let nameChangeMatch = namechange.exec(message);
       let colourChangeMatch = colorchange.exec(message);
       if(nameChangeMatch){
           console.log("nameChange");
       }
       if(colourChangeMatch){
           cosole.log("Colour change");
       }
       socket.emit('chat message',message);
       $('#message').val('');
       return false;
    });
    socket.on('chat message', function (msg) {
       $('#messages').append($('<li>').text(msg));
    });
    
    socket.on('setCookie',function (cookie) {
        document.cookie = cookie;
    });




});

let checkCommands = function(message){
    let namechange = /\/nick\s([^\s]*)(.*)/;
    let colorchange = /\/nickcolor\s([^\s]*)(.*)/;


};