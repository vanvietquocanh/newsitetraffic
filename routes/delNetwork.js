var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	function saveDB(db){
		try{
			db.collection('network').deleteOne({_id : ObjectId(req.body.index)}, function(err,result){
				assert.equal(null,err);
				db.close();
				if(!err){
					res.send(true)
				}else {
					res.send(false)
				}
			});
		}catch(e){
			db.close();
			res.send(e)
		}	
	}
	try {
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(query, function(err,result){
					if(result.admin){
						saveDB(db)
					}
				assert.equal(null,err);
				db.close();
			});
		});
	} catch(e) {
		if(db){
			db.close();
		}
		res.send(e);
		res.end();
	}
});

module.exports = router