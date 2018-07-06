var requestOrangear = new RequestOrangear();
var insertDB = require("./module.insertNewDB");
var request = require("request");

function RequestOrangear() {
	this.regularAndroid = new RegExp(/market|play.google.com/,"i");
	this.regexID = /id=+([A-Za-z])+\.+([A-Za-z.])+|id+[0-9]+/
	this.regularIOS = new RegExp("itunes|apple","i");
}
RequestOrangear.prototype.setKeyValues = function(key, data, nameNetwork){
	var dataReturn = [];
	key.forEach((ele, i)=>{
		var offers = {};
		offers.offeridSet = data[ele].ID;
		offers.platformSet = (requestOrangear.regularAndroid.test(data[ele].Preview_url))?"android":"ios",
		offers.nameSet = data[ele].Original_name;
		offers.urlSet = data[ele].Tracking_url;
		offers.paySet = parseFloat(data[ele].Payout);
		offers.countrySet = data[ele].Countries;
		offers.prevLink = data[ele].Preview_url;
		offers.descriptionSet = data[ele].Description;
		offers.nameNetworkSet = nameNetwork;
		offers.typeNetwork = "orangear";
		offers.capSet = data[ele].Daily_cap;
		offers.offerType = data[ele].Type;
		offers.imgSet = data[ele].Icon_url;
		offers.isNetwork = true;
		dataReturn.push(offers);
	})
	return dataReturn;
};
RequestOrangear.prototype.request = function(method, link, db, networkName, req, res, ArrReq, length) {
	try {
		request[method.toLowerCase()]({
		    url : link
		}, function (err, respon) {
			if(respon.body.indexOf("<html>")===-1){
				try {
					var data = JSON.parse(respon.body).offers;
				} catch(e) {
					db.close()
					ArrReq.push(e);
					if(ArrReq.length===length){
						res.send({status:ArrReq})
					}
				}
				if(data){
					var keyObject = Object.keys(data);
					insertDB.insert(db, requestOrangear.setKeyValues(keyObject, data, networkName), req, res, ArrReq, length);
				}else{
					db.close();
					ArrReq.push("error");
					if(ArrReq.length===length){
						res.send({status:ArrReq})
					}
				}
			}else{
				db.close();
				ArrReq.push("error");
				if(ArrReq.length===length){
					res.send({status:ArrReq})
				}
			}
		});
	} catch(e) {
		assert.equal(null,err);
		db.close();
		ArrReq.push("error");
		if(ArrReq.length===length){
			res.send({status:ArrReq})
		}
	}
};

module.exports = requestOrangear;