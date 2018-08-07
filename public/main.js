// Assigning variable socket to socket.io
let socket = io();

// Socket listener for adding messages and deleting
socket.on('message', addMessages);
socket.on('delete', getMessages);

// Event listener for submit button on mainpage
$(() => {
    $('#mainpage').submit((e) => {
        e.preventDefault();
        const message = {
            name: $('#name').val(),
            message: $('#message').val()
        }
        $('#name').prop('readonly', true);
        $('#message').val('')
        postMessages(message);
    });
    getMessages()
})

// Function that adds messages html to page
function addMessages(message) {
    $('#messages').append(
        `<div data-id="${message._id}" class="speech-bubble">
            <h4> ${message.name} </h4> 
            <p><i>${message.message}</i>
                <img data-id="test" alt="trashcan" src="trash.png" class="trash">
            </p>
        <div>`)
}

// Event listener for trash can to call delete message function
$(document).on('click', '.trash', function() {
    let id = $(this).parent().parent().attr('data-id')
    deleteMessage(id);
    getMessages();
})

// Event listener for information button to display page elements
$(document).on('click', '#info', function (e) {
    $(".signup-form").hide();
    $(".login-form").hide();
    $("#mainpage").hide();
    $("#info-form").show();
    $('#messages').hide();
    e.preventDefault();
})

// Function to send ajax using JWT to retrieve messages authenticated. 
function getMessages() {
    // $('#messages').show();
    let token = localStorage.getItem('authToken');
    $.ajax({
        url: '/messages',
        type: 'GET',
        headers: {
            "Authorization": 'Bearer ' + token
        },
        dataType: 'JSON'
    })
    .done(data => {
        $('#messages').empty();
        // $('#messages').contents(':not(img)').remove();
        data.forEach(addMessages);
    })
}

// function to send ajax using JWT to post messages authenticated.
function postMessages(message) {
    let token = localStorage.getItem('authToken');
    $.ajax({
        url: '/messages',
        type: 'POST',
        data: JSON.stringify(message),
        headers: {
            "Authorization": 'Bearer ' + token,
            "Content-Type": "application/json"
        },
        dataType: 'JSON'
    })
    .done(data => {
        console.log(message);
        addMessages(message);
    })
}

// Function to send ajax using JWT to delete messages authenticated. 
function deleteMessage(id) {
    let token = localStorage.getItem('authToken');
    $.ajax({
        url: `/messages/${id}`,
        type: 'DELETE',
        headers: {
            "Authorization": 'Bearer ' + token
        }
    })
}

// Function to validate user login using ajax post to auth route. 
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

// Event listener to show signup page
$("#newAcct").click(() => {
    $(".signup-form").show();
    $(".login-form").hide();
})

// Event listener to login user using ajax post to users auth route.
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
        $('#messages').show();
        $('#signup').hide();
        $('#login').hide();
        $('.error-message').hide();
        getMessages();
    })
    .fail(function (err) {
        console.log(err);
        if (err.status === 401) {
            $('.error-message').html('Username and/or password incorrect');
        }
    });

})

// Event listener to create user object and post to users auth route.
$(document).on('submit', '#signup', function (e) {
    e.preventDefault();
    // Store the user info 
    let username = $('#signupUsername').val();
    let password = $('#signupPassword').val();
    let firstName = $('#signupFirstName').val();
    let lastName = $('#signupLastName').val();

    const user = {
      username,
      password,
      firstName,
      lastName
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
            $('.error-message').html('<b>Username and/or Password incorrect</b>');
        }
    });
})

