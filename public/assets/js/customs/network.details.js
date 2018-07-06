"use-strict"
$(".ip-change").click(function(event) {
	$(".ip-change").children().hide('slow');
	$(event.currentTarget).children().fadeIn('slow');
});