
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
});

function showDialog(id){
    var dialog = $(id).data('dialog');
    if (!dialog.element.data('opened')) {
        dialog.open();
    } else {
        dialog.close();
    }
}