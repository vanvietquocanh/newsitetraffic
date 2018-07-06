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
 				};
 			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query,function(err,result){
						if(result.admin){
							db.collection("useradd").updateOne(req.body.query, {$set:req.body.change}, (err, result)=>{
								if(!err){
									db.close();									
									res.send(req.body.change);
									res.end()
								}else{
									db.close();									
									res.send(err);
									res.end()
								}
							})				
						}else{
							db.close();
							res.redirect("/")
							res.end()
						}
					});
			});
		} catch(e) {
			if(db){
				db.close();
			}
			res.redirect("/")
			res.end()
		}
	}else{
		res.redirect("/")
		res.end()
	}
});

module.exports = router;
