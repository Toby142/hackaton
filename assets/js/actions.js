$(document).ready(function(){
    
    $('.bottom').on('click', '.trash', function() {
        const name = $(this).attr('id');
        const formData = {
            name: name
          };
          

        const url = '/users/delete';
        
        const options = {
            method: 'DELETE',
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
            $(`.user:has(#${id})`).remove();
        
            console.log('Success:', data);
            
        })
        .catch(error => {
            console.error('Error:', error);
        });


    });

});