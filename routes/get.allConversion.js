var express = require('express');
var router = express.Router();
var request = require("request");
const mongo = require('mongodb');
const assert = require('assert');
const pathMongodb = require("./pathDb");
/* GET home page. */
router.get('/', function(req, res, next) {
 	mongo.connect(pathMongodb,function(err,db){
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
		], (err,result)=>{
			res.send(result)
		})
 	})
});

module.exports = router;