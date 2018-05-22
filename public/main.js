let socket = io();

$(() => {
    $('#send').click(() => {
        const message = {
            name: $('#name').val(),
            message: $('#message').val()
        }
        $('#name').val('')
        $('#message').val('')
        postMessages(message);
    });
    getMessages();
})

socket.on('message', addMessages);

function addMessages(message) {
    $('#messages').show();
    $('#messages').append(`<div class="message"><h4> ${message.name} </h4> <h5> &nbsp; <i>${message.message}</i><a href="#"><img src="trash.png" class="trash"></a></h5><div>`)
}

function getMessages() {
    $.get('http://localhost:8080/messages', (data) => {
        data.forEach(addMessages);
    })
}

function postMessages(message) {
    $.post('http://localhost:8080/messages', message)
}