var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/:parameter', function(req, res, next) {
	if(req.params.parameter==="api"){
		mongo.connect(pathMongodb,(err,db)=>{
			var query = {};
			if(req.query.country){
				query.country = new RegExp(`${req.query.country.toUpperCase()}`)
			}
			query.seconds = {$gt:Date.now()-2*60*60*1000}
			db.collection("SSH").findOne(query, (err, result)=>{
				db.close();
				if(!err){
					if(result){
						if(result.data.length>0){
							var dataRespon = "<br>";
							result.data.forEach( function(element, index) {
								dataRespon += `${element}<br>`;
							});
							res.send(dataRespon);
						}else{
							res.send("null");
						}
					}else {
						res.send("null");
					}
				}else{
					res.send(err)
				}
			})
		})
	}else{
		res.send("error");
	}
});

module.exports = router;