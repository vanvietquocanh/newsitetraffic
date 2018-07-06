var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	function getDB(db){
		try{
			db.collection('network').find().toArray((err,result)=>{
				db.close();
				if(!err){
					res.send(result)
				}else {
					res.send(err)
				}
				assert.equal(null,err);
			});
		}catch(e){
			db.close();
			res.redirect("/")
			res.end();
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
					getDB(db)
				}
				assert.equal(null,err);
			});
		});
	} catch(e) {
		res.redirect("/");
		res.end();
	}
});

module.exports = router;