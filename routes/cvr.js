var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/:value', function(req, res, next) {
	if(req.params.value==="cvr"){
		try {
			mongo.connect(pathMongodb, (err, db)=>{
				db.collection("conversion").aggregate([{$group : {"_id" : {idOfferNet: "$idOfferNet", networkName:"$networkName", country: "$country"}}}], (err,result)=>{
					if(!err){
						var queryArr = [];
						for (var i = 0; i < result.length; i++) {
							queryArr.push({$and : [{"idOfferNet" : result[i]._id.idOfferNet, "networkName" : result[i]._id.networkName, "country" : result[i]._id.country}]});
						}
						db.collection("report").aggregate([{$match:{$or:queryArr}}, {$group:{_id:{_id:"$idOffer", idOfferNet: "$idOfferNet", networkName:"$networkName", country: "$country"}, count :{$sum:1}}}],(err, report)=>{
							db.collection("conversion").aggregate([{$match:{$or:queryArr}}, {$group:{_id: {_id:"$idOffer", idOfferNet: "$idOfferNet", networkName:"$networkName", country: "$country"}, ip:{$push:"$ip"}, count :{$sum:1}}}],(err, conversion)=>{
								var dataCVR = [];
								for (let i = 0; i < conversion.length; i++) {
									for(let j = 0; j < report.length; j++){
										if(conversion[i]._id._id===report[j]._id._id&&conversion[i]._id.idOfferNet===report[j]._id.idOfferNet&&conversion[i]._id.networkName===report[j]._id.networkName&&report[j]._id.country===conversion[i]._id.country){										
											dataCVR.push({"index" : conversion[i]._id._id, 
															"cvr" : parseFloat(Math.round(conversion[i].count/report[j].count*100))+"%", 
												        "country" : conversion[i]._id.country,
													"nameNetwork" : conversion[i]._id.networkName,
													 "idOfferNet" : conversion[i]._id.idOfferNet
													})
											break;
										}
									}
								}
								var queryFindInfoApp = [];
								for (let i = 0; i < dataCVR.length; i++) {
									queryFindInfoApp.push(Number(dataCVR[i].index));
								}
								db.collection("offer").find({"index" : {$in: queryFindInfoApp}}).toArray((err, data)=>{
									if(!err){
										var responseData = [];
										for (let i = 0; i < data.length; i++) {
											for(let j = 0; j < dataCVR.length; j++){
												if(Number(dataCVR[j].index) === data[i].index&&dataCVR[j].nameNetwork.toLowerCase()===data[i].nameNetworkSet.toLowerCase()&&Number(data[i].offeridSet)===Number(dataCVR[j].idOfferNet)){
													var dataSub = {};
													dataSub.index = data[i].index;
													dataSub.imgSet = data[i].imgSet;
													dataSub.nameNetworkSet = data[i].nameNetworkSet;
													dataSub.platformSet = data[i].platformSet;
													dataSub.categorySet = data[i].categorySet;
													dataSub.nameSet = data[i].nameSet;
													dataSub.urlSet = data[i].urlSet;
													dataSub.paySet = data[i].paySet;
													dataSub.offerType = data[i].offerType;
													dataSub.prevLink = data[i].prevLink;
													dataSub.countrySet = dataCVR[j].country;
													dataSub.cvr = dataCVR[j].cvr;
													dataSub.memberLink = `http://${req.headers.host}/checkparameter/?offer_id=${data[i].index}&aff_id=181879769070526`;
													dataSub.adminLink = `http://${req.headers.host}/click/?offer_id=${data[i].index}`;
													responseData.push(dataSub);
													break;
												}
											}
										}
										db.close();
										res.send(responseData)
									}else{
										db.close();
										res.redirect("/")
									}
								})
							});
						});
					}
				})
			})
		} catch(e) {
			console.log(e);
		}
	}else{
		res.send("error")
	}
});

module.exports = router;