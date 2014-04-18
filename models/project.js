var dbObj = require('./db');
var mongoose = dbObj.mongoose
,Schema = mongoose.Schema
,ObjectID = mongoose.Schema.Types.ObjectId;

var User = require('./user');
var userObj = {};

var proSchema = new Schema({
  name:  String,    //项目名称
  type: String,  //项目类型
  desc:   String,    //项目描述
  resPerson : String,   //项目负责人
  joinPerson    : Array,   //项目参与者
  approvalStartTime : {type:Date,default : Date.now},  //立项开始时间
  approvalEndTime : {type:Date,default : Date.now},  //立项结束时间
  svn :  String,    //svn地址
  priority : {type:Number,default : 1},  //项目优先级 1:高 2：中  3:低
  state : {type:Number,default : 5},  //项目状态 1:未开始 2:等待审核 3:审核通过 4:审核不通过 5:进行中 6:结束
  speed : {type:Number,default : 0}, //项目总进度
  isCheck : {type : Boolean, default : false},  //项目是否需要审核
  comment : String //项目点评
});


//+++++++++++++++Redis Four START++++++++++++++++

//list
proSchema.static('list',function(options,callback) {
	var that = this;
	if(function() {
		for(var n in userObj) {
			return false;
		}	
		return true;
	}()) {
		User.list({},function(err,users) {
			for(var i=0; i<users.length; i++) {
				if(!userObj[users[i]['_id']]) {
					userObj[users[i]['_id']] = users[i];
				}
			}
			return execList(that);
		})
	} else {
		return execList(that);
	} 

	function execList(that) {
		var curUid = options['uid'];

		if(curUid) {
			delete options['uid'];
		}

		if(typeof options['pagination'] != 'undefined') {
			//分页显示
			var perCount = options['pagination']['perCount']
				,curPage = options['pagination']['curPage'];
				delete options['pagination'];

			that.find(options,function(err, projects) {
					if(curUid) {
						var newProjects = [];
						for(var k=0; k<projects.length; k++) {
							if(options['uid'] &&  projects[k]['joinPerson'].concat(projects[k]['resPerson']).indexOf(options['uid']) > -1) {
								newProjects.push(projects[k]);
							}
						}
						projects = newProjects;
					}

					that.find(options,null,{skip:(curPage-1)*perCount,limit:perCount,sort:{approvalStartTime:'-1'}},function(err, project) {

						if(curUid) {
							var otherNewProjects = [];
							for(var k=0; k<project.length; k++) {
								if(options['uid'] &&  project[k]['joinPerson'].concat(project[k]['resPerson']).indexOf(options['uid']) > -1) {
									otherNewProjects.push(project[k]);
								}
							}
							project = otherNewProjects;
						}

						execCallbackData(err, project, projects.length);
					})
			})
		}else{

			that.find(options,function(err, project) {
				if(curUid) {
					var newProjects = [];
					for(var k=0; k<project.length; k++) {
						if(curUid &&  project[k]['joinPerson'].concat(project[k]['resPerson']).indexOf(curUid) > -1) {
							newProjects.push(project[k]);
						}
					}
					execCallbackData(err, newProjects);
				}else{
					execCallbackData(err, project);
				}
			})
		}
	}
	
	function execCallbackData(err, project, totalCount) {
		//结合user和project
		for(var i=0,len=project.length; i<len; i++) {
			project[i] = project[i].toJSON();
			var resPersonId = project[i]['resPerson'];
			
			var userProjectsObj = {};
			var userProjects = userObj[resPersonId]['projects'];
			for(var j=0; j<userProjects.length; j++) {
				userProjectsObj[userProjects[j]['pid']] = userProjects[j];
			}

			project[i]['resPerson'] = {
				'name' : userObj[resPersonId]['name']
				,'uid' : userObj[resPersonId]['_id']
				,'startTime' : userProjectsObj[project[i]['_id']]['startTime'] || ''
				,'endTime' : userProjectsObj[project[i]['_id']]['endTime']   || ''
				,'todo' : userProjectsObj[project[i]['_id']]['todo'] || ''
				,'speed' : userProjectsObj[project[i]['_id']]['speed'] || ''
			};
			project[i]['joinPersons'] = [];
			project[i]['role'] = {};
			project[i]['role']['1'] = []; //参与者
			project[i]['role']['2'] = [resPersonId]; //负责人
			// project[i]['role']['3'] = []; //管理员

			project[i]['joinPerson'].forEach(function(uid) {
				var userProjects = userObj[uid]['projects'];
				var userProjectsObj = {};
				
				for(var j=0; j<userProjects.length; j++) {
					userProjectsObj[userProjects[j]['pid']] = userProjects[j];
				}
				
				project[i]['joinPersons'].push({
					'uid'   : uid
					,'name' : userObj[uid]['name'] 
					,'speed' : typeof userProjectsObj[project[i]['_id']] !='undefined' ? userProjectsObj[project[i]['_id']]['speed'] : ''
					,'role' : typeof userProjectsObj[project[i]['_id']] != 'undefined'? userProjectsObj[project[i]['_id']]['role']　: ''
					,'startTime' : typeof userProjectsObj[project[i]['_id']] != 'undefined'? userProjectsObj[project[i]['_id']]['startTime']　: ''
					,'endTime' : typeof userProjectsObj[project[i]['_id']] != 'undefined'? userProjectsObj[project[i]['_id']]['endTime']　: ''
					,'todo' : typeof userProjectsObj[project[i]['_id']] != 'undefined'? userProjectsObj[project[i]['_id']]['todo']　: ''
				})
				
				project[i]['role']['1'].push(uid);
			});
			if(totalCount)
				project[i]['totalCount'] = totalCount;
		}
		
		callback(err,project);
	}
})

