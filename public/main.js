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
    // $('#messages').empty();
    $('#messages').append(
        `<div data-id="${message._id}" class="speech-bubble">
            <h4> ${message.name} </h4> 
            <p> &nbsp; <i>${message.message}</i>
                <img data-id="test" src="trash.png" class="trash">
            </p>
        <div>`)
}

$(document).on('click', '.trash', function() {
    let id = $(this).parent().parent().attr('data-id')
    deleteMessage(id);
})

function getMessages() {
    $.get('/messages', (data) => {
        data.forEach(addMessages);
    })
}

function postMessages(message) {
    $.post('/messages', message)
}

function deleteMessage(id) {
    $.ajax({
        url: `/messages/${id}`,
        type: 'DELETE'
    })
}