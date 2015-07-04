var fs            = require("fs-extra"),
	_             = require("underscore"),
	path          = require("path"),
	fileHandler   = require("./file"),
	helper        = require("./helper"),
	constants     = require("./constants").constants;

exports.addActivity= function( req, res ) {
	var fpath,
		validateParams = {
			date: true
		};
	helper.validateParams( req, res, validateParams, function(reqParams){
		fpath = helper.getFilePath( reqParams.date );
		if(fpath === false) {
			console.log("ERROR-> routes.js > exports.addActivity");
			return helper.sendError(res, constants.INVALID_DATE);
		}
		fileHandler.writeRecord(fpath, req, function(err, data){
			if(err){
				console.log("ERROR-> routes.js > addActivity > writeRecord err");
				return helper.sendError(res, constants.ERROR_WRITE);
			}
			return helper.sendData( res, data );
		});
	});
};

exports.getActivity= function( req, res ) {
	var fpath,
		expectedParams = [ "date", "from", "to", "type", "id" ],
		validateParams = (function(){
			var toValidate = {};
			_.each( req.params, function( propName, propValue ){
				toValidate[propValue] = _.contains( expectedParams, propValue );
			})
			return toValidate;
		}());	
	helper.validateParams( req, res, validateParams, function(reqParams){
		var jsonOutput = [],
			fromDate,
			toDate,
			dateRange,
			count=-1;
		if( reqParams.from && reqParams.to ){
			fromDate = helper.getDateObject(reqParams.from);
			toDate = helper.getDateObject(reqParams.to);
			dateRange = helper.getDateRange(fromDate, toDate);
			_.each(dateRange, function(d, index){
				fpath = helper.getFilePath( d );
				if(fpath === false) {
					console.log("ERROR-> routes.js > exports.getActivity");
					return helper.sendError(res, constants.INVALID_DATE);
				}
				fileHandler.readRecord(fpath, req, function(err, data){
					count++;
					if(err){
						console.log("ERROR-> routes.js > exports.getActivity > readRecord");
						return helper.sendError(res, constants.ERROR_READ);
					}
					if(data) {
						jsonOutput.push(data);
					}
					//console.log('dateRange('+(dateRange.length-1)+')' + '--' +'count('+count+')');
					if(dateRange.length-1 === count ) {
						return helper.sendData( res, jsonOutput );
					}
				});
			})
		}
		else if( reqParams.date ){
			fpath = helper.getFilePath( reqParams.date );
			if(fpath === false) {
				console.log("ERROR-> routes.js > exports.getActivity");
				return helper.sendError(res, constants.INVALID_DATE);
			}		
			fileHandler.readRecord(fpath, req, function(err, data){
				if(err){
					console.log("ERROR-> routes.js > exports.getActivity > readRecord");
					return helper.sendError(res, constants.ERROR_READ);
				}
				if(!data) {
					data = [];
				}
				return helper.sendData( res, data );
			});
		}		
	});	
};

exports.updateActivity= function( req, res ) {
	var fpath,
		validateParams = {
			date: true
		};
	helper.validateParams( req, res, validateParams, function(reqParams){
		fpath = helper.getFilePath( reqParams.date );
		if(fpath === false) {
			console.log("ERROR-> routes.js > exports.updateActivity");
			return helper.sendError(res, constants.INVALID_DATE);
		}
		fileHandler.updateRecord(fpath, req, function(err, data){
			if(err){
				console.log("ERROR-> routes.js > exports.updateActivity > updateRecord");
				return helper.sendError(res, constants.ERROR_UPDATE);
			}
			return helper.sendData( res,data );
		});
	});
};
exports.removeActivity= function( req, res ) {
	var fpath,
		validateParams = {
			date: true
		};
	helper.validateParams( req, res, validateParams, function(reqParams){
		fpath = helper.getFilePath( reqParams.date );
		if(fpath === false) {
			console.log("ERROR-> routes.js > exports.removeActivity");
			return helper.sendError(res, constants.INVALID_DATE);
		}
		fileHandler.removeRecord(fpath, req, function(err, data){
			if(err){
				console.log("ERROR-> routes.js > removeActivity > deleteRecord err");
				return helper.sendError(res, constants.ERROR_WRITE);
			}
			return helper.sendData( res, data );
		});
	});
};

exports.noSuchOption = function(req, res) {
	return helper.sendError( res, "No REST service available for '" + req.url + "' using '" + req.method + "'" );
}
