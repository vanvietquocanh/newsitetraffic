var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	try {
		function responData(db) {
			var query1 = {};
			if(req.body.index){
				query1.idFacebook = req.body.index;
			}
			db.collection("userlist").findOne(query1 ,(err, result)=>{
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
		if(req.user.id){
			var query = {
				"idFacebook" : req.user.id
			}
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query, function(err,result){
						if(!err){
							if(result.admin){
								responData(db);
							}else {
								assert.equal(null,err);
								db.close();
								res.send("fucking you!!!")
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