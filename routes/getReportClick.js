var express = require('express');
var router = express.Router();
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
 			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('userlist').findOne(query,function(err,result){
						assert.equal(null,err);
						db.close();
						var download, myOffer, memSel, icon="";
						if(result.admin){
							icon = `<li class="has_sub">
		                                <a href="/iconhandle" class="waves-effect"><i class="fa fa-picture-o"></i> <span> Icon Handle</span></a>
		                            </li>`;
							memSel = `<select class="select-drop-blue sel-mem" name="members" id="members"><option value='all'>Members</option></select>`;
							download  = `	<li class="has_sub">
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
						                    </li>
						                    `;
						    addOffer = `<li class="has_sub">
					                        <a href="/addnewoffer" class="waves-effect"><i class="fa fa-plus"></i> <span> Add Offers </span></a>
					                    </li>`;
					        myOffer  =  `<li class="has_sub">
			                                <a href="/liveoffer" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> Live Offers </span></span></a>
			                            </li>`;
						}else if(result.member){
							addOffer  = "";
							memSel 	  = ``;
							download  = ``;
							myOffer   = `<li class="has_sub">
			                                <a href="/myoffers" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> My Offers </span></span></a>
			                            </li>`
						}else if(result.master){
							addOffer  = "";
							memSel 	  = ``;
							download  = ``;
							myOffer   = `<li class="has_sub">
			                                <a href="/liveoffer" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> Live Offers </span></span></a>
			                            </li>`;
						}else{
							res.end();
						}
						responseReportClick(download, myOffer, memSel, icon, result)
					});
			});
		} catch(e) {
			res.redirect("/")
		}
		function preFixCountry(country1){
			if (country1.split("|").length===2){
				return {$or:[{country: new RegExp(`${country1.split("|")[0]}`,"i")}, {country:new RegExp(`${country1.split("|")[0]}`,"i")}]};		
			}else{
				return {country : new RegExp(country1,"i")};
			}
		}
		function changeTime(data) {
			var date = data.split(" - ")[0].split(":").concat(data.split(" - ")[1].split("/"));
			return new Date(date[5], date[4]-1, date[3], date[0], date[1], date[2]).getTime();
		}
		function responseReportClick(download, myOffer, memSel, icon, condition) {
			var query = {};
			if(req.body.country){
				query = preFixCountry(req.body.country.toUpperCase());
			}
			if(req.body.platform){
				query.platfrom = new RegExp(req.body.platform, "i") ;
			}
			if(req.body.querySearch){
				query.appName = new RegExp(req.body.querySearch,"i")
			}
			if(condition.master||condition.member){
				query.name = condition.profile.displayName;
			}
			mongo.connect(pathMongodb,function(err,db){
				assert.equal(null,err);
					db.collection('report').find(query).sort({seconds:-1}).skip(Number(req.body.countStart)).limit(20).toArray((err,result)=>{
						db.close();
						if(!err){
							renderPage(download, myOffer, memSel, icon, condition)
						}else{
							res.send(err)
						}
				});
			});
		}
	  	function renderPage(download, myOffer, memSel, icon, data) {
	  		var admin =`<li>
		       			<a href="/admin" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i> <span> Dashboard </span> </a>
		    		</li>`;
			res.render("reportClick",{
				"hostname": req.header.hostname,
				"name"    : req.user.displayName,
				"avatar"  : req.user.photos[0].value,
				"admin"   : admin,
				"download": download,
				"myOffer" : myOffer,
				"addOffer": addOffer,
				"data"    : data,
				"memSel"  : memSel,
				"icon"    : icon
			})
	  	}
	}else{
		res.redirect("/");
	}
});

module.exports = router;
