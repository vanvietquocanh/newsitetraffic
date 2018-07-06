var requestHasOffer = new RequestHasOffer();
var request = require("request");
var getIdApp = require("./module.checkIconApp");
const countryList = require("./listcountry");
var insertDB = require("./module.insertNewDB");

function RequestHasOffer() {
	this.regularAndroid = new RegExp(/market|play.google.com/,"i");
	this.regex = /[A-Z]{2}\/[A-Z]{2}/
	this.regex2 = /[A-Z]{2}\,[A-Z]{2}/
	this.regex3 = /[A-Z]{2}\*|[A-Z]{2}\*\*/
}
RequestHasOffer.prototype.setKeyValues = function(key, data, networkName, db, id, req, res, ArrReq){
	var dataReturn = []
	key.forEach( function(element, index) {
		if(!(/APK/.test(data[element].Offer.name))){
			var dataOffer = {
				"offeridSet"  	 : data[element].Offer.id,
				"platformSet"    : (requestHasOffer.regularAndroid.test(data[element].Offer.preview_url))?"android":"ios",
				"nameSet"    	 : data[element].Offer.name,
				"urlSet"	 	 : `http://${networkName}.go2cloud.org/aff_c?offer_id=72284&aff_id=${id}`,
				"paySet" 		 : parseFloat(data[element].Offer.default_payout),
				"countrySet"     : data[element].Offer.name.split("[").join("").split("]").join("").split("\t").join(" ").split("_").join(" ").split("-").join(" ").split(",").join(" ").split("\t").join(" ").split("(").join(" ").split(")").join(" ").split(":").join(" ").split(" "),
				"prevLink" 	 	 : data[element].Offer.preview_url,
				"descriptionSet" : "",
				"nameNetworkSet" : networkName.toLowerCase().trim().split("\t").join(""),
				"typeNetwork"    : "hasOffer",
				"capSet"	     : data[element].Offer.payout_cap,
				"isNetwork"		 : true,
				"offerType" 	 : data[element].Offer.payout_type,
				"imgSet"	 	 : getIdApp(data[element].Offer.preview_url)
			}
			var country = dataOffer.countrySet.filter( function(element, index) {
				return countryList.indexOf(element)!==-1;
			});
			if(country.length===0){
				if(dataOffer.countrySet.indexOf("UAE")!==-1){
					country = "AE";
				}else if(dataOffer.countrySet.indexOf("WW")!==-1){
					country = countryList.toString();
				}else if(requestHasOffer.regex3.test(dataOffer.countrySet)){
					dataOffer.countrySet.forEach((el, index)=>{
						if(requestHasOffer.regex3.test(el)){
							country = el.split("*").join("").split("*").join("");
						}
					})
				}else{
					countryList.forEach( function(element, index) {
						for (var i = 0; i < dataOffer.countrySet.length; i++) {
							if(requestHasOffer.regex.test(dataOffer.countrySet[i])||requestHasOffer.regex2.test(dataOffer.countrySet[i])){
								if(requestHasOffer.regex.test(dataOffer.countrySet[i])){
									country = dataOffer.countrySet[i].split("/").join("|");
									break;
								}else{
									country = dataOffer.countrySet[i].split(",").join("|");
									break;
								}
							}
						}
					});
				}
			}
			dataOffer.countrySet = country.toString();
			if(dataOffer!==undefined){
				dataReturn.push(dataOffer);
			}
		}
	});
	return dataReturn;
};
RequestHasOffer.prototype.request = function(method, link, db, networkName, id, req, res, length) {
	request[method.toLowerCase()]({
		url : link
	},(err, response)=>{
		if(response.body.indexOf("<html>")===-1&&response.body){
			var keyObject = Object.keys(JSON.parse(response.body).response.data);
			var data      = JSON.parse(response.body).response.data;
			insertDB.insert(db, requestHasOffer.setKeyValues(keyObject, data, networkName, db, id, req, res), req, res, ArrReq, length);
		}else{
			db.close();
			ArrReq.push("Error")
			if(ArrReq.length===length){
				res.send({status:ArrReq})
			}
		}
	})
};
module.exports = requestHasOffer;