var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET revenue User. */
router.get('/', function(req, res, next) {
	if(req.user){
		mongo.connect(pathMongodb,function(err,db){
			db.collection("userlist").findOne({idFacebook: req.user.id},(err,result)=>{
				if(!err){
					if(result.admin){
						db.collection("userlist").findOne({idFacebook : req.body.idFacebook},(err,result)=>{
							if(!err){
								db.collection("block").insertOne(result,(err, result)=>{
									if(!err){
										db.collection.deleteOne({idFacebook : req.body.idFacebook},(err, result)=>{
											if(!err){
												res.send("success")
											}else{
												db.close();
												res.send(err)
											}
										})
									}else{
										db.close();
										res.send(err)
									}
								})
							}else{
								db.close();
								res.send(err)
							}
						})
					}else{
						res.redirect("/")
					}
				}else{
					res.send(err)
				}
			})
		})
	}else{
		res.redirect("/")
	}
});

module.exports = router;