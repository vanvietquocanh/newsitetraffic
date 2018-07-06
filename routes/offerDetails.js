var express = require('express');
var router = express.Router();
var request = require("request");
const mongo = require('mongodb');
const assert = require('assert');
const pathMongodb = require("./pathDb");
/* GET home page. */
router.get('/:param1', function(req, res, next) {
	if(req.params.param1.toLowerCase()==="details"){
			if(req.user){
				mongo.connect(pathMongodb, (err, db)=>{
					db.collection("userlist").findOne({"idFacebook" : req.user.id}, (err, result)=>{
						if(!err){
							if(result){
								db.close();
								var icon = "";
								var admin =`<li>
					       			<a href="/admin" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i> <span> Dashboard </span> </a>
					    		</li>`;
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
					                                <a href="/liveoffer" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> Live Offers </span></span></a>
					                            </li>`;
								    memSel  = ``;
								    addOffer = `<li class="has_sub">
							                        <a href="/addnewoffer" class="waves-effect"><i class="fa fa-plus"></i> <span> Add Offers </span></a>
							                    </li>`;
							        icon = `<li class="has_sub">
					                                <a href="/iconhandle" class="waves-effect"><i class="fa fa-picture-o"></i> <span> Icon Handle</span></a>
					                            </li>`
								}else if(result.master){
									download = "";
									myOffer  = `<li class="has_sub">
						                                <a href="/liveoffer" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> Live Offers </span></span></a>
						                            </li>`;
									addOffer = "";
					                memSel   = "";
								}else if(result.member){
									download = "";
									myOffer  = `<li class="has_sub">
						                                <a href="/myoffers" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> My Offers </span></span></a>
						                            </li>`;
									addOffer = "";
					                memSel   = "";
								}
								let title = `${req.params.param1} Detail`;
								res.render("detailOffer",{
									"name"    : result.profile.displayName,
									"avatar"  : req.user.photos[0].value,
									"admin"   : admin,
									"download": download,
									"myOffer" : myOffer,
									"addOffer": addOffer,
									"icon"	  : icon,
									"title"   : title.charAt(0).toUpperCase() + title.slice(1)
								})
							}else{
								db.close();
								res.redirect("/")
							}
						}else{
							db.close();
							res.redirect("/")
						}
					})
				})
			}else{
				res.redirect("/")
			}
	}else{
		res.redirect("/")
	}
});

module.exports = router;