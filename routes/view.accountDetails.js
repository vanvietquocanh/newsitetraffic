var express = require('express');
var router = express.Router();
var request = require("request");
const mongo = require('mongodb');
const assert = require('assert');
const pathMongodb = require("./pathDb");
/* GET home page. */
router.get('/:param1', function(req, res, next) {
	if(req.params.param1.toLowerCase()==="details"){
		if(!(isNaN(req.query.id))){
			if(req.user){
				mongo.connect(pathMongodb, (err, db)=>{
					db.collection("userlist").findOne({"idFacebook" : req.user.id}, (err, result)=>{
						if(!err){
							if(result.admin){
								db.collection("userlist").findOne({index:Number(req.query.id)}, (err, user)=>{
									if(!err){
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
							                user.name = user.displayName;
											res.render("detailAccount",{
												"name"    : result.profile.displayName,
												"avatar"  : req.user.photos[0].value,
												"admin"   : admin,
												"download": download,
												"myOffer" : myOffer,
												"addOffer": addOffer,
												"icon"	  : icon,
												"network" : network
											})
										}else if(result.master){
											res.redirect("/")
										}else if(result.member){
											res.redirect("/")
							            }
									}else{
										db.close();
										res.redirect("/")
									}
								})
							}else{
								db.close();
								res.redirect("/")
							}
						}else{
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
	}else{
		res.redirect("/")
	}
});

module.exports = router;