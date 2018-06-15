let socket = io();

$(() => {
    $('#send').click(() => {
        const message = {
            name: $('#name').val(),
            message: $('#message').val()
        }
        // $('#name').val('')
        $('#message').val('')
        postMessages(message);
    });
    getMessages();
})

socket.on('message', addMessages);
socket.on('delete', getMessages);


function addMessages(message) {
    $('#messages').append(
        `<div data-id="${message._id}" class="speech-bubble">
            <h4> ${message.name} </h4> 
            <p><i>${message.message}</i>
                <img data-id="test" src="trash.png" class="trash">
            </p>
        <div>`)
}

$(document).on('click', '.trash', function() {
    let id = $(this).parent().parent().attr('data-id')
    deleteMessage(id);
    getMessages();
})

function getMessages() {
    $('#messages').empty();
    $('#messages').show();
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

function loginUser() {
    $('')
}

$(document).on('submit', '#login', function (e) {
    e.preventDefault();
   $('#mainpage').show();
   $('#signup').hide();
   $('#login').hide();
})