//add
proSchema.static('add',function(options,callback) {
	var newProject = new Project(options);
	newProject.save(function(err,project) {
		var resPerson = options['resPerson']
			,joinPerson = options['joinPerson'];
			// ,persons = options['persons'];   //项目登记时不涉及todo字段
			User.findOne({'_id':resPerson},function(err,user) {
				//添加负责人项目
				if(!err) {
					user['projects'].push({
						'pid' 	: project['_id'],
						'speed' : 0,
						'role'  : 2,
						'startTime' : '',
						'endTime' 	: '',
						'todo' 	: ''
					})

					User.update({'_id':resPerson},{'projects':user['projects']},function(err,u) {
						if(!err) {
							//添加参与者项目
							User.find({'_id':{'$in' : joinPerson }},function(err,us) {
								if(!err) {
									for(var i=0; i<us.length; i++) {
										us[i]['projects'].push({
											'pid' 	: project['_id'],
											'speed' : 0,
											'role'  : 1,
											'startTime' : '',
											'endTime' 	: '',
											'todo' 	: ''
										})
										User.update({'_id':us[i]['_id']},{'projects':us[i]['projects']}, function(err,use) {
											if(!err) 
												callback(err,use);
										})
									}


									
								}
							})
						}
					});
				}
			})
	})
})

//edit
proSchema.static('edit',function(options,callback) {
	var condition = options['conditionObj']
	,editObj = options['fieldObj'];

	return this.findOneAndUpdate(condition, editObj,  function(err,project) {
		callback(err,project);
	})
})

//del
proSchema.static('del',function(options,callback) {
	var condition = options['conditionObj'];
	var that = this;
	User.list({},function(err, users) {
		if(!err) {
			for(var i=0;  i < users.length; i++) {
				 var curUserProjects = users[i]['projects'];
				 var curUserNewProjects = [];
				 curUserProjects.forEach(function(val) {
				 	if(val['pid'] != condition['_id']) {
				 		curUserNewProjects.push(val)
				 	}
				 })
				User.update({'_id':users[i]['_id']},{'projects':curUserNewProjects}, function(err,use) {
					if(!err) 
						return that.remove(condition,function(err,project) {
							callback(err,project);
						})
				})

			}
		}
	})

	
})

//+++++++++++++++Redis Four  END++++++++++++++++

var Project = mongoose.model('Project', proSchema);

module.exports = Project;