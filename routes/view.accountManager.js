var express = require('express');
var router = express.Router();
const mongo = require('mongodb');
const assert = require('assert');

const pathMongodb = require("./pathDb");

/* GET home page. */
router.get('/', function(req, res, next) {
	function getDB(db, isTypeUser){
		try{
			db.collection('network').find().toArray((err,result)=>{
				if(!err){
					if(result&&isTypeUser){
						function renderPage(page, admin, download, myOffer, addOffer, user, icon, data) {
							res.render(page,{
								"hostname": req.headers.host,
								"name"  : req.user.displayName,
								"avatar": req.user.photos[0].value,
								"admin" : admin,
								"download": download,
								"myOffer" : myOffer,
								// "memSel"  : memSel,
								"user" : user,
								"addOffer" : addOffer,
								"icon" 	: icon,
								"data"	: data,
								"affID"	: req.user.id,
								// "typeUser" : typeUser,
								// "page"	: page,
								// "total" : total,
								// "urlDefault" : req.url.split('/').join("").split('?').join("").split(/page\=[0-9]+/).join(""),
								"search"	: req.query
							})
						}
						// res.send(result)
						var admin = `<li class="parent parent-focus"><a class="subdrop"><i class="fa fa-suitcase"></i> <span>Management</span></a>
	                                	<ul class="children" style="">
	                                    	<li>
		                                        <a href="/dashboard" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i><span> Offers </span> </a>
		                                    </li>
		                                    <li>
		                                        <a href="/account" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i><span> Acount Manager </span> </a>
		                                    </li>
		                                    <li>
		                                        <a href="/advertiser" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i><span> Advertiser </span> </a>
		                                    </li>
		                                </ul>
		                            </li>`;
                        var download = `<li class="has_sub">
		                                	<a href="/totalcvr" class="waves-effect"><i class="fa fa-credit-card-alt"></i> <span> Payment Report </span></a>
		                          		</li>
		                            	<li class="has_sub">
			                                <a href="/userrequest" class="waves-effect"><i class="fa fa-envelope-o"></i> <span> User request </span></a>
			                            </li>
			                            <li class="has_sub">
			                                <a href="/adduser" class="waves-effect"><i class="fa fa-users"></i> <span> Add User  </span></a>
			                            </li>
                        				<li class="has_sub">
			                                <a href="/download" class="waves-effect"><i class="fa fa-download"></i> <span> Download </span></a>
			                            </li>`;
			            if(isTypeUser.admin){
							db.collection('userlist').updateOne({"idFacebook": req.user.id}, {$set:{profile: req.user}}, {upsert:true}, (err,re)=>{
								let myOffer  = 	`<li class="has_sub">
					                                <a href="/liveoffer" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> Live Offers </span></span></a>
					                            </li>`;
							    let addOffer = `<li class="has_sub">
							                        <a href="/addnewoffer" class="waves-effect"><i class="fa fa-plus"></i> <span> Add Offers </span></a>
							                    </li>`;
					 			var netName = {};
                                let icon = `<li class="has_sub">
				                                <a href="/iconhandle" class="waves-effect"><i class="fa fa-picture-o"></i> <span> Icon Handle</span></a>
				                            </li>`;
                                db.collection("userlist").find().toArray( (err, user)=>{
                            		db.close();
	                      			renderPage("accountManager", admin, download, myOffer, addOffer, user, icon, result);
		                    	})
							})
						}else{
							res.redirect("/")
						}
					}else{
						res.send("error")
					}
				}else {
					res.send(err)
				}
				assert.equal(null,err);
			});
		}catch(e){
			db.close();
			res.redirect("/");
		}	
	}
	try {
		var query = {
			"idFacebook" : req.user.id
		}
		mongo.connect(pathMongodb,function(err,db){
			assert.equal(null,err);
			db.collection('userlist').findOne(query, function(err,result){
				if(result.admin){
					getDB(db, result)
				}
				assert.equal(null,err);
			});
		});
	} catch(e) {
		res.redirect("/");
		res.end();
	}
});

module.exports = router;