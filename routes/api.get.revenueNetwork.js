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
						var currentTime = new Date();
						db.collection("conversion").aggregate([
							{
								$match:{
									seconds : new Date(`${currentTime.getMonth()}-${currentTime.getDate()}-${ currentTime.getFullYear()}`).getTime()
								}
							},
							{
								$group : {
									"_id" : {
										name: `$networkName`, 
									},
									revenue: {
										$sum: "$pay"
									}
								}
							}
						], (err,total)=>{
							if(!err){
								res.send(total)
							}else{
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