/*$(document).ready(function(){
	OnLoad();
});*/
function showDialog(id){
            var dialog = $(id).data('dialog');
            if (!dialog.element.data('opened')) {
                dialog.open();
            } else {
                dialog.close();
            }

        }
    $('.icon-refresh').click(function() {
    	location.reload();
    });
	$(".debug-ref").click(function () {
    var effect = 'slide';

    // Set the options for the effect type chosen
    var options = { direction: "right" };

    // Set the duration (default: 400 milliseconds)
    var duration = 800;

    $('.debugger').toggle(effect, options, duration);
});