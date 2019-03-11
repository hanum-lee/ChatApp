
let message = '';
let namechange = /\/nick\s([^\s]*)(.*)/;
let colorchange = /\/nickcolor\s([^\s]*)(.*)/;
let userregex = /username=(.*)/;
let username = null;

$(function (){
    let socket = io();
    //socket.emit('socketID',socket.id);
    let cookietemp = document.cookie;
    console.log("socketid:" + cookietemp);
    socket.emit('getCookie',document.cookie);
    if(cookietemp !== ''){
        let match = userregex.exec(cookietemp);
        username = match[1];
        $('#UserNameLabel').text("You are: " + username);
    }
    $('form').submit(function(e){
       e.preventDefault();
       message = $('#message').val();
       let nameChangeMatch = namechange.exec(message);
       let colourChangeMatch = colorchange.exec(message);
       if(nameChangeMatch){
           console.log("nameChange");
           let msg = {
             username: username,
             newusername: nameChangeMatch[1]
           };
           socket.emit('changeUsername', msg);
       }
       else if(colourChangeMatch){
           console.log("Colour change");
           let msg = {
               username: username,
               colour: colourChangeMatch[1]
           };
           socket.emit('changeColour',msg);
       }else{
           let msgsent ={};
           msgsent.username = username;
           msgsent.content = message;
           socket.emit('chat message',msgsent);
       }


       $('#message').val('');
       $("#messages").scrollTop($("#messages")[0].scrollHeight);
       return false;
    });
    socket.on('chat message', function (msgs) {
        console.log(msgs);
        $('#messages').empty();
        for(let i = 0; i < msgs.length; i++){
            let msgshown = "<li>"+ msgs[i].timestamp + " <span style='color: " + msgs[i].colour+ "'>"+ msgs[i].username + "</span> : <span " ;
            if(username === msgs[i].username){
                msgshown= msgshown + "style = 'font-weight: bold;'";
            }
            msgshown = msgshown + ">" + msgs[i].message + "</span>";
            console.log(msgshown);
            $('#messages').append(msgshown);
        }

       $("#messages").scrollTop($("#messages")[0].scrollHeight);
    });
    
    socket.on('setCookie',function (cookie) {
        document.cookie = cookie;
        let match = userregex.exec(cookie);
        username = match[1];
        $('#UserNameLabel').text("You are: " + username);
    });

    socket.on('userlist',function(ulist){
        $('#currentUser').empty();
        for(let i = 0; i < ulist.length; i++){
            $("#currentUser").append("<li>" + ulist[i]);
        }
    });


});

