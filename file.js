var fs            = require("fs-extra"),
	_             = require("underscore"),
	path          = require("path"),
	schema        = require("./schema"),
	record        = require("./record"),
	helper        = require("./helper");

exports.createStorage = function(callback){
	var directory = __dirname + "/storage";
	fs.ensureDir(directory, function (err) {
	  	if(err) {
			console.log("-> exports.createStorage > ensureDir err");
			console.log(err);
			callback(err);
		}
	    callback(null);
	});
};

exports.writeRecord = function(fpath, req, callback){
	var dbData,
		jsonData;		
	fs.ensureFile(fpath, function(err){
		if(err) {
			console.log("ERROR-> file.js > exports.writeRecord > ensureFile");
			console.log(err);
			callback(err);
		}
		fs.readFile(fpath, function(err,fcontents){
			if(err) {
				console.log("ERROR-> file.js > exports.writeRecord > readJSON");
				console.log(err);
				callback(err);
			}
			dbData = (fcontents.toString().length)? JSON.parse( fcontents.toString() ) : schema.skeleton();
			jsonData = helper.formatJSONData(req.body);
			/*jsonData = { 
				"activityList": { 
					"task": [ 
								{ "status": "pending", "description": "test desc" },
								{ "status": "active", "description": "test desc 2" },
					        ],
					"commit": [
								{"revision": 1234, "file": ["abc.js"], "comment": "test commit"}
					]
				} 
			};*/
			record.write(dbData, jsonData);
			fs.writeJSON(fpath, dbData, function(err){
				if(err) {
					console.log("-> exports.writeRecord > writeJSON err");
					console.log(err);
					callback(err);
				}
				callback(null, dbData);
			});
		});
	});
};

exports.readRecord = function(fpath, req, callback){
	var json,
		dataFetched;
	fs.exists(fpath, function (exists) {
		if(exists){
			fs.readFile(fpath, function(err,fcontents){
				if(err) {
					console.log("ERROR-> file.js > exports.readRecord > readJSON");
					console.log(err);
					callback(err);
				}
				dbData = (fcontents.toString().length)? JSON.parse( fcontents.toString() ) : schema.skeleton();
				jsonData = helper.formatJSONData(req.params);
				record.get(dbData, jsonData);
				callback(null, dbData);
			});
		}
		else {
			callback(null, null)
		}
	});
};

exports.updateRecord = function( fpath, req, callback ){
	var dbData,
		jsonData;
	fs.ensureFile(fpath, function(err){
		if(err) {
			console.log("ERROR-> file.js > exports.updateRecord > ensureFile");
			console.log(err);
			callback(err);
		}
		fs.readFile(fpath, function(err,fcontents){
			if(err) {
				console.log("ERROR-> file.js > exports.updateRecord > readFile");
				console.log(err);
				callback(err);
			}
			dbData = (fcontents.toString().length)? JSON.parse( fcontents.toString() ) : schema.skeleton();
			jsonData = helper.formatJSONData(req.body);
			/*jsonData = { 
				"activityList": { 
					"task": [ 
								{ "id":"8f4582e1-2633-c2d1-d2d7-bac878911a05","status": "updated", "description": "updateRecord" }
					        ]
				} 
			};*/
			record.update( dbData, jsonData );
			fs.writeJSON(fpath, dbData, function(err){
				if(err) {
					console.log("ERROR-> exports.updateRecord > writeJSON");
					console.log(err);
					callback(err);
				}
				callback(null, dbData);
			});
		});
	});
};

exports.removeRecord = function( fpath, req, callback ){
	var dbData,
		jsonData;
	fs.ensureFile(fpath, function(err){
		if(err) {
			console.log("ERROR-> file.js > exports.updateRecord > ensureFile");
			console.log(err);
			callback(err);
		}
		jsonData = helper.formatJSONData(req.body);
		if(!jsonData.date) {
			fs.remove(fpath, function (err) {
				if(err){
					console.log("ERROR-> record.js > exports.remove");
					return callback(err);
				}
				return callback(null, null);
			})
		}
		else {
			fs.readFile(fpath, function(err,fcontents){
				if(err) {
					console.log("ERROR-> file.js > exports.updateRecord > readFile");
					console.log(err);
					callback(err);
				}
				dbData = (fcontents.toString().length)? JSON.parse( fcontents.toString() ) : schema.skeleton();
				/*jsonData = { 
					"activityList": { 
						"commit": [true],
						"task": ["8f4582e1-2633-c2d1-d2d7-bac878911a05"]
					} 
				};
				*/
				jsonData={};
				record.remove( dbData, jsonData, fpath );
				fs.writeJSON(fpath, dbData, function(err){
					if(err) {
						console.log("ERROR-> exports.updateRecord > writeJSON");
						console.log(err);
						callback(err);
					}
					callback(null, dbData);
				});
			});
		}
		
	});
};