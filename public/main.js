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
    let user = {};
    user.username = $('#loginUsername').val();
    user.password = $('#loginPassword').val();
    $.ajax({
        type: 'POST',
        url: '/api/auth/login/',
        data: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

$("#newAcct").click(() => {
    $(".signup-form").show();
    $(".login-form").hide();
})

$(document).on('submit', '#login', function (e) {
    e.preventDefault();
    // Store the user info 
    let username = $('#loginUsername').val();
    let password = $('#loginPassword').val();

    const user = {
      username,
      password
    };

    $.ajax({
        url: '/api/auth/login',
        type: 'POST',
        data: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json'
        }
    })
    .done(token => {
        localStorage.setItem("authToken", token.authToken);
        localStorage.setItem("currentUser", user.username);    
        $('#mainpage').show();
        $('#signup').hide();
        $('#login').hide();    
    })
    .fail(function (err) {
        console.log(err);
        if (err.status === 401) {
            $('.error-message').html('Username and/or password incorrect');
        }
    });

})

$(document).on('submit', '#signup', function (e) {
    e.preventDefault();
    // Store the user info 
    let username = $('#signupUsername').val();
    let password = $('#signupPassword').val();

    const user = {
      username,
      password
    };

    $.ajax({
        url: '/api/users',
        type: 'POST',
        data: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json'
        }
    })
    .done(() => {    
        $('#mainpage').hide();
        $('#signup').hide();
        $('#login').show();    
    })
    .fail(function (err) {
        console.log(err);
        if (err.status === 401) {
            $('.error-message').html('Username and/or password incorrect');
        }
    });
})

