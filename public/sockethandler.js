const socket = io();

console.log("Sockethandler loaded");

socket.on('connect', () => {
    socket.emit('ready', getCookie("uuid"));
    console.log("connected");
});