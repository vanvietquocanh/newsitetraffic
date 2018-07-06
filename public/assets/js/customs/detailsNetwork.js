$(".showmore").click((event)=>{
    if($(event.currentTarget).parent().css("overflow")==="hidden"){
        $(event.currentTarget).parent().css("overflow","visible")
    }else{
        $(event.currentTarget).parent().css("overflow","hidden")
    }
})
$(".btn-editor").click(function(event) {
    var dataUpdate = prompt(`Edit ${($(event.currentTarget).parent().parent().children('p').text())?$(event.currentTarget).parent().parent().children('p').text():$(event.currentTarget).parent().parent().parent().children('p').text()} Network`, $(event.currentTarget).parent().text());
    if(dataUpdate){
    	var data = {};
        if($(event.currentTarget).parent().parent().parent().children('p').text()==="link"){
            data.link = []
            $(".linksNet").each(function(index, el) {
                data.link.push($(el).text())
            });
            $.each(data.link, function(index, val) {
                if(val===$(event.currentTarget).parent().text()){
                    data.link[index] = dataUpdate;
                }
            });
        }else{
    	   data[`${$(event.currentTarget).parent().parent().children('p').text()}`] = dataUpdate; 
        }
        console.log(data)
	    $.post('/updatenetwork', data, function(data, textStatus, xhr) {
            if(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(data)){
                window.location.href = (data)
            }else{
                alert(data);
            }
	    });
    }
});
$("#show-more").click(function(event) {
    var network = $(".full-info-container-content-title").text().split(/#+[0-9]/)[1].toLowerCase();
    window.location.href = `http://${window.location.host}/offers?filter=conversion&network=${network}&page=1`;
});