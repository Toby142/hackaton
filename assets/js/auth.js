$(document).ready(function() {



    $('.login').submit(function(event) {
        event.preventDefault();


        const email = $('#username-email').val();
        const password = $('#current-password').val();

        const formData = {
            password: password,
            email: email
          };

          
        const url = '/login';
        
        const options = {
            method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify(formData)
        };
          
        fetch(url, options)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            if(data.message) {
                window.location.href = "/home";
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

      });


      $('.register').submit(function(event) {
        event.preventDefault();


        const firstname = $('#first-name').val();
        const lastname = $('#last-name').val();
        const email = $('#email').val();
        const username = $('#username').val();
        const newpassword = $('#new-password').val();

        const formData = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            username: username,
            newpassword: newpassword
          };


        const url = '/users/create';
        
        const options = {
            method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify(formData)
        };
          
        fetch(url, options)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
          
        })
        .catch(error => {
            console.error('Error:', error);
        });


















      });












});