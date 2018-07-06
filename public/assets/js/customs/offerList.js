'use strict';
var sortItems = new SortItems;
var iconClose = $("#btn-close-search-form");
var filter = $("#filter");
var bodyContent = $("#ele-add-Form-search");
var offerType = $("#offertype");
var selectAll = $("#select-all");
var offerItems = $(".offerItems");
var sortTypeEle = $("#sortType");
var closeDetailsApp = $("#close-details-app");
var html = $("#form-advance-filter");
var searchQuery = /search=+[a-zA-Z0-9]+/;
var sortQuery = /sort=+[a-zA-Z0-9]+/;
var sortTypeQuery = /sorttype=+(-)?[a-zA-Z0-9]+/;
var offerTypeQuery = /offertype=+[a-zA-Z]+/;
var pathLocal = window.location.href;
var select = true;
if(searchQuery.test(pathLocal)){
	$("#search").val(pathLocal.match(searchQuery)[0].split("=")[1])
	$("#form-advance-filter").prepend(`<input name='search' value='${pathLocal.match(searchQuery)[0].split("=")[1]}' id="search-query" style='display: none'/>`)
}
if(offerTypeQuery.test(pathLocal)){
	$("#offertype").val(`${pathLocal.match(offerTypeQuery)[0].split("=")[1]}`)
	$("#form-advance-filter").prepend(`<input name='offertype' value='${pathLocal.match(offerTypeQuery)[0].split("=")[1]}' id="offertype-query" style='display: none'/>`)
}
if(sortQuery.test(pathLocal)){
	$("#sort").val(pathLocal.match(sortQuery)[0].split("=")[1])
	if(sortTypeQuery.test(pathLocal)){
		if(pathLocal.match(sortTypeQuery)[0].split("=")[1]==="-1"){
			$("#sort-form").prepend("<input name='sorttype' value='1' style='display: none'/>")
			$("#form-advance-filter").prepend(`<input name='offertype' value='${pathLocal.match(sortQuery)[0].split("=")[1]}' id="sort-query" style='display: none'/>`)
		}else{
			$("#sort-form").prepend("<input name='sorttype' value='-1' style='display: none'/>")
			$("#form-advance-filter").prepend(`<input name='offertype' value='${pathLocal.match(sortQuery)[0].split("=")[1]}' id="sort-query" style='display: none'/>`)
		}
	}else{
		$("#sort-form").prepend("<input name='sorttype' value='1' style='display: none'/>")
		$("#form-advance-filter").prepend(`<input name='offertype' value='${pathLocal.match(sortQuery)[0].split("=")[1]}' id="sort-query" style='display: none'/>`)
	}
}
$("#form-advance-filter").remove();
$("#search").change(function(event) {
	$("#search-query").val(`${$("#search").val()}`)
});
$("#offertype").change(function(event) {
	$("#offertype-query").val(`${$("#offertype").val()}`)
});
$("#sort").change(function(event) {
	$("#sort-query").val(`${$("#sort").val()}`)
});
filter.click(function(event) {
	if($("#form-advance-filter")[0]===undefined){
        bodyContent.append(html[0]);
        $("#form-advance-filter").css("display","block")
		$(".char-nav-blue").hide('slow');
		$(".content-search").css("width","96%");
		$(".block-img").css("margin-top","1em");
		$("#search").css("margin-left","1.5em");
		$(".select-all").css("margin-right","0em");
		$("#btn-close-search-form").click(function(event) {
			$("#form-advance-filter").remove();
			if($(window).width()>1024){
				$(".block-img").css("margin-top","1em");				
				$(".content-search").css("width","50%");
				$(".select-all").css("margin-right","3em");
				$(".char-nav-blue").fadeIn('slow');
			}
		});
	}
});
selectAll.click(function(event) {
	$(".checkbox-group").prop('checked', select);
	select = !select;
});
offerType.change(function(event) {
	console.log('asdasdasd')
	$("#sort-form").submit()
});
function SortItems() {
}
SortItems.prototype.reqAPIApp = function(data, event){
	try {
		$.post('/userpost', data, function(data, textStatus, xhr) {
			if(data=="ok"){
			}
		});
	} catch(e) {
		sortItems.reqAPIApp(data, event)
	}
}
closeDetailsApp.click(function(event) {
	$("#full-details").hide();
	$("body").css("overflow", "auto")
});	
$(".box-green").click(function(event) {
	event.stopPropagation();
	var itemsClick = $(`.${$(event.target).parent().parent().parent().attr("class").split("content-info flex-left last-info line-1366 ")[1].split(" ")[0]}`);
	if(itemsClick.attr("class").indexOf("active")!==-1){
		itemsClick.children().children('ul').children().fadeOut("slow");
		itemsClick.removeClass('active')
	}else{
		itemsClick.addClass('active')
		itemsClick.children().children('ul').children().fadeIn("slow");
	}
});
$(".select-country").click(function(event) {
	event.stopPropagation();
	window.location.href = `http://${window.location.host}/offers?country=${$(event.currentTarget).html().toLowerCase()}&page=1`;
});
$(".name-net-click-search").click(function(event) {
	event.stopPropagation();
	window.location.href = `http://${window.location.host}/offers?network=${$(event.currentTarget).html().toLowerCase()}&page=1`;
});
$(".offerType-find").click(function(event) {
	event.stopPropagation();
	window.location.href = `http://${window.location.host}/offers?offertype=${$(event.currentTarget).html().toLowerCase()}&page=1`;
});
$(".paytext").click(function(event) {
	event.stopPropagation();
	window.location.href = `http://${window.location.host}/offers?payMin=${$(event.currentTarget).html().toLowerCase().split("$").join("")}&page=1`;
});
$(".checkbox").click(function(event) {
	event.stopPropagation();
});
$(".find-category").click(function(event) {
	event.stopPropagation();
	window.location.href = `http://${window.location.host}/offers?category=${$(event.currentTarget).html().toLowerCase()}&page=1`;
});
$("#full-details").click(function(event) {
	closeDetailsApp.click();
});
$("#close-btn").click(function(event) {
	closeDetailsApp.click();
});
$("body").keydown(function(event) {
	if($("#full-details").css("display")!=="none"&&event.keyCode===27&&event.key==="Escape"){
		closeDetailsApp.click();
	}
});
offerItems.click(function(event) {
	var query = {
		index : $(event.currentTarget).children(".block-img").children(".respon-checkbox").children().children("input").val()
	}
	console.log(query)
	$.post('/detail/offer', query, function(data, textStatus, xhr) {
		if(data){
			console.log(data)
			$("body").css("overflow", "hidden")
			$("#full-details").fadeIn();
			$("#index-app").html(`#${data.index}`);
			$("#name-app-val").html(`${data.nameSet}`);
			$("#name-app-val").attr("href",`${window.location.origin}/offer/details?id=${data._id}`);
			$("#set-img").attr("src",`${data.imgSet}`);
			$("#set-description").html(`${data.descriptionSet.split(";").join("<br/>")}`);
			$("#setPay").html(`$${data.paySet}`);
			$("#payoutSet-2").html(`$${data.paySet}`);
			$("#setPlatform").html(`${data.platformSet.toUpperCase()}`);
			$("#platform-set-2").html(`${data.platformSet.toUpperCase()}`);
			var country = "";
			data.countrySet.split(/\,|\|/).forEach( function(element, index) {
				country += `<span class="text-block country-box content-box-country-fix">${element.toUpperCase()}</span>`;
			});
			$("#setCountry").html(country);
			$("#country-Set-2").html(country);
			var category = "";
			if(data.categorySet){
				data.categorySet.split(",").forEach( function(element, index) {
					category += `<span class="boxcategory box-details-sub hidden-text-wrap">${element}</span>`
				});
			}
			$("#setCategory").html(category);
			$("#setPrevLink").attr("href",data.prevLink);
		}
	});
});
$(".off-detail").click(function(event) {
	window.open($("#name-app-val").attr("href"));
});
$(".prelink").click(function(event) {
	event.stopPropagation();
});
$("#bgr-details-show").click(function(event) {
	event.stopPropagation();
});
$(".checkbox-group").click(function(event) {
	event.stopPropagation();
});
function showGoals(){
	$(".Goals").click(function(event) {
		$(".Goals").unbind('click');
		if($(".hidden-Goals").css("height")==="0px"){
			$(".hidden-Goals").css("height","9em");
			setTimeout(function() {
				$(".hidden-Goals").css({"opacity":"1", "display": "block"});
				showGoals();
			}, 200);
		}else{
			$(".hidden-Goals").css({"opacity":"0", "display": "none"});
			setTimeout(function() {
				$(".hidden-Goals").css("height","0px");
				showGoals();
			}, 200);
		}
	});
}
showGoals();
$(".btn-cp-mt-ls").click(function(event) {
	event.stopPropagation();
	let linkText = $(event.currentTarget).parent().children("p").text();
	var eleAddTxt = $(event.currentTarget).parent();
	var $tagCp = $("<input/>");
	eleAddTxt.append($tagCp);
	$tagCp.val(linkText).select();
	document.execCommand("copy");
	$tagCp.remove();
	eleAddTxt.append('<span class="delete-sp-cp" style="color: #95a5a6; margin-right: 15px;">Copied</span>');
	setTimeout(()=>{
		$(".delete-sp-cp").remove();
	}, 500);
});
$(".btn-content-request").click(function(event) {
	$(`.${event.currentTarget.classList[1]}`).unbind('click');
	$(`.${event.currentTarget.classList[1]}`).children("i").removeClass('fa-shopping-cart').addClass('fa-spinner fa-pulse');
	$(`.${event.currentTarget.classList[1]}`).css("background","#10c469");
	$(`.${event.currentTarget.classList[1]}`).children("p").html("Pending");
	var data = {
		offerId : Number(event.currentTarget.classList[1].split("requestapp-")[1])+1
	}
	sortItems.reqAPIApp(data, event)
});