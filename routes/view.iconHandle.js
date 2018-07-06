var express = require('express');
var router = express.Router();
var request = require("request");
const mongo = require('mongodb');
const assert = require('assert');
const pathMongodb = require("./pathDb");
/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
		try {
			var query = {
					"idFacebook": req.user.id
 				}
 			var netName = {};
 			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query,function(err,result){
						var download, myOffer, memSel, addOffer, icon = "";
						var selNetworks = `<select class="select-drop-blue sel-mem" name="sel-Networks" id="sel-Networks">
                                                <option value="all">Network List</option>`;
						db.collection("network").find().toArray((err, net)=>{
							net.forEach( function(element, index) {
								if(netName[`${element.name}`]===undefined){
									netName[`${element.name}`] = element.name;
								}
							});
							Object.keys(netName).forEach( function(element, index) {
								selNetworks += `<option value="${element}">${element}</option>`;
							});
							selNetworks += `</select>`;
						if(result.admin){
								download     = `<li class="has_sub">
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
							    myOffer = `<li class="has_sub">
				                                <a href="/liveoffer" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> Lead Offers </span></span></a>
				                            </li>`;
							    memSel  = ``;
							    addOffer = `<li class="has_sub">
						                        <a href="/addnewoffer" class="waves-effect"><i class="fa fa-plus"></i> <span> Add Offers </span></a>
						                    </li>`;
						        icon = `<li class="has_sub">
			                                <a href="/iconhandle" class="waves-effect active"><i class="fa fa-picture-o"></i> <span> Icon Handle</span></a>
			                            </li>`;
							assert.equal(null,err);
							db.close();
							renderPage(download, myOffer, memSel, selNetworks, addOffer, icon)
						}else {
							assert.equal(null,err);
							db.close();
							res.redirect("/")
						}
					});
				});
			});
		} catch(e) {
			if(db){
				assert.equal(null,err);
				db.close();
			}
			res.send(e)
		}
	  	function renderPage(download, myOffer, memSel, selNetworks, addOffer, icon) {
	  		var admin =`<li>
			       			<a href="/admin" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i> <span> Dashboard </span> </a>
			    		</li>`;
			res.render("iconHandle",{
				"hostname": req.header.hostname,
				"name"  : req.user.displayName,
				"avatar": req.user.photos[0].value,
				"admin" : admin,
				"download": download,
				"myOffer" : myOffer,
				"memSel"  : memSel,
				"selNetworks" : selNetworks,
				"addOffer" : addOffer,
				"icon" 	 : icon
			})
	  	}
	}else{
		res.send("error")
	}
});

module.exports = router;