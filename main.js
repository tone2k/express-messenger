let socket = io()

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

socket.on('message', addMessages)

function addMessages(message) {
    $('#messages').append(`<h4> ${message.name} </h4> <p> ${message.message} </p>`)
}

function getMessages() {
    $.get('http://localhost:3000/messages', (data) => {
        data.forEach(addMessages);
    })
}

function postMessages(message) {
    $.post('http://localhost:3000/messages', message)
}