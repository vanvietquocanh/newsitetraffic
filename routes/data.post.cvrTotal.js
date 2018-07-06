var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

router.post("/", (req, res, next)=>{
	if(req.user){
		try {
			var query = {
				"idFacebook" : req.user.id
			}
			mongo.connect(pathMongodb,(err, db)=>{
				assert.equal(null, err);
				db.collection("userlist").findOne(query, (err, result)=>{
					if(result.admin){
						db.collection("conversion").find({"id" : req.body.idUser}).skip(Number(req.body.start)).limit(500).toArray((err,result)=>{
							db.close();
							res.send(result);
							res.end();
						})
					}else{
						db.close();
						res.redirect("/")
						res.end()
					}
				})
			})
		} catch(e) {
			if(db){
				db.close();
			}
			res.send(e);
		}
	}else {
		res.redirect("/")
		res.end()
	}
})
module.exports = router;