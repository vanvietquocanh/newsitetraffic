var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
var randomstring = require("randomstring");
const pathMongodb = require("./pathDb");

router.get('/', function(req, res, next) {
	var querySearchOffer = {
		"index" : Number(req.query.offer_id)
	}
	function redirectAPI(app, db) {
		try {
			var queryNetwork = {
				"name" : new RegExp(app.nameNetworkSet, "i")
			}
			var strRandom = randomstring.generate();
			db.collection('network').findOne(queryNetwork, function(err,result){
				assert.equal(null,err);
				db.close();
				if(!err){
					if(result){
						var link = `${app.urlSet}+&${result.postback}=${strRandom}`;
						res.redirect(link);
						res.end();
					}
				}else{
					res.send("error")
					res.end();
				}
			});
		} catch(e) {
			res.send(e)
			res.end();
		}
	}
	if(req.query.offer_id!==undefined&&!(isNaN(req.query.offer_id))){
		try {
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
				db.collection('offer').findOne(querySearchOffer, function(err,result){
					if(!err){
						if(result){
							redirectAPI(result, db);
						}
					}else{
						db.close();
						res.redirect("/");
					}
				})
			});
		} catch(e) {
			res.send(e)
			res.end()
		}
	}else {
		res.send("error");
		res.end();
	}
});

module.exports = router;