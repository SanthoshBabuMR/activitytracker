var helper = {};
helper.padZero = function(i){
  return i<10? "0"+i : ""+i;
}
helper.getMonthByIndex = function(index) {
  return static.monthList()[index];
}
helper.getMonthIndex = function(val) {
  var l = static.monthList();
  for(var i=0;i<l.length;i++) {
    if(l[i]===val){
      return i;
    }
  }
}
helper.getDaysInAMonth = function(month, year) {
  var days;
  switch(month) {
    case "feb":
      days = 28;
      break;
    case "apr": 
    case "jun": 
    case "sep": 
    case "nov": 
      days= 30;
      break;
    default:
      days= 31
  }
  if(year%4 ===0 && month === "feb"){
    days = 29
  }
  return days;
}

var static = {};
static.dateList = function() {
  return [ 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31 ];
}
static.monthList = function(){
  return ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];  
}
static.yearList = function(options) {
  var start = options && options.start || 2012,
    end   = options && options.end   || 2020,
    y     = [];
  for(var i=start; i<=end;i++){
    y.push(i);
  }
  return y;
}

var core = {};
core.getTaskModel = function() {
  return {
    description: '',
    status: '',
    comment: ''
  };
}
core.getCommitModel = function() {
  return {
    revisionNumber: '',
    files: '',
    comment: ''
  };
}


var app = angular.module('activityTracker', []);

function addActivity($http, activity, callback){
  var d      = new Date();
    routeURL = "http://localhost:6060/",
    forDate  = helper.padZero(activity.date) + "-" + activity.month + "-" + activity.year,
    routeURL += forDate.replace(/-/g,"");
  var data = {
    date: forDate,
    activityList: {
      task: activity.taskList,
      commit: activity.commitList
    }
  }
  //console.log(routeURL)
  $http
    .put(routeURL, data)
    .success(function(res, status, headers, config) {
      callback(null, res);
    }).error(function(res, status, headers, config) {
      callback(res);

    });
}

function updateActivity($http, activity){
  var d      = new Date();
    routeURL = "http://localhost:6060/",
    routeURL += activity.date.replace(/-/g,"");
  var data = {
    date: activity.date,
    activityList: {
      task: activity.activityList.task,
      commit: activity.activityList.commit
    }
  }
  console.log(activity)
  console.log(data)
  //console.log(routeURL)
  $http
    .post(routeURL, data)
    .success(function(res, status, headers, config) {
      console.log(res);
    }).error(function(res, status, headers, config) {
      console.error(res)
    });
}

function getActivityList($http, url, callback) {
  $http 
    .get(url)
    .success(function(res, status, headers, config) {         
      callback(null, res);
    }).error(function(res, status, headers, config) {
      callback(res);
    });
}

function removeActivity($http, activity, data, callback) {
  var routeURL = "http://localhost:6060/";
      routeURL  += activity.date.replace(/-/g,"");
      console.log(data)
  $http 
    .post(routeURL, data) // angular doesn't support post data for DELETE. Hence using POST
    .success(function(res, status, headers, config) {         
      callback(null, res);
    }).error(function(res, status, headers, config) {
      callback(res);
    });
}



app.controller('newActivity', function($scope, $http) {
    var newActivity = this;
    newActivity.taskList = [];
    newActivity.commitList = [];
    newActivity.dateList = static.dateList();    
    newActivity.monthList = static.monthList();
    newActivity.yearList = static.yearList();
    newActivity.date = '';
    newActivity.month = '';
    newActivity.year = '';
    newActivity.add =  false;
    newActivity.toggleDisplay = function(){
      newActivity.add = !newActivity.add;
      var now = new Date();
      newActivity.date = now.getDate();
      newActivity.month = helper.getMonthByIndex(now.getMonth());
      newActivity.year = now.getFullYear();
      newActivity.taskList = [];
      newActivity.commitList = [];
    }    
    newActivity.addTask = function() {
      newActivity.taskList.push( core.getTaskModel() );
    }
    newActivity.addCommit = function() {
      newActivity.commitList.push( core.getCommitModel() );
    }
    newActivity.removeTask = function(index) {
      newActivity.taskList.splice(index, 1);
    }
    newActivity.removeCommit = function(index) {
      newActivity.commitList.splice(index, 1);
    }   
    newActivity.save = function() {
      addActivity($http, newActivity, function() {
        newActivity.toggleDisplay();
      });
    }
});


app.controller('viewActivities', function($scope, $http) {
    var viewActivities = this;
    var today = new Date();
    var currentDate = today.getDate();
    var currentMonthIndex = today.getMonth();
    var currentMonth =  helper.getMonthByIndex(currentMonthIndex);
    var currentYear = today.getFullYear();
    var nextMonth;
    viewActivities.getDataByMonth = function(m,y) {
      var from     = helper.getDaysInAMonth(m,y)+m+y,
          to       = "01"+m+y,
          routeURL = "http://localhost:6060/list/";
      routeURL += from + "/" + to;

      getActivityList( $http, routeURL, function(err, res ){
        if(!err) {
          var listData = res.data;
          for(var i=0;i<listData.length;i++) {
            viewActivities.list.push( listData[i] )
          }
        }
        else {
          console.log("error in getting activity list ");  
        }        
      });   
      
    }

    viewActivities.list = [];
    viewActivities.getDataByMonth(currentMonth, currentYear);
    viewActivities.loadMore = function() {
      var currentMonthIndex = helper.getMonthIndex(currentMonth);
      if(currentMonthIndex === 0 ) {
        currentYear--;
        currentMonthIndex = 11;
      }
      else {
        currentMonthIndex--;
      }
      currentMonth =  helper.getMonthByIndex(currentMonthIndex);
      viewActivities.getDataByMonth(currentMonth, currentYear);
    }

    viewActivities.addTask = function(listIndex, taskIndex) {
      var taskList = viewActivities.list[listIndex].activityList.task;
      taskList.push( core.getTaskModel() );
    }
    viewActivities.addCommit = function(listIndex, commitIndex) {
      var commitList = viewActivities.list[listIndex].activityList.commit;
      commitList.push( core.getCommitModel() );
    }
    viewActivities.removeTask = function(listIndex, taskIndex) {
      var activity = viewActivities.list[listIndex],
          taskList = activity.activityList.task;
      var data = {
        activityList: {
          task: [ taskList[taskIndex].id ]
        }
      }
      removeActivity($http, activity, data, function(err, res){
         if(!err){
          console.log(res.data)
          viewActivities.list[listIndex] = res.data;
        }
      });


    }
    viewActivities.removeCommit = function(listIndex, commitIndex) {
      var activity = viewActivities.list[listIndex],
          commitList = activity.activityList.commit;
      var data = {
        activityList: {
          commit: [ commitList[commitIndex].id ]
        }
      }
      removeActivity($http, activity, data, function(err, res){
        if(!err){          
          viewActivities.list[listIndex] = res.data;
        }
      });
    }
    viewActivities.update = function(listIndex) {
      var activity = viewActivities.list[listIndex];
      updateActivity($http, activity)
    }
   
});
