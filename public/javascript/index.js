
$(function (){
    let socket = io();
    $('form').submit(function(e){
       e.preventDefault();
       socket.emit('chat message',$('#message').val());
       $('#message').val('');
       return false;
    });
});