$(document).ready(function() {
    // this code selects all inputs and makes it so you are able to click unclick them after being clicked
    // make sure to add attribute radioWave = false to every radio so it works.
    $('input[type="radio"]').on('click', function() {
        ($(this).attr('radioWave') == "false") ? $(this).prop('checked', true).attr('radioWave', true) : $(this).prop('checked', false).attr('radioWave', false);
    });







  






  });