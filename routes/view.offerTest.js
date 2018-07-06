var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
		mongo.connect(pathMongodb, (err, db)=>{
			db.collection("userlist").findOne({"idFacebook": req.user.id }, (err, result)=>{
				if(!err){
					db.collection("conversion").aggregate([
						{
							$group : {
								"_id" : {
									idOfferNet: "$idOfferNet", 
									networkName:"$networkName", 
									appName:"$appName", 
									platform:"$platfrom", 
									country:"$country", 
									ip:"$ip", 
									pay:"$pay", 
									index:"$idOffer",
									count: {
										$sum : 1
									}
								}
							}
						}
					], (err,list)=>{
						if(!err){
							if(result.member||result.master||result.admin){
								res.render("offerTest",{scripts:"testMember", list:list})
							}else{
								res.render("offerTest",{scripts:"testGuest", list:null})
							}
						}else{
							res.render("offerTest",{scripts:"testGuest", list:null})
						}
					})
				}else{
					res.send(`<h1>${err}</h1>`)
				}
			})
		})
	}else{
		res.render("offerTest",{scripts:"testGuest", list:null})
	}
});

module.exports = router;
