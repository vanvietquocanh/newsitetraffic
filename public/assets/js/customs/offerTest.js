jQuery(document).ready(function($) {
	$("#btn-test").click(function(event) {
		var data = {
			Url       : $("#link").val(),
			OS        : $("#os").val(),
			Country   : $("#country").val(),
			Ipaddress : "113.160.224.195",
			"Pass"    : "quynguyen",
			"User"    : "quynguyen",
			"Domain"  : "http://rockettraffic.org"
		}
		console.log(data)
		$.post('http://113.160.224.195/api/Offer', data, function(data, textStatus, xhr) {
			console.log(data, textStatus, xhr)
		});
	});
});