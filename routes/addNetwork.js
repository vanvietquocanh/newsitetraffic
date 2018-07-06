var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');
var {check, validationResult} = require("express-validator/check");
var regexURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

const pathMongodb = require("./pathDb");

/* GET home page. */
router.post('/', function(req, res, next) {
	function saveDB(){
		try{
			var query = {
				"link" : req.body.link
			}
			var data = req.body
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
				update(db, query, data, res)
			});
		}catch(e){
			if(db){
				db.close();
			}
			res.redirect("/")
			res.end();
		}	
	}
	function update(db, query, data, res) {
		data.total = 0;
		data.sub = {
			sub_id_1 : "",
			sub_id_2 : "",
			sub_id_3 : "",
			sub_id_4 : "",
			sub_id_5 : "",
			sub_id_6 : ""
		}
		db.collection('network').insert(data, { ordered: false },function(err,result){
			if(!err){
				db.close();
				req.session.success = true;
				req.session.errors = false;
				res.redirect("/advertiser");
			}else {
				db.close();
				req.session.errors = "Duplicate links";
				res.redirect("/advertiser");
			}
		});
	}
	try {
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
				db.collection('userlist').findOne(query, function(err,result){
					if(result.admin){
						req.check("name","Invalid name").exists().isString()
						req.check("email","Invalid email").exists().isEmail().isString()
						req.check("password","Invalid password").exists().isString()
						req.check("link","Invalid link").exists().isURL()
						req.check("method","Invalid method").exists().isString()
						req.check("type","Invalid type").exists().isIn(['appflood', 'hasoffer', "orangear"])
						req.check("description","Invalid description").exists().isString()
						req.check("wechatIM","Invalid wechat/skype IM").exists().isString()
						req.check("AM","Invalid skype AM").exists().isString()
						req.check("postback","Invalid postback").exists().isString()
						var error = req.validationErrors();
						if(!error){
							saveDB();
						}else{
							req.session.success = false;
							req.session.errors = error;
							res.redirect("/advertiser")
						}
					}else{
						res.redirect("/")
					}
				assert.equal(null,err);
				db.close();
			});
		});
	} catch(e) {
		if(db){
			db.close();
		}
		res.redirect("/");
		res.end();
	}
});

module.exports = router;
