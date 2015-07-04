var _             = require("underscore"),
	path          = require("path"),
	constants     = require("./constants").constants;

exports.getFilePath = function(p){
	var fpath = exports.getFilePathFromDate(p);	
	if(fpath) {
		return path.resolve(__dirname + "\\storage" + "\\" + fpath.y + "\\" + fpath.m + "\\" + fpath.d + ".json");
	}	
	return false;
};

exports.getFilePathFromDate = function(d){
	var split;
	if( _.isObject(d) ) {
		return {
			"y" : d.getFullYear(),
			"m" : constants.MONTH[ d.getMonth() ],
			"d" : d.getDate()<10? "0"+d.getDate() : ""+d.getDate()
		}
	}
	else if( _.isString(d) ) {
		split = d.match(/^(\d{1,2})([a-z]{1,3})(\d{4})$/i);
		if(split && split.length && _.contains(constants.MONTH, split[2].toLowerCase())) {
			return {
				"y" : split[3],
				"m" : split[2].toLowerCase(),
				"d" : split[1]
			};	
		}
	}
	return false;
};

exports.getDateObject = function(d){
	var date  = new Date(),
		split = d.match(/^(\d{1,2})([a-z]{1,3})(\d{4})$/i);			
	if( split && split.length && _.contains(constants.MONTH, split[2].toLowerCase())) {
		date.setFullYear(split[3], _.indexOf(constants.MONTH, split[2].toLowerCase()), split[1]);
		date.setHours(0,0,0,0);
	}
	else {
		date = null;
	}
	return date;
};

exports.getNextDay = function(d){
	var nxtDay = new Date(d);
	nxtDay.setDate(d.getDate()+1); 
	return nxtDay;
};

exports.getPrevDay = function(d){
	var prevDay = new Date(d);
	prevDay.setDate(d.getDate()-1); 
	return prevDay;
};

exports.getDateRange = function(from, to) {
	var dateRange = [],
		temp,
		day,
		getDayFn;
	if(from.getDate() === to.getDate() && from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear() ) {
		return from;
	}
	getDayFn = from>to? exports.getPrevDay : exports.getNextDay;
	var i = 0;
	do{
		if(!dateRange.length){
			day = from;
		} else {
			day = getDayFn( dateRange[dateRange.length-1] );
		}
		dateRange.push(day);
		if(day.getDate() === to.getDate() && day.getMonth() === to.getMonth() && day.getFullYear() === to.getFullYear() ) {
			break;
		}		
	}while(true);	
	return dateRange;
};

exports.eachObject = function(obj, callback){
	for( var propName in obj ) {
		if( Object.prototype.hasOwnProperty.call(obj, propName) ) {
			callback(propName, obj[propName]);
		}		
	}
};

exports.formatJSONData = function(jsonData){
	return jsonData;	
};

exports.validateParams = function(req, res, validateParams, callback){
	var reqParams     = {};
	exports.eachObject(validateParams, function(key, shouldValidate) {
		if(shouldValidate) {
			reqParams[key] = req.params[key];
			if(!reqParams[key]) {
				return exports.sendError(res, key + " required in request URL");	
			}			
		}		
	});
	callback(reqParams);
};

exports.guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};

exports.sendError = function(res, err){
	console.log(err);
	res.send({
		error: err
	});
};

exports.sendData = function(res, data){
	res.send({
		error: null,
		data: data
	});
};
