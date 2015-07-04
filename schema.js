var _             = require("underscore");

exports.get = function(type){
	var taskSchema = {
        "id": "",
        "description": "",
        "status": "",
        "comment": ""
    };
	var commitSchema  = {
        "id": "",
        "revision": "",
        "files": [],
        "comment": ""
    };
    var fileSchema =  {
	    "date": "",
	    "activityList": {
	    	"task": [taskSchema],
	    	"commit": [commitSchema]	
	    }	    
	};
	if(type === "task") {
		return taskSchema;
	}
	else if(type === "commit") {
		return commitSchema;
	}
	else if(type === "file") {
		return fileSchema;
	}
}

exports.normalizeData = function( schema, data ){
	for(var i in schema){
		if(_.isObject(schema[i])) {
			schema[i] = exports.normalizeData(schema[i], data[i] || {});
		}
		else if(_.isArray(schema[i])) {
			for( var j=0; j<schema[i].length;j++) {
				if(_.isObject(schema[i][j])){
					if(data[i] && data[i][j]) {
						schema[i][j] = exports.normalizeData(schema[i], data[i][j]);
					}					
				}
			}
		}
		else if(!_.isUndefined(schema[i])) {
			if(typeof data[i] !== "undefined"){
				schema[i] =  data[i];	
			}			
		}
	}
	return schema;
}

exports.skeleton = function(){
	//var d = new Date();
	return {
		date: '',
		activityList:{
			task: [],
			commit: []
		}
	}
}