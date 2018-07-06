const pathMongodb = require("./pathDb");
const insertNewDB = new InsertNewDB();
const fs = require("fs");
function InsertNewDB(){
	this.textWrite = "";
};
InsertNewDB.prototype.writeFileText = function(db, req, res, ArrReq, length) {
	db.collection("offer").find().toArray((err, result)=>{
		if(!err){
			if(result!==undefined){
				result.forEach( function(element, index) {
					var countryFix;
					if(element.countrySet.length>3){
						countryFix = element.countrySet.toString().split("|").join(',');
					}else{
						countryFix = element.countrySet;
					}
					insertNewDB.textWrite += `http://${req.headers.host}/click/?offer_id=${element.index}|${countryFix}|${element.platformSet.toUpperCase()}|${element.nameNetworkSet.toLowerCase()}\r\n`;
				});
			}
			fs.writeFile("OfferList.txt", insertNewDB.textWrite, (err)=>{
				if(err){
					throw err;
					db.close();
				}else {
					db.close();
					ArrReq.push("Successfully saved MongoDB data!");
					if(ArrReq.length===length){
						res.send({status:ArrReq})
					}
				}
			});
		}
	})
};
InsertNewDB.prototype.insert = function (db, data, req, res, ArrReq, length){
	if(data.length>0){
		db.collection("offer").find().sort({index:-1}).limit(1).toArray((err, result)=>{
			if(!err){
				if(result.length>0){
					data.forEach( function(element, i) {
						result[0].index++;
						data[i].index = result[0].index;
					});
				}else{
					var index = 0;
					data.forEach( function(element, i) {
						index++;
						data[i].index = index;
					});
				}
				db.collection("offer").insert(data, { ordered: false }, (err,result)=>{
					insertNewDB.writeFileText(db, req, res, ArrReq, length);
				})		
			}else{
				ArrReq.push(err)
				if(ArrReq.length===length){
					res.send({status:ArrReq})
				}
			}					
		})
	}else{
		ArrReq.push("No Data");
		if(ArrReq.length===length){
			res.send({status:ArrReq})
		}
	}
}
module.exports = insertNewDB;