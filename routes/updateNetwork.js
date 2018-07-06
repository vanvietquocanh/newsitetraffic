var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	function saveDB(db){
		// try{
			var indexOfNet = req.headers.referer.split("/network/details?id=")[1];
			var updateValue = {
				$set : {}
			};
			updateValue["$set"][Object.keys(req.body)[0]] = req.body[Object.keys(req.body)[0]]
			db.collection("network").updateOne({_id: ObjectId(indexOfNet)}, updateValue, (err, result)=>{
				db.close();
				if(!err){
					res.send(req.headers.referer)
				}else{
					res.send(err)
				}
			})
		// }catch(e){
			// res.send(e)
		// }	
	}
	try {
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(query, function(err,result){
					if(result.admin){
						saveDB(db);
					}else{
						db.close();
						res.end();
					}
			});
		});
	} catch(e) {
		if(db) db.close();
		res.redirect("/");
		res.end();
	}
});

module.exports = router;