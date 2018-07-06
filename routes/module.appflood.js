var requestAppflood = new RequestAppflood();
var request = require("request");
var insertDB = require("./module.insertNewDB");
function RequestAppflood() {
	this.textWrite = "";
}
RequestAppflood.prototype.setKeyValues = function(data, networkName){
	data.forEach( function(element, index) {
		data[index].offeridSet = element.offerid;
		delete data[index].offerid;
		data[index].platformSet = element.platform;
		delete data[index].platform;
		data[index].imgSet = element.icon_url;
		delete data[index].icon_url;
		data[index].nameSet = element.app_name;
		delete data[index].app_name;
		data[index].urlSet = element.offer_url;
		delete data[index].offer_url;
		data[index].paySet = parseFloat(element.payout);
		delete data[index].payout;
		data[index].capSet = element.daily_cap;
		delete data[index].daily_cap;
		data[index].categorySet = element.category;
		delete data[index].category;
		data[index].offerType = element.pricetype;
		delete data[index].pricetype;
		data[index].prevLink = element.preview_url;
		delete data[index].preview_url;
		data[index].countrySet = element.geo;
		delete data[index].geo;
		data[index].descriptionSet = element.offer_description;
		delete data[index].offer_description;
		data[index].typeNetwork = "appflood";
		data[index].isNetwork = true;
		data[index].nameNetworkSet = networkName.toLowerCase().trim().split("\t").join("");
	});
	return data;
};
RequestAppflood.prototype.request = function(method, link, db, networkName, req, res, ArrReq, length) {
	request[method.toLowerCase()]({
		url : link
	},(err, response)=>{
		if(response){
			if(response.body.indexOf("<html>")===-1){
				try {
					var data = JSON.parse(response.body);
				} catch(e) {
					db.close();
					ArrReq.push("Error");
					var data = {
						offers : []
					}
					if(ArrReq.length===length){
						res.send({status:ArrReq})
					}
				}
				if(data.offers.length>=0){
					insertDB.insert(db, requestAppflood.setKeyValues(data.offers, networkName), req, res, ArrReq, length)
				}else{
					db.close();
					ArrReq.push("No Data")
					if(ArrReq.length===length){
						res.send({status:ArrReq})
					}
				}
			}else{
				db.close();
				ArrReq.push("Error")
				if(ArrReq.length===length){
					res.send({status:ArrReq})
				}
			}
		}else{
			db.close();
			ArrReq.push("Error")
			if(ArrReq.length===length){
				res.send({status:ArrReq})
			}
		}
	})
};

module.exports = requestAppflood;