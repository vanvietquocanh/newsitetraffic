var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/:parameter', function(req, res, next) {
	try {
		function responData(db, coll) {
			var query1 = {};
			if(req.body.index&&(req.body.index.length===12||req.body.index.length===24)){
				query1._id = ObjectId(req.body.index);
			}
			db.collection(coll).findOne(query1 ,(err, result)=>{
				if(!err){
					if(result){
						db.close();
						res.send(result)
					}else {
						db.close();
						res.send("No App")
					}
				}else{
					db.close();
					res.send(err)
				}
			})
		}
		function block(db){
			assert.equal(null,err);
			db.close();
			res.send("fucking you!!!")
		}
		if(req.user.id&&/network|offer/i.test(req.params.parameter)){
			var query = {
				"idFacebook" : req.user.id
			}
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query, function(err,result){
						if(!err){
							if(/network/i.test(req.params.parameter)){
								if(result.admin){
									responData(db, req.params.parameter);									
								}else{
									block(db);
								}
							}else{
								responData(db, req.params.parameter);									
							}
						}else {
							assert.equal(null,err);
							db.close();
							res.send("error")
						}
					assert.equal(null,err);
				});
			});
		}else{
			res.send("fucking you!!!")
		}
	} catch(e) {
		if(db){
			db.close();
		}
		res.redirect("/");
		res.end();
	}
});

module.exports = router;