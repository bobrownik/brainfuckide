
$('.files > a').click(function(){
    $('span.icon').removeClass('f-jpg').addClass('f-doc');
    $(this).children('.icon').addClass('f-jpg');
    $.ajax({
        method: 'GET',
        data: {name: $(this).text()},
        url: '/filecontent',
        success: function(response) {
           $('#code').val(response.content.replace(/\s{2,10}/g, ' '));
       }
    });

    // $http({
    //     method: 'GET',
    //     data: {name: $(this).text().replace(/\s+/g, '')},
    //     url: '/filecontent'
    // }).then(function successCallback(response) {
    //     $('#code').html(response);
    //     console.clear();
    //     console.log();
    // }, function errorCallback(response) {
    // });
});

function showDialog(id){
    var dialog = $(id).data('dialog');
    if (!dialog.element.data('opened')) {
        dialog.open();
    } else {
        dialog.close();
    }
}

	$(".debug-ref").click(function () {
    var effect = 'slide';

    // Set the options for the effect type chosen
    var options = { direction: "right" };

    // Set the duration (default: 400 milliseconds)
    var duration = 800;

    $('.debugger').toggle(effect, options, duration);
});