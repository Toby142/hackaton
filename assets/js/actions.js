$(document).ready(function () {

    $('.profile-container').on('click', '#create-app', function () {
        const name = $('#name').val();
        const formData = {
            name: name
        };


        const url = '/app/create';

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
                window.location.href = "/home";
                console.log('Success:', data);

            })
            .catch(error => {
                console.error('Error:', error);
            });


    });



    $('.profile-container').on('click', '#create-link-button', function () {
        const name = $('#name').val();
        const redirect = $('#redirect').val();
        const requirements = $('#requirements').val();
        const appID = $('#appID').val();

        const formData = {
            _appID: appID,
            name: name,
            link: redirect,
            requirements: requirements
        };


        const url = '/link/create';

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
                    throw new Error('Network response was not oke');
                }
                return response.json();
            })
            .then(data => {
                window.location.href = "/home";
                console.log('Success:', data);

            })
            .catch(error => {
                console.error('Error:', error);
            });


    });











    $('.profile-container').on('click', '#edit-link-save', function () {
        const name = $('#name').val();
        const redirect = $('#redirect').val();
        const requirements = $('#requirements').val();
        const linkID = $('#linkID').val();

        const formData = {
            _linkID: linkID,
            name: name,
            link: redirect,
            requirements: requirements
        };


        const url = '/link/update';

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
                    throw new Error('Network response was not oke');
                }
                return response.json();
            })
            .then(data => {
                window.location.href = "/home";
                console.log('Success:', data);

            })
            .catch(error => {
                console.error('Error:', error);
            });


    });

    $('.profile-container').on('click', '#edit-app-save', function () {
        const name = $('#name').val();
        const appID = $('#appID').val();

        const formData = {
            _appID: appID,
            name: name
        };


        const url = '/app/update';

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
                    throw new Error('Network response was not oke');
                }
                return response.json();
            })
            .then(data => {
                window.location.href = "/home";
                console.log('Success:', data);

            })
            .catch(error => {
                console.error('Error:', error);
            });


    });



    $('.profile-container').on('click', '#edit-profile-save', function () {
        const firstname = $('#firstname').val();
        const lastname = $('#lastname').val();
        const username = $('#username').val();
        const email = $('#email').val();

        const formData = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email
        };


        const url = '/profile/update';

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
                    throw new Error('Network response was not oke');
                }
                return response.json();
            })
            .then(data => {
                window.location.href = "/home";
                console.log('Success:', data);

            })
            .catch(error => {
                console.error('Error:', error);
            });


    });
});