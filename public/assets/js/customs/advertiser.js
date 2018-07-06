"use strict"
var inputTags = `<input id="idAff" type="text" class="form-control" name="idAff" placeholder="ID Aff">`;
var regexURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
var select = true;
var ArrSelRequest = []
var ArrSelDelOffers = [];
var link;
var count = 0;
var emailRegular = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/im;
if($(".error-field")){
	$(".error-field").each(function(index, el) {
		if(el==="method"||el==="type"){
			$(`select[name=${el.innerHTML}]`).addClass('bg-danger').attr("placeholder",`Invalid ${el.innerHTML}`)
		}else {
			$(`input[name=${el.innerHTML}]`).addClass('bg-danger').attr("placeholder",`Invalid ${el.innerHTML}`)
		}
	});
}
function getRevenue(){
	$.get('/revenue', function(data) {
		data.forEach((ele,i)=>{
			$(`#${ele._id.name}`).css("width",`${ele.revenue/500*100}%`)
			$(`#${ele._id.name}`).parent().parent().attr("title",`${ele.revenue/500*100}%`)
		})
	});
}
getRevenue();
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
$("#change-type-chat").click((e)=>{
	if($("#change-type-chat").next().attr("name")==="wechatIM"){
		$("#change-type-chat").children('i').removeClass('fa-weixin').addClass('fa-skype');
		$("#change-type-chat").next().attr("name","skypeIM")
	}else{
		$("#change-type-chat").children('i').removeClass('fa-skype').addClass('fa-weixin');
		$("#change-type-chat").next().attr("name","wechatIM")
	}
})
function deleteEvent() {
	$(".request-offer").unbind('click');
}
function clickRequest() {
	$(".request-offer").click(function(event) {
		let cfm = confirm("You definitely want request")
		if(cfm){
			rmEventRequest()
			var indexOfNet = $("#objectID").html();
			$(event.currentTarget).children().removeClass('fa-shopping-cart').addClass('fa-spinner fa-pulse');
			deleteEvent();
			$.post('/autorequestlink', {index : indexOfNet}, function(data, textStatus, xhr) {
				EnableRequest()
				$(event.currentTarget).children().removeClass('fa-spinner fa-pulse').addClass('fa-shopping-cart');
			});
		}
	});
}
function removeOffersMultiNet() {
	$("#removeOffers").click(function(event) {
		let cfm = confirm("You definitely want to delete");
		if(cfm){
			rmEventRequest()
			$(".checkbox-group:checked").each((i, ele)=>{
				ArrSelDelOffers.push($(ele).parent().parent().children(':first').html())
			})
			if(ArrSelDelOffers.length>0){
				$.each(ArrSelDelOffers, (i, ele)=>{
					$.post('/deletenetwork', {index: ele}, function(data, textStatus, xhr) {
						if(data===true){
							$(`tr:contains(${ele})`).parent().remove();
						}
						ArrSelRequest.remove(ele)
						if(ArrSelRequest.length===0){
							EnableRequest()	
						}
					});
				});
			}else{
				alert("Please chosse network")
			}
		}
	});
}
function EnableRequest(){
	clickRequest();
	requestMultiOffers()
	removeOffersMultiNet()
	$(".req-btn").unbind('click');
	$(".req-btn").click(function(event) {
		let cfm = confirm("You definitely want request")
		if(cfm){
			event.stopPropagation();
			rmEventRequest()
			let id = $(event.currentTarget).parent().parent().parent().children('td:first').html()
			$(`tr:contains(${id})`).children(':first').next().next().removeClass('text-warning text-success text-danger').addClass('text-warning')
			requestOffer(id, event, null)
		}
	})
}
function rmEventRequest(){
	$("#removeOffers").unbind('click')
	$(".request-offer").unbind('click')
	$("#requestOffers").unbind('click')
	$(".req-btn").unbind('click');
	$(".req-btn").click(function(event) {
		event.stopPropagation();
	})
}
function requestOffer(ele, eventSingle, eventsMutiple){
		if(eventSingle){
			$(eventSingle.currentTarget).children().removeClass('fa-shopping-cart').addClass('fa-spinner fa-pulse')
		}
		if(eventsMutiple){
			$(eventsMutiple.currentTarget).html("<i class='fa fa-spinner fa-pulse' style='line-height: .5em'></i>")
		}
	$.post('/autorequestlink', {index : ele}, function(data, textStatus, xhr) {
		if(data.status[0]==="Successfully saved MongoDB data!"){
			$(`tr:contains(${ele})`).children(':first').next().next().removeClass('text-warning text-success text-danger').addClass('text-success')
		}else {
			$(`tr:contains(${ele})`).children(':first').next().next().removeClass('text-warning text-success text-danger').addClass('text-danger')
		}
		ArrSelRequest.remove(ele)
		if(eventSingle){
			$(eventSingle.currentTarget).children().removeClass('fa-spinner fa-pulse').addClass('fa-shopping-cart')
		}
		if(eventsMutiple){
			$(eventsMutiple.currentTarget).html("Request")
		}
		if(ArrSelRequest.length===0){
			EnableRequest()		
		}
		setTimeout(()=>{
			$(`tr:contains(${ele})`).children(':first').next().next().removeClass('text-warning text-success text-danger')
		}, 3000)
	});
}
function requestMultiOffers(){
	$("#requestOffers").click(function(event) {
		let cfm = confirm("You definitely want request")
		if(cfm){
			rmEventRequest()
			$(".checkbox-group:checked").each((i, ele)=>{
				ArrSelRequest.push($(ele).parent().parent().children(':first').html())
			})
			if(ArrSelRequest.length>0){
				$.each(ArrSelRequest, (i, ele)=>{
					$(`tr:contains(${ele})`).children(':first').next().next().removeClass('text-warning text-success text-danger').addClass('text-warning')
					requestOffer(ele, null, event)
				});
			}else{
				alert("Please chosse network")
			}
		}
	});
}
function addInputLinks (count) {
	var eleName = `#api_path-${count}`;
	$(eleName).focusout(function(event) {
		var link = $(eleName).children('input:first').val();
		var con = regexURL.test(link.split("\n").join("").split("\t").join(""));
		if(con===true){
			$(eleName).unbind('focusout');
			count++;
			var html = `<div class="input-group" id="api_path-${count}">
			              <span class="input-group-addon" style="width: 40px;"><i class="fa fa-link"></i></span>
			              <input autocomplete="off" type="text" class="form-control" name="link" placeholder="Link API ${count+1}">
			            </div>`;
			$(event.currentTarget).after(html)
			$(event.currentTarget).next().children('input').focus()
			addInputLinks(count)
		}
	});
}
function Details(){
	$(".show-full-details").click(function(event) {
		var query = {
			index : $(event.currentTarget).children(":first").html()
		}
		deleteDetails()
		$.post('/detail/network', query, function(data, textStatus, xhr) {
			if(data){
				$("body").css("overflow", "hidden")
				$("#full-details").fadeIn();
				$("#objectID").html(data._id);
				$("#index-network").html(`#${$(event.currentTarget).children(':first').next().html()}`);
				$("#name-title").html(`${data.name.toUpperCase()}`);
				$("#name-title").attr("href",`http://128.199.163.213/network/details?id=${data._id}`);
				$("#email").html(`${data.email}`);
				if(data.description){
					$("#set-description").html(data.description)
				}else{
					$("#set-description").html("No Description")
				}
				var chat;
				if(data.wechatIM){
					chat = `<a href="weixin://dl/chat?${data.wechatIM}">${data.wechatIM}</a>`;
					$("#icon-chat").append("<i class='fa fa-weixin' style='color:#5ec942; line-height: 2em;'/>&emsp;Wechat IM")
				}else{
					$("#icon-chat").append("<i class='pd-left fa fa-skype' style='color: #4CACEC'/>&emsp; Skype IM")
					chat = `<a href="skype:${data.skypeIM}?call">${data.skypeIM}</a>`;
				}
				$("#AM-chat").html(`<a href="skype:${data.AM}?call">${data.AM}</a>`);
				$("#chatIM").html(`${chat}`);
				$("#postback").html(`${data.postback}`);
				$("#payoutSet-2").html(`$${data.paySet}`);
				$("#method").html(`${data.method.toUpperCase()}`);
				$("#type").html(`${data.type.toUpperCase()}`);
				$("#link").html(`${data.link}`);
				$("#total").html(`${data.total}`);
				Details()
			}
		});
	});
}
function deleteDetails() {
	$(".show-full-details").unbind('click')
}
Details()
EnableRequest()
addInputLinks(count)
function validate(){
	var arrErr = [];
	if(!(/^[A-Za-z][A-Za-z0-9]*$/.test($("#networkName").val()))||$("#networkName").val()===""){
		arrErr.push({
			mgs : "Invalid name",
			location : "networkName"
		})
	}
	if(!(emailRegular.test($("#emailadd").val()))||$("#emailadd").val()===""){
		arrErr.push({
			mgs : "Invalid email",
			location : "emailadd"
		})
	}
	if (!(/([a-zA-Z-0-9])\w+/.test($("#password").val()))||$("#password").val()==="") {
		arrErr.push({
			mgs : "Invalid password",
			location : "password"
		})
	}
	if($("#postbackadd").val()===""){
		arrErr.push({
			mgs : "Invalid post back",
			location : "postbackadd"
		})
	}
	if($("#AM").val()===""||!(/([a-zA-Z-0-9])\w+/.test($("#AM").val()))){
		arrErr.push({
			mgs : "Invalid AM",
			location : "AM"
		})
	}
	if($("#IM").val()===""||!(/([a-zA-Z-0-9])\w+/.test($("#IM").val()))){
		arrErr.push({
			mgs : "Invalid IM",
			location : "IM"
		})
	}
	return arrErr;
}
$("#formAddNet").submit(function(event) {
	$("#formAddNet").children().children("input").each(function(index, el) {
		$(el).removeClass('error-field')
	});
	var arrLink = [];
	var errorLink = validate();
	$("input[name='link']").each((i,el)=>{
		if(!(regexURL.test($("#linkAPI").val()))||$("#linkAPI").val()===""){
			errorLink.push({
				mgs : "Invalid link",
				location : "linkAPI"
			})
		}else if(regexURL.test($(el).val())&&$(el).val()!==""){
			arrLink.push($(el).val())
		}else if($(el).val()===""){
			$(el).remove()
		}
	})
	if(errorLink.length===0){
		$("#formAddNet").submit();
		return true;
	}else{
		$.each(errorLink, function(index, val) {
			$(`#${val.location}`).addClass('error-field')
		});
		return false;
	}
});
$("#selectAll").click(function(event) {
	$(".checkbox-group").prop('checked', select);
	select = !select;
});
$(".checkbox-group").click(function(event) {
	event.stopPropagation();
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
$("#type-net").change(function(event) {
	if($(event.currentTarget).val()==="hasoffer"){
		$("#ele-type-network").append(inputTags)
	}else{
		$("#idAff").remove();
	}
});
$(".details-btn").click(function(event) {
	event.stopPropagation();
	window.open(`/network/details?id=${$(event.currentTarget).parent().parent().parent().children('td:first').html()}`);
})
$(".del-btn").click(function(event) {
	event.stopPropagation();
	let cfm = confirm("You definitely want to delete")
	if(cfm){
		$.post('/deletenetwork', {index: $(event.currentTarget).parent().parent().parent().children('td:first').html()}, function(data, textStatus, xhr) {
			if(data){
				$(event.currentTarget).parent().parent().parent().remove();
			}
		});
	}
});