var getIdApp = function(prevlink) {
	var regexID = /com\.+[A-Za-z]+\.[A-Za-z]+|id+[0-9]+/
	if(regexID.test(prevlink)){
		return prevlink.match(regexID)[0];
	}else{
		return "error"
	}
}
module.exports = getIdApp;