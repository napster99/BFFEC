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
  email : {type:String,default:''},    //邮件
  url : {type:String,default:''},    //个人主页
  signature : {type:String,default:''},    //个性签名
  profile : {type:String,default:''},    //个人简介
  weibo : {type:String,default:''},    //微博
  score : {type:Number,default : 0},
  flag : {
  	sign : {type:String,default:''},
  	day : {type:String,default:''}
  }
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
userSchema.static('getUsernameByUid',function(uid,users) {
	for(var i=0; i<users.length; i++) {
		if(uid == users[i]['_id']) return users[i]['name'];
	}
	return '';
})


//通过uid获取User对象
userSchema.static('getUserByUid', function(uid,callback) {
	console.log(uid);
	return this.findOne({ "_id" :  uid },function(err,user) {
		console.log(user)
		callback(err,user);
	})
});


//更新积分
userSchema.static('updateScore',function(uid,score,callback) {

  return this.findOneAndUpdate({ "_id" : uid }, { score: score, 'flag.sign': (new Date).format('yyyy-MM-dd') },  function(err,user) {
    callback(err,user);
  })
});


//更新积分Admin
userSchema.static('updateScoreAdmin',function(uid,score,logOptions,callback) {

        var logScore = new LogScore({
                name : logOptions['name'],
                uid : logOptions['uid'],
                score : logOptions['score'],
                type : logOptions['type']
        });

        LogScore.saveLogScore(logScore,function(err,data) {
                if(!err) {
                        console.log('日志已经写入...'+data)
                }
        });
        
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




var User = mongoose.model('User', userSchema);

module.exports = User;