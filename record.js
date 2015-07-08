<!DOCTYPE html>
<html lang="en" ng-app="activityTracker">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Activity Tracker</title>
		<!-- css begin -->
		<link rel="stylesheet" href="/style/base.css" />
		<!-- css end -->
	</head>
	<body>

		<!-- doc-wrap begin -->
		<div class="doc-wrap">
			<header class="page-header">
				<h1 class="title">Activity Tracker</h1>
			</header>
			<section class="page-content">
				<section class="add-data">
					<div ng-controller="newActivity as activity">
						<div ng-class="{'status-message':statusMessage}">{{statusMessage}}</div>
						<input type="button" value="Add Activity" ng-click="activity.toggleDisplay()" ng-show="!activity.add"/>
						<input type="button" value="Close" ng-click="activity.toggleDisplay()" ng-show="activity.add"/>
						<form ng-submit="activity.save()" ng-show="activity.add">
							<div class="group">
								<span>Adding activity for : </span>
								<select ng-options="date for date in activity.dateList" ng-model="activity.date">
									<option value="">Date</option>
								</select>
								<select ng-options="month for month in activity.monthList" ng-model="activity.month">
									<option value="">Month</option>
								</select>
								<select ng-options="year for year in activity.yearList" ng-model="activity.year">
									<option value="">Year</option>
								</select>
							</div>							
							<fieldset class="group-task">
								<legend class="title-task" tabindex="0" title="add task"><span ng-click="activity.addTask()">[+]Task Details</span></legend>
								<div ng-repeat="task in activity.taskList" class="row">
									<div class="remove-container">
										<div ng-class="{'remove-confirm': task.removeConfirm}">
											<div ng-show="task.removeConfirm" class="options">
												<input type="button" value="cancel" ng-click="activity.cancelRemoveTask($index)">
												<input type="button" value="confirm remove task" ng-click="activity.removeTask($index)">
											</div>
											<span ng-click="activity.confirmRemoveTask($index)" tabindex="0" class="action" title="remove task">[x]</span>
											<label class="lbl status">
												<span class="hide-from-screen">Status</span>
												<select ng-options="status for status in activity.statusList" ng-model="task.status">
													<option value="">Status</option>
												</select>

											</label>
											<label class="lbl description">
												<span class="hide-from-screen">Description</span>
												<textarea ng-model="task.description" placeholder="add description"></textarea>
											</label>									
											<label class="lbl comment">
												<span class="hide-from-screen">Comment</span>
												<textarea ng-model="task.comment" placeholder="comment"></textarea>
											</label>
										</div>
									</div>
								</div>
							</fieldset>
							<fieldset class="group-commit">
								<legend class="title-commit" tabindex="0" title="add commit"><span ng-click="activity.addCommit()">[+]Commit Details</span></legend>
								<div ng-repeat="commit in activity.commitList" class="row">
									<div class="remove-container">
										<div ng-class="{'remove-confirm': commit.removeConfirm}">
											<div ng-show="commit.removeConfirm" class="options">
												<input type="button" value="cancel" ng-click="activity.cancelRemoveCommit($index)">
												<input type="button" value="confirm remove commit" ng-click="activity.removeCommit($index)">
											</div>
											<span ng-click="activity.confirmRemoveCommit($index)" tabindex="0" class="action" title="remove commit">[x]</span>
											<label class="lbl revision">
												<span class="hide-from-screen">Revision Number</span>
												<input type="text" ng-model="commit.revision" placeholder="revision number">
											</label>
											<label class="lbl files">
												<span class="hide-from-screen">Files</span>
												<textarea ng-model="commit.files" placeholder="file(s) added/updated/deleted"></textarea>
											</label>
											<label class="lbl comment">
												<span class="hide-from-screen">Comment</span>
												<textarea ng-model="commit.comment" placeholder="comment"></textarea>
											</label>
										</div>
									</div>
			
								</div>								
							</fieldset>
							<input type="submit" value="Save" />
						</form>
					</div>
				</section>

				<section class="view-data">
					<h1 class="title">
						Previous Activity List
					</h1>
					<div ng-controller="viewActivities as activity">
						<div ng-class="{'status-message':statusMessage}">{{statusMessage}}</div>
						<div ng-repeat="(listIndex, list) in activity.list">
							<section class="group">
								<header>
									<!-- <h2 class="sub-title">{{list.date}}</h2> -->
									<select ng-options="date for date in activity.dateList" ng-model="list.dateVal">
										<!-- <option value="">Date</option> -->
									</select>
									<select ng-options="month for month in activity.monthList" ng-model="list.monthVal">
										<!-- <option value="">Month</option> -->
									</select>
									<select ng-options="year for year in activity.yearList" ng-model="list.yearVal">
										<!-- <option value="">Year</option> -->
									</select>

								</header>
								<article>
									<form>
										<fieldset class="group-task">
											<legend class="title-task" tabindex="0" title="add task"><span ng-click="activity.addTask(listIndex, $index)">[+]Task Details</span></legend>
											<div ng-show="!list.activityList.task.length"><em class="hint">{{activity.noTask}}</em></div>
											<div ng-repeat="task in list.activityList.task" class="row">
												<div class="remove-container">
													<div ng-class="{'remove-confirm': task.removeConfirm}">
															<div ng-show="task.removeConfirm" class="options">
																<input type="button" value="cancel" ng-click="activity.cancelRemoveTask(listIndex, $index)">
																<input type="button" value="confirm remove task" ng-click="activity.removeTask(listIndex, $index)">
															</div>														
															<span ng-click="activity.confirmRemoveTask(listIndex, $index)" class="action" title="remove task">[x]</span>
															<label class="lbl status">
																<span class="hide-from-screen">Status</span>
																<select ng-options="status for status in activity.statusList" ng-model="task.status">
																	<option value="">Status</option>
																</select>
															</label>
															<label class="lbl description">
																<span class="hide-from-screen">Description</span>
																<textarea ng-model="task.description" placeholder="add description"></textarea>
															</label>
															<label class="lbl comment">
																<span class="hide-from-screen">Comment</span>
																<textarea ng-model="task.comment" placeholder="comment"></textarea>
															</label>
													</div>															
												</div>
												
											</div>
										</fieldset>
										<fieldset class="group-commit">
											<legend class="title-commit" tabindex="0" title="add commit"><span ng-click="activity.addCommit(listIndex, $index)">[+]Commit Details</span></legend>
											<div ng-show="!list.activityList.commit.length"><em class="hint">{{activity.noCommit}}</em></div>
											<div ng-repeat="commit in list.activityList.commit" class="row">
												<div class="remove-container">
													<div ng-class="{'remove-confirm': commit.removeConfirm}">
														<div ng-show="commit.removeConfirm" class="options">
															<input type="button" value="cancel" ng-click="activity.cancelRemoveCommit(listIndex, $index)">
															<input type="button" value="confirm remove commit" ng-click="activity.removeCommit(listIndex, $index)">
														</div>	
														<span ng-click="activity.confirmRemoveCommit(listIndex, $index)" class="action" title="remove commit">[x]</span>
														<label class="lbl revision">
															<span class="hide-from-screen">Revision</span>
															<input type="text" ng-model="commit.revision" placeholder="revision number">
														</label>
														<label class="lbl files">
															<span class="hide-from-screen">Files</span>
															<textarea ng-model="commit.files" placeholder="file(s) added/updated/deleted"></textarea>
														</label>
														<label class="lbl comment">
															<span class="hide-from-screen">Comment</span>
															<textarea ng-model="commit.comment" placeholder="comment"></textarea>
														</label>
													</div>
													
												</div>
											</div>	
										</fieldset>
										<input type="submit" value="update activity" ng-submit="activity.update($index)" />
										<input type="submit" value="delete activity" ng-submit="activity.confirmRemoveAll($index)" />
									</form>
								</article>
							</section>							
						</div>
						<button ng-click="activity.loadMore()">Load Data for Next Month</button>



					</div>
				</section>
			</section>	


		</div>
		<!-- doc-wrap end -->

		<!-- script begin -->
		<script src="/script/vendor/angular.js"></script>
		<script src="/script/module/index.js"></script>
		<!-- script end -->
	</body>
</html>
