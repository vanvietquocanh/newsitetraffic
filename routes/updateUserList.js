var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	if(req.user){
	  	try {
			var query = {
					"idFacebook": req.user.id
 				}
 			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query,function(err,result){
						if(result.admin){
							var data = {
								"isUser"   : true,
								"username" : req.body.username,
								"password" : req.body.password,
								"ipAddress": req.body.ipAddress,
								"status"   : false
							};
							db.collection("useradd").insertOne(data, (err, result)=>{
								if(!err){
									assert.equal(null,err);
									db.close();
									res.send(req.body);
								}else{
									assert.equal(null,err);
									db.close();
									res.send(err);
								}
							})				
						}else{
							assert.equal(null,err);
							db.close();
							res.send("error");
						}
					});
			});
		} catch(e) {
			if(db){
				db.close();
			}
			res.send("error")
		}
	}else{
		res.send("error")
	}
});

module.exports = router;
