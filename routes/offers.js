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
 			var cvrList;
 			var netName = {};
 			var start = 0;
 			var queryOffer = {};
 			var sortValues = {};
 			function setDataRender(db, offer, err, result, selNetworks, page, totalPage) {
 				assert.equal(null,err);
				db.close();
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
			        let icon = `<li class="has_sub">
	                                <a href="/iconhandle" class="waves-effect"><i class="fa fa-picture-o"></i> <span> Icon Handle</span></a>
	                            </li>`
					renderPage(download, myOffer, memSel, selNetworks, addOffer, icon, offer, result, page, totalPage, null)
				}else if(result.master){
					download = "";
					myOffer  = `<li class="has_sub">
		                                <a href="/liveoffer" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> Live Offers </span></span></a>
		                            </li>`;
					addOffer = "";
	                memSel   = "";
					renderPage(download, myOffer, memSel, selNetworks, addOffer, "", offer, result, page, totalPage, null)
				}else if(result.member){
					download = "";
					myOffer  = `<li class="has_sub">
		                                <a href="/myoffers" class="waves-effect"><i class="ti ti-layout-list-post"></i> <span> My Offers </span></span></a>
		                            </li>`;
					addOffer = "";
	                memSel   = "";
					renderPage(download, myOffer, memSel, selNetworks, addOffer, "", offer, result, page, totalPage, result.request)
				}									
 			}
 				if(req.query.search){
 					if(isNaN(req.query.search)){
 						queryOffer.nameSet = new RegExp(req.query.search, "i");
 					}else{
 						queryOffer.index = Number(req.query.search);
 					}
 				}
 				if(req.query.country){
 					if(req.query.country !== "all"){
 						queryOffer.countrySet = new RegExp(req.query.country, "i");
 					}
 				}
 				if(req.query.os){
 					if(req.query.os !== "all"){
 						queryOffer.platformSet = new RegExp(req.query.os, "i");
 					}
 				}
 				if(req.query.network){
 					if(req.query.network !== "all"){
 						queryOffer.nameNetworkSet = new RegExp(req.query.network, "i");
 					}
 				}
 				queryOffer.paySet = {$gt: 0, $lt:999};
 				if(req.query.payMax){
 					if(!(isNaN(req.query.payMax))){
 						queryOffer.paySet["$lt"] = parseFloat(Number(req.query.payMax));
 					}
 				}
 				if(req.query.offertype){
 					queryOffer.offerType = new RegExp(req.query.offertype, "i");
 				}
 				if(req.query.payMin){
 					if(!(isNaN(req.query.payMin))){
 						queryOffer.paySet["$gt"] = parseFloat(Number(req.query.payMin));
 					}
 				}
 				if(req.query.category){
 					queryOffer.categorySet = new RegExp(req.query.category.trim(), "i")
 				}
 				var sortArr = ["index", "nameSet", "platformSet", "categorySet", "countrySet"]
 				var sorttype = 1;
 				if(req.query.sorttype){
 					sorttype = parseFloat(req.query.sorttype);
 				}
 				if(req.query.sort){
	 				if(sortArr.indexOf(req.query.sort)){
	 					sortValues[`${req.query.sort}`] = sorttype;
	 				}else{
	 					sortValues.index = sorttype;
	 				}
 				}else{
 					sortValues.index = sorttype;
 				}
	 			mongo.connect(pathMongodb,function(err,db){
					assert.equal(null,err);
					db.collection("offer").find(queryOffer).count((err, totaldocument)=>{
						if(!(isNaN(req.query.page))){
							var totalPage = Math.floor( totaldocument/20 );
							if(totaldocument%20>0){
								totalPage++;
							}
							if(Number(req.query.page)>0&&Number(req.query.page)<=totalPage){
			 					start = (Number(req.query.page) - 1 ) * 20
			 				}else{
			 					start = 0;
			 				}
			 			}
		 				function maxPage(totalPage){
		 					if(totalPage>=5){
		 						return 5;
		 					}else{
		 						return totalPage;
		 					}
		 				}
						db.collection('userlist').findOne(query,function(err,result){
							var download, myOffer, memSel, addOffer;
							var selNetworks = `<select class="select-drop-blue sel-mem" name="network" id="sel-Networks" value="${req.query.network}">
	                                                <option value="all">Network List</option>`;
							db.collection("network").find().toArray( (err, net)=>{
								net.forEach( function(element, index) {
									if(netName[`${element.name}`]===undefined){
										netName[`${element.name}`] = element.name;
									}
								});
								Object.keys(netName).forEach( function(element, index) {
									selNetworks += `<option value="${element}">${element}</option>`;
								});
								selNetworks += `</select>`;
								var page = [];
								var pageInital = Number(req.query.page);
								if(pageInital<3){
									pageInital = 1;
								}else if(pageInital>=3){
									if(pageInital>=totalPage-3){
										pageInital = totalPage - 4;
									}else{
										pageInital -= 2;
									}
								}
								for (var i = 0; i < maxPage(totalPage); i++) {
									if(pageInital+i>0&&pageInital+i<=totalPage){
										page.push(pageInital+i)
									}
								}
								if(Object.keys(sortValues).indexOf("index")!==-1){
									console.log("true")
								}else{
									console.log('false')
								}
								db.collection('offer').find(queryOffer).sort(sortValues).skip(start).limit(20).toArray((err, offer)=>{
									setDataRender(db, offer, err, result, selNetworks, page, totalPage)
								})
							})
						});
					})
				});
		} catch(e) {
			res.redirect("/")
		}
	  	function renderPage(download, myOffer, memSel, selNetworks, addOffer, icon, data, typeUser, page, totalPage, arrIndex) {
	  		var admin =`<li>
			       			<a href="/admin" class="waves-effect"><i class="zmdi zmdi-view-dashboard"></i> <span> Dashboard </span> </a>
			    		</li>`;
			if(arrIndex){
				if(arrIndex.length>0){
					arrIndex.forEach((element, index)=>{
						data.forEach((ele,i)=>{
							if(Number(element.offerId)===Number(ele.index)){
								data[i].adConfirm = element.adConfirm;
							}else if(data[i].adConfirm === undefined){
								data[i].adConfirm = "no request";
							}
						})
					})
				}else{
					data.forEach((ele,i)=>{
						data[i].adConfirm = "no request";
					})
				}
			}
			res.render("offers",{
				"hostname": req.headers.host,
				"name"  : req.user.displayName,
				"avatar": req.user.photos[0].value,
				"admin" : admin,
				"download": download,
				"myOffer" : myOffer,
				"memSel"  : memSel,
				"selNetworks" : selNetworks,
				"addOffer" : addOffer,
				"icon" 	: icon,
				"data"	: data,
				"affID"	: req.user.id,
				"typeUser" : typeUser,
				"page"	: page,
				"totalPage" : totalPage,
				"urlDefault" : req.url.split('/').join("").split('?').join("").split(/page\=[0-9]+/).join(""),
				"search"	: req.query
			})
	  	}
	}else{
		res.redirect("/")
	}
});

module.exports = router;
