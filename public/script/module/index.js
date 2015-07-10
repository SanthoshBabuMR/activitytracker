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
helper.grepDate = function(d) {
  return d && d.split("-") && window.parseInt(d.split("-")[0],10) || null;
}
helper.grepMonth = function(d) {
  return d && d.split("-") && d.split("-")[1] || null;
}
helper.grepYear = function(d) {
  return d && d.split("-") && window.parseInt(d.split("-")[2],10) || null;
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
static.statusList = function(){
  return ["Yet To Begin", "Pending", "Complete", "Clarification Required"];  
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
    forDate  = helper.padZero(activity.date) + "-" + activity.month + "-" + activity.year;
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

function updateActivity($http, activity, callback){
  var d      = new Date();
    routeURL = "http://localhost:6060/";
  routeURL += activity.date.replace(/-/g,"");
  var data = {
    date: activity.date,
    activityList: {
      task: activity.activityList.task,
      commit: activity.activityList.commit
    }
  }
  //console.log(routeURL)
  $http
    .post(routeURL, data)
    .success(function(res, status, headers, config) {
      callback(null, res);
    }).error(function(res, status, headers, config) {
      callback(true, res);
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



app.controller('newActivity', function($scope, $http, $timeout) {
    var newActivity = this;
    newActivity.taskList = [];
    newActivity.commitList = [];
    newActivity.dateList = static.dateList();    
    newActivity.monthList = static.monthList();
    newActivity.yearList = static.yearList();
    newActivity.statusList = static.statusList();
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
      newActivity.taskList.unshift( core.getTaskModel() );
    }
    newActivity.addCommit = function() {
      newActivity.commitList.unshift( core.getCommitModel() );
    }
     newActivity.cancelRemoveTask = function(index){
      newActivity.taskList[index].removeConfirm = false;
    }
    newActivity.confirmRemoveTask = function(index) {
      var task = newActivity.taskList[index];
      if(!task.status && !task.description && !task.comment) {
        newActivity.removeTask(index);
      }
      else {
        task.removeConfirm = true;  
      }      
    }
    newActivity.removeTask = function(index) {
      newActivity.taskList.splice(index, 1);
    }
    newActivity.cancelRemoveCommit = function(index){
      newActivity.commitList[index].removeConfirm = false;
    }
    newActivity.confirmRemoveCommit = function(index) {
      var commit = newActivity.commitList[index];
      if(!commit.revisionNumber && !commit.files && !commit.comment) {
        newActivity.removeCommit(index);
      }
      else {
        commit.removeConfirm = true;  
      }  
    }
    newActivity.removeCommit = function(index) {
      newActivity.commitList.splice(index, 1);
    }   
    newActivity.save = function() {
      addActivity($http, newActivity, function(err, res) {
        if(!err) {
          newActivity.toggleDisplay();
          newActivity.setStatusMessage("added activity for " + res.data.date);  
        }        
      });
    }
    newActivity.configureStatusMessage = (function(scope,timeout) {
      scope.statusMessage = "";
      newActivity.setStatusMessage = function(msg) {
        scope.statusMessage = msg;
        timeout(newActivity.clearStatusMessage, 2000);
      }
      newActivity.clearStatusMessage = function(){
        scope.statusMessage = "";
      }
    })($scope,$timeout);
    
});


app.controller('viewActivities', function($scope, $http, $timeout) {
    var viewActivities = this;
    var today = new Date();
    var currentDate = today.getDate();
    var currentMonthIndex = today.getMonth();
    var currentMonth =  helper.getMonthByIndex(currentMonthIndex);
    var currentYear = today.getFullYear();
    var nextMonth;
    var timer;
    viewActivities.dateList = static.dateList();    
    viewActivities.monthList = static.monthList();
    viewActivities.yearList = static.yearList();
    viewActivities.statusList = static.statusList();
    viewActivities.noTask = 'No task(s) added for the day.';
    viewActivities.noCommit = 'No commit(s) added for the day.'
    viewActivities.hasTask = true;
    viewActivities.hasCommit = true;
    viewActivities.loadMoreInProgress = false;
 
    viewActivities.getDataByMonth = function(m,y, callback) {
      var from     = helper.getDaysInAMonth(m,y)+m+y,
          to       = "01"+m+y,
          routeURL = "http://localhost:6060/list/";
      routeURL += from + "/" + to;

      getActivityList( $http, routeURL, function(err, res ){
        if(!err) {
          var listData = res.data,
              indList;
          for(var i=0;i<listData.length;i++) {

            indList = listData[i];
            indList.dateVal = helper.grepDate(indList.date);
            indList.monthVal = helper.grepMonth(indList.date);
            indList.yearVal = helper.grepYear(indList.date);
            viewActivities.list.push( indList );
          }
        }
        else {
          console.log("error in getting activity list ");  
        }
        if(typeof callback === "function"){
          callback(err, res);
        }
      });   
      
    }

    viewActivities.list = [];
    viewActivities.getDataByMonth(currentMonth, currentYear);
    viewActivities.loadMore = function() {
      viewActivities.loadMoreInProgress = true;
      var currentMonthIndex = helper.getMonthIndex(currentMonth);
      if(currentMonthIndex === 0 ) {
        currentYear--;
        currentMonthIndex = 11;
      }
      else {
        currentMonthIndex--;
      }
      currentMonth =  helper.getMonthByIndex(currentMonthIndex);
      viewActivities.loadMore.statusMessage = "loading data for " + currentMonth + " " + currentYear;
      viewActivities.setStatusMessage("loading data for " + currentMonth + " " + currentYear);
      viewActivities.getDataByMonth(currentMonth, currentYear, function(err, res){
        viewActivities.loadMoreInProgress = false;
        if(!err && res.data && !res.data.length) {
          viewActivities.setStatusMessage("no activity added for " + currentMonth + " " + currentYear);
        }
        else {
         viewActivities.setStatusMessage("loaded activities for " + currentMonth + " " + currentYear); 
        }        
      });
    }


    viewActivities.addTask = function(listIndex, taskIndex) {
      var activity = viewActivities.list[listIndex];
      var taskList = activity.activityList.task;
      taskList.unshift( core.getTaskModel() );
      activity.forDeletion = false;
    }
    viewActivities.addCommit = function(listIndex, commitIndex) {
      var activity = viewActivities.list[listIndex];
      var commitList = activity.activityList.commit;
      commitList.unshift( core.getCommitModel() );
      activity.forDeletion = false;
    }
    viewActivities.confirmRemoveTask = function(listIndex, taskIndex) {
      var activity = viewActivities.list[listIndex],
          taskList = activity.activityList.task;
      taskList[taskIndex].removeConfirm = true;
      activity.forDeletion = false;
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
          viewActivities.list[listIndex].date = res.data.date;
          viewActivities.list[listIndex].dateVal = helper.grepDate(res.data.date);
          viewActivities.list[listIndex].monthVal = helper.grepMonth(res.data.date);
          viewActivities.list[listIndex].yearVal = helper.grepYear(res.data.date);
          viewActivities.list[listIndex].activityList = res.data.activityList;
          viewActivities.setStatusMessage("task removed successfully");
        }
      });
    }
    viewActivities.confirmDeleteAll = function(listIndex){
      var activity = viewActivities.list[listIndex];
      activity.forDeletion = true;
    }
    viewActivities.deleteConfirm = function(listIndex) {
        var activity = viewActivities.list[listIndex],
            routeURL = "http://localhost:6060/";
        routeURL += activity.date.replace(/-/g,"");
        $http.delete(routeURL)
          .success(function(res, status, headers, config) {
            //callback(null, res);
            if(res.data === null){
              viewActivities.list.splice(listIndex,1);
            }
            else {
              viewActivities.list[listIndex] = res.data;
            }
          }).error(function(res, status, headers, config) {
            //callback(res);
          });
    }
    viewActivities.cancelDeleteConfirm = function(listIndex){
      var activity = viewActivities.list[listIndex];
      activity.forDeletion = false;
    }
    viewActivities.cancelRemoveTask = function(listIndex, taskIndex){
      var activity = viewActivities.list[listIndex],
          taskList = activity.activityList.task;
      taskList[taskIndex].removeConfirm = false;
    }
    viewActivities.confirmRemoveCommit = function(listIndex, commitIndex) {
      var activity = viewActivities.list[listIndex],
          commitList = activity.activityList.commit;
      commitList[commitIndex].removeConfirm = true;
      activity.forDeletion = false;
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
          viewActivities.list[listIndex].date = res.data.date;
          viewActivities.list[listIndex].dateVal = helper.grepDate(res.data.date);
          viewActivities.list[listIndex].monthVal = helper.grepMonth(res.data.date);
          viewActivities.list[listIndex].yearVal = helper.grepYear(res.data.date);
          viewActivities.list[listIndex].activityList = res.data.activityList;
          viewActivities.setStatusMessage("commit removed successfully");
        }
      });
    }
     viewActivities.cancelRemoveCommit = function(listIndex, commitIndex){
      var activity = viewActivities.list[listIndex],
          commitList = activity.activityList.commit;
      commitList[commitIndex].removeConfirm = false;
    }
    viewActivities.update = function(listIndex) {
      var activity = viewActivities.list[listIndex];
      updateActivity($http, activity, function(err, res) {
        if(!err) {
          viewActivities.list[listIndex].date = res.data.date;
          viewActivities.list[listIndex].dateVal = helper.grepDate(res.data.date);
          viewActivities.list[listIndex].monthVal = helper.grepMonth(res.data.date);
          viewActivities.list[listIndex].yearVal = helper.grepYear(res.data.date);
          viewActivities.list[listIndex].activityList = res.data.activityList;
          viewActivities.setStatusMessage("Update Successful");          
        }
      });
    };
    viewActivities.configureStatusMessage = (function(scope, timeout) {
      $scope.statusMessage = "";
      timeout.cancel(timer);
      viewActivities.setStatusMessage = function(msg) {
        scope.statusMessage = msg;
        timer = timeout(viewActivities.clearStatusMessage, 2000);
      }
      viewActivities.clearStatusMessage = function(){
        scope.statusMessage = "";
      }
    })($scope, $timeout);
    
   
});
