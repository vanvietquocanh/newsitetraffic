var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

router.get('/:parameter', function(req, res, next) {
	var io = req.app.get("socketio");
	io.emit("mes","asdjksadj")
	if(req.params.parameter==="eventdata"&&req.query.transaction_id!==undefined){
		try {
			function savePostback(data, db) {
				data.enable = false;
				db.collection("conversion").insertOne(data, (err, result)=>{
					if(!err){
						res.send(JSON.stringify({"message": "Ok!"}))
					}else {
						res.send("error")
					}
					assert.equal(null,err);
					db.close();
				})
			}
			var query = {
				"key" : req.query.transaction_id
			}
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
				db.collection('report').findOne(query,(err,result)=>{
					if(!err&&result){
						// req.socket.emit("NewCvr","hello");					
						savePostback(result, db)
					}else{
						db.close();
						res.send("error")
					}
				});
			});
		} catch(e) {
			res.send(e);
		}
	}else{
		res.end("error");
	}
});

module.exports = router;
