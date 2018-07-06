var express = require('express');
var router = express.Router();
var request = require("request");
const mongo = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
var appFlood = require("./module.appflood");
var orangear = require("./module.orangear");
var hasOffer = require("./module.hasOffer");
// const fs = require("fs");
const pathMongodb = require("./pathDb");
var gplay = require('google-play-scraper');

router.post('/', function(req, res, next) {
	function findAPIInfo(query, db){
		db.collection("network").findOne(query, (err,result)=>{
			if(!err){
				if(result){
					var ArrReq = [];
					switch (result.type) {
						case "hasoffer":
							if(typeof result.link!=="string"){
								db.close();
								result.link.forEach((ele, i)=>{
									setTimeout(()=>{
										mongo.connect(pathMongodb, (err, db)=>{
											assert.equal(null, err);
											hasOffer.request(result.method, ele, db, result.name, result.idAff, req, res, ArrReq, result.link.length)
										})
									},i*5000)
								})
							}else{
									hasOffer.request(result.method, result.link, db, result.name, result.idAff, req, res, ArrReq, 1)
							}
							break;
						case "appflood":
							if(typeof result.link!=="string"){
								db.close();
								result.link.forEach((ele, i)=>{
									setTimeout(()=>{
										mongo.connect(pathMongodb, (err, db)=>{
											assert.equal(null, err);
											appFlood.request(result.method, ele, db, result.name, req, res, ArrReq, result.link.length);
										})
									},i*5000)
								})
							}else{
									appFlood.request(result.method, result.link, db, result.name, req, res, ArrReq, 1);
							}
							break;
						case "orangear":
							if(typeof result.link!=="string"){
								db.close();
								result.link.forEach((ele, i)=>{
									setTimeout(()=>{
										mongo.connect(pathMongodb, (err, db)=>{
											assert.equal(null, err);
											orangear.request(result.method, ele, db, result.name, req, res, ArrReq, result.link.length);
										})
									},i*5000)
								})
							}else{
									orangear.request(result.method, result.link, db, result.name, req, res, ArrReq, 1);
							}
							break;
						default:
							res.send("error")
							break;
					}
				}else{
					res.redirect("/")
				}
			}else{
				res.send(err)
			}
		})
	}
	try{
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(query,function(err,result){
					if(!err){
						if(result.admin){
							findAPIInfo({_id : ObjectId(req.body.index)}, db);
						}else{
							assert.equal(null,err);
							db.close();
							res.send("Mày đéo phải admin");
						}
					}else{
						assert.equal(null,err);
						db.close();
						res.send("error")
					}
			});
		});
	}catch(e){
		res.send("error")
		res.end();
	}
});

module.exports = router;