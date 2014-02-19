var dbObj = require('./db');
//var ObjectID = require("mongodb").ObjectID;
var mongoose = dbObj.mongoose
,Schema = mongoose.Schema
,ObjectID = mongoose.Schema.Types.ObjectId;

var LogScore = require('./logs');

var userSchema = new Schema({
  name:  String,    //姓名
  password: String,  //密码
  role:   String,    //角色
  mobile : {type:String,default:''},   //手机号码
  uid    : String,   //uid
  avatar : {type:String,default : '../images/avatar.jpg'},  //个人头像地址
  email : {type:String,default:''},    //邮件
  url : {type:String,default:''},    //个人主页
  signature : {type:String,default:''},    //个性签名
  profile : {type:String,default:''},    //个人简介
  weibo : {type:String,default:''},    //微博
  score : {type:Number,default : 0},
  flag : {
  	sign : {type:String,default:''},
  	day : {type:String,default:''}
  },
  projects : [{
  	pid : String,	  //项目id
  	speed : Number,   //项目进度
  	role : Number,    //1 参与者  2 负责人  3 管理员
  	startTime : Date, //项目开始时间
  	endTime : Date,   //项目结束时间
  	todo : String     //项目中负责的模块
  }],
  auth : {type:Array, default :[]}    //权限
});

userSchema.static('saveUser',function(user,callback) {
	user.save(function(err,user) {
		callback(err,user);
	})
})

//根据所有用户
userSchema.static('getUsers',function(callback) {
	return this.find(function(err,users) {
		callback(err,users);
	})
})


//根据管理员
userSchema.static('getAdmins',function(callback) {
	return this.find({'role':'2'},function(err,users) {
		callback(err,users);
	})
});

//根据密码获取用户
userSchema.static('getUserByPwd',function(password,callback) {
	return this.findOne({password : password},function(err,user) {
		callback(err,user);
	})
});

//根据更新用户密码
userSchema.static('setUserPwd',function(user,newPassword,callback) {
	return this.findOneAndUpdate({'_id' : user._id}, { password: newPassword },  function(err,user) {
		callback(err,user);
	})
});

//通过uids（数组）获取用户信息
userSchema.static('getUsersByUids',function(uids,callback) {
	return this.find({ "_id" : { $in : uids } },function(err,users) {
		callback(err,users);
	})
});

//通过uid得到uname
userSchema.static('getUserFieldByUid',function(uid,users,field) {
	for(var i=0; i<users.length; i++) {
		if(uid == users[i]['_id']) return users[i][field];
	}
	return '';
})

//通过uid获取User对象
userSchema.static('getUserByUid', function(uid,callback) {
	return this.findOne({ "_id" :  uid },function(err,user) {
		callback(err,user);
	})
});

//更新积分
userSchema.static('updateScore',function(uid,score,callback) {

  return this.findOneAndUpdate({ "_id" : uid }, { score: score, 'flag.sign': (new Date).format('yyyy-MM-dd') },  function(err,user) {
    callback(err,user);
  })
});

//更新积分Admin（消息）
userSchema.static('updateScoreAdmin',function(uid,score,logOptions,callback) {

        var logScore = new LogScore({
                name : logOptions['name'],
                uid : logOptions['uid'],
                score : logOptions['score'],
                type : logOptions['type'],
                totalScore : logOptions['totalScore'],
                mark : logOptions['mark']
        });

        LogScore.saveLogScore(logScore,function(err,data) {
        });

        // var notice = new Notice({
        // 	'uid' : uid,
        // 	'content' : ''
        // });



        
        return this.findOneAndUpdate({ "_id" : uid }, { score: score },  function(err,user) {
                        callback(err,user);
                })
});

//通过uid获取更新签到
userSchema.static('changeSignStatus', function(uid,callback) {
	var nowDate = new Date();
	var sign = nowDate.format('yyyy-MM-dd');
	return this.findOneAndUpdate({ "_id" : uid }, { 'flag.sign': sign },  function(err,user) {
			callback(err,user);
		})
});

//积分排行榜
userSchema.static('getRanking',function(callback) {
	return this.find().sort({'score':-1}).exec(callback);;
});

//更新个人信息
userSchema.static('updateUser',function(uid,user,callback) {
	
	return this.findOneAndUpdate({ "_id" : uid }, {'name':user.name, 'mobile': user.mobile,'email':user.email,'url':user.url,'signature' : user.signature,'profile':user.profile,'weibo':user.weibo },  function(err,user) {
			callback(err,user);
		});
});

//个人进度更新
userSchema.static('projectEdit',function(options,callback) {
	var that = this;
	var pid 	= options['conditionObj']['pid']
	,uid 		= options['conditionObj']['uid']
	,speed		= options['fieldObj']['speed']
	,startTime 	= options['fieldObj']['startTime']
	,endTime 	= options['fieldObj']['endTime']
	,todo 		= options['fieldObj']['todo']
	,role		= options['fieldObj']['role']
	return that.findOne({'_id':uid},function(err,user) {
		var projects = user['projects'];
		for(var i=0; i<projects.length; i++) {
			projects[i] = projects[i].toJSON();
			if(pid == projects[i]['pid']) {
				projects[i] = {
					'pid'   : pid,
					'speed' : speed,
					'startTime' : startTime,
					'endTime' : endTime,
					'role'   : role, 
					'todo' : todo
				}
				break;
			}						
		}
		that.update({'_id' : uid},{'projects' : projects},function(err,user) {
			callback(err,user);
		})
	});

})

//重置权限
userSchema.static('resetAuth',function(uid,callback) {
	return this.update({ "_id" : uid }, {"auth":''},  function(err,user) {
		callback(err,user);
	})
})


//+++++++++++++++Redis Four START++++++++++++++++

//list
userSchema.static('list',function(options,callback) {
	return this.find(options,function(err,users) {
		callback(err,users);
	})
})

//add
userSchema.static('add',function(options,callback) {
	var newUser = new User(options);
	newUser.save(function(err,user) {
		callback(err,user);
	})
})

//edit
userSchema.static('edit',function(options,callback) {
	var condition = options['conditionObj']
	,editObj = options['fieldObj'];
	return this.findOneAndUpdate(condition, editObj,  function(err,user) {
		callback(err,user);
	})
})

//del
userSchema.static('del',function(options,callback) {
	var condition = options['conditionObj'];
	return this.remove(condition,function(err,users) {
		callback(err,users);
	})
})

//+++++++++++++++Redis Four  END++++++++++++++++



var User = mongoose.model('User', userSchema);

module.exports = User;