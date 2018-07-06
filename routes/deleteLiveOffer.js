var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
const country = require("./country");

var platform = ["android", "ios"];

const pathMongodb = require("./pathDb");

router.post('/:param', function(req, res, next) {
	var query = {
		"idFacebook" : req.user.id
	}
	try{
		function deleteLive(req, db){
			if(req.body.nameNetworkSet){
				db.collection("Offerlead").deleteMany(req.body ,(err,result)=>{
					if(!err){
						db.close();
						res.send("ok");
						res.end();
					}
				});
			}else{
				db.collection("Offerlead").drop((err,result)=>{
					if(!err){
						db.close();
						res.send("ok");
						res.end();
					}else{
						db.close();
						res.send(err)
						res.end();
					}
				});
			}
		}
		mongo.connect(pathMongodb, (err, db)=>{
			if(req.params.param === "alloffer"){

				db.collection("userlist").findOne(query, (err, result)=>{
					if(!err){
						var count = 0;
						if(result.admin){
							if(req.body.nameNetworkSet){
								db.collection("offer").deleteMany(req.body, (err, result)=>{
									if(!err){
										db.close();
										res.send("ok")
										res.end();
									}else{
										db.close();
										res.send("error")
										res.end();
									}
								});
								if(req.body.live==="live"){
									db.collection("Offerlead").drop(err=>{
										if(!err){
											if(req.body.nameNetworkSet){
												country.forEach( function(element, index) {
													platform.forEach( function(os, index) {
														db.collection(element+os).deleteMany(req.body, (err,result)=>{
															count++;
														});
													});
													if(country.length*2 === count){
														deleteLive(req, db)
													}
												});
											}else{
												country.forEach( function(element, index) {
													platform.forEach( function(os, index) {
														db.collection(element+os).drop((err,result)=>{
															count++;
														});
													});
													if(country.length*2 === count){
														deleteLive(req, db)
													}
												});
											}
										}
									});
								}
							}else{
								res.send("error");
							}
						}else{
							res.send("error")
						}
					}else{
						res.send("error")
					}
				})
			}else{
				db.close();
				res.redirect("/")
				res.end();
			}
		})
	}catch(e){
		res.send(e)
		res.end();
	}
});

module.exports = router;