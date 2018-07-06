var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');


const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	if(req.user){
	  	try {
	  		function deleteOff(db) {
	  			// db.userlist.find({""}).toArray()
	  		}
			var query = {
					"idFacebook": req.user.id
 				}
 			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query, (err,result)=>{
						if(result.admin){
							db.close();
							deleteOff(db);
						}else{
							db.close();
							res.redirect("/")
						}
					});
			});
		} catch(e) {
			if(db){
				db.close();
			}
			res.send(e)
			res.end()
		}
	}else{
		res.send("ERROR USER")
		res.end()
	}
});

module.exports = router;
