var _             = require("underscore"),
   schema         = require("./schema"),
   helper         = require("./helper");

exports.write = function(dbData, jsonData){
	var dbActivityList     = dbData.activityList,
		jsonActivityList   = jsonData && jsonData.activityList || {},
		record;
	if(!_.isEmpty(jsonActivityList)) {
		helper.eachObject(dbActivityList, function( dbActivityName, dbActivity ){
			dbData.date = jsonData.date;
			if( typeof jsonActivityList[dbActivityName] !== "undefined" ){
				_.each(jsonActivityList[dbActivityName], function( jsonActivity, index ){
					record = schema.get(dbActivityName);
					record.id = helper.guid();
					helper.eachObject( record, function( key, value ) {
						if(key !== "id" && typeof jsonActivity[key] !== "undefined") {
							record[key] = jsonActivity[key];
						}
					});
					dbActivity.unshift(record);	
				})				
			}
		});	
	}	
	return dbData;
};

exports.update = function(dbData, jsonData){
	var dbActivityList     = dbData.activityList,
		jsonActivityList   = jsonData && jsonData.activityList || {},
		record;
	if(!_.isEmpty(jsonActivityList)) {
		helper.eachObject(dbActivityList, function( dbActivityName, dbActivity ){
			if( typeof jsonActivityList[dbActivityName] !== "undefined" ){
				_.each(jsonActivityList[dbActivityName], function( jsonActivity, index ){
					if(!_.isObject(jsonActivity)) {
					// handle delete request via POST since angular doesn't allow to send data with DELETE HTTP
						var id = jsonActivity;
						if( id === true ) {
							dbActivityList[dbActivityName] = [];
						}
						else {
							records = _.reject(dbActivityList[dbActivityName], function(activity){
								return activity.id === id;
							});
							dbActivityList[dbActivityName] = records;
						}
					}
					else if(jsonActivity.id) {
						record = _.find(dbActivity, function(activity){ 
							return activity.id === jsonActivity.id; 
						});
						for(var key in record) {
							if(key !== "id") {
								record[key] = jsonActivity[key];
							}
							
						}	
					}
					else {
						record = schema.get(dbActivityName);
						record.id = helper.guid();
						helper.eachObject( record, function( key, value ) {
							if(key !== "id" && typeof jsonActivity[key] !== "undefined") {
								record[key] = jsonActivity[key];
							}
						});
						dbActivity.unshift(record);
					}					
				})				
			}
		});	
	}	
	return dbData;
};

exports.get = function(dbData, jsonData){
	var dbActivityList     = dbData.activityList,
		jsonActivityList   = jsonData || {},
		type = jsonActivityList.type,
		id = jsonActivityList.id,	
		record;
	if(!_.isEmpty(jsonActivityList)) {
		if(type && id){
			// get specific record of specific type from activity data
			helper.eachObject( dbActivityList, function( dbActivityName, dbActivity) {
				record = _.filter( dbActivity, function(activity) {
					return activity.id === id;
				});
				dbActivityList[dbActivityName] = record || [];
			});
		}
		else if(type){
			// get specific type activities from activity data
			helper.eachObject( dbActivityList, function( dbActivityName, dbActivity) {
				if( type !== dbActivityName) {
					dbActivityList[dbActivityName] = []	;
				}				
			})
		}
	}
	else {
		// get all data from activity data
		helper.eachObject(dbActivityList, function( dbActivityName, dbActivity ){
			dbActivityList[dbActivityName] = [];
		});
	}
	return dbData;
};

exports.remove = function(dbData, jsonData){
	var dbActivityList     = dbData.activityList,
		jsonActivityList   = jsonData && jsonData.activityList || {},
		records;
		console.log(jsonActivityList)
	if(!_.isEmpty(jsonActivityList)) {
		helper.eachObject(dbActivityList, function( dbActivityName, dbActivity ){
			if( typeof jsonActivityList[dbActivityName] !== "undefined" ){
				_.each(jsonActivityList[dbActivityName], function( id, index ){
					if( id === true ) {
						dbActivityList[dbActivityName] = [];
					}
					else {
						records = _.reject(dbActivityList[dbActivityName], function(activity){
							return activity.id === id;
						});
						dbActivityList[dbActivityName] = records;
					}
				})				
			}
		});	
	}
	else {
		// remove all data from activity list
		helper.eachObject(dbActivityList, function( dbActivityName, dbActivity ){
			dbActivityList[dbActivityName] = [];
		});
	}
	return dbData;
};
