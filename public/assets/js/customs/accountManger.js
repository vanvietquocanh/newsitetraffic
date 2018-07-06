"use strict"
function getRevenue(){
	$.get('/revenue', function(data) {
		data.forEach((ele,i)=>{
			$(`#${ele._id.name}`).css("width",`${ele.revenue/500*100}%`)
			$(`#${ele._id.name}`).parent().parent().attr("title",`${ele.revenue/500*100}%`)
		})
	});
}
getRevenue();
var regexURL = new RegExp("https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)", "i");
$("#change-type-chat").click((e)=>{
	if($("#change-type-chat").next().attr("name")==="wechatIM"){
		$("#change-type-chat").children('i').removeClass('fa-weixin').addClass('fa-skype');
		$("#change-type-chat").next().attr("name","skypeIM")
	}else{
		$("#change-type-chat").children('i').removeClass('fa-skype').addClass('fa-weixin');
		$("#change-type-chat").next().attr("name","wechatIM")
	}
})
$(".show-full-details").click(function(event) {
	var query = {
		index : Number($(event.currentTarget).children(':first').next().html())
	}
	$.post('/infoaccount', query, function(data, textStatus, xhr) {
		if(data){
			$("body").css("overflow", "hidden")
			$("#full-details").fadeIn();
			$("#index-user").html(`#${data.idFacebook}`);
			$("#name-account").html(`${data.profile.displayName.toUpperCase()}`);
			$("#name-title").attr("href",`http://128.199.163.213/network/details?id=${data.idFacebook}`);
			$("#set-img").attr("src",`${data.profile.photos["0"].value}`);
		}
	});
});
$(".call-skype").click(function(event) {
	event.stopPropagation();
});
$("#clickCurrent").click(function(event) {
	$("#submitFormAddNet").click();
});
$("#close-btn").click(function(event) {
	$("#icon-chat").empty();
	$("#full-details").hide();

	$("body").css("overflow", "auto")
});
$("#net-detail").click(function(event) {
	window.open($("#name-title").attr("href"));
});
$("#close-details-app").click(function(event) {
	$("#close-btn").click();
});
$("body").keydown(function(event) {
	if(event.key === "Escape"||event.keyCode===27){
		$("#close-btn").click();	
	}
});
$("#filter").click(function(event) {
	if($(event.currentTarget).children(':last').attr("class")==="fa fa-angle-down"){
		$(event.currentTarget).children(':last').removeClass('fa-angle-down').addClass('fa-angle-up')
		$(".content-options").css({
			"display" : "flex",
			"height"  : "100%"
		})
	}else{
		$(event.currentTarget).children(':last').removeClass('fa-angle-up').addClass('fa-angle-down')
		$(".content-options").css({
			"display" : "none",
			"height"  : "0"
		})
	}
});