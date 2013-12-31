var dbObj = require('./db');
//var ObjectID = require("mongodb").ObjectID;
var mongoose = dbObj.mongoose
,Schema = mongoose.Schema
,ObjectID = mongoose.Schema.Types.ObjectId;


var logScoreSchema = new Schema({
  name:  String,
  uid: String,
  role:   String,
  time : {type:Date,default:Date.now},
  score : {type:Number,default : 0},
  type : {type:Number,default : 1}    //1:日报  2:周报  3:签到    ...
});

//存储积分日志
logScoreSchema.static('saveLogScore',function(logScore,callback) {
  logScore.save(function(err,logScore) {
    callback(err,logScore);
  })
});


//根据第几页页数 获得积分日志列表
logScoreSchema.static('getLogScoresByMore',function(uid,page,perCount,callback) {

  if(uid) {
    return this.find({'uid':uid},null,{skip:(page-1)*perCount,limit:perCount,sort:{time:'-1'}},function(err,messags) {
      callback(err,messags);
    })
  }else{
    return this.find(null,null,{skip:(page-1)*perCount,limit:perCount,sort:{time:'-1'}},function(err,messags) {
      callback(err,messags);
    })
  }


  
});

//获取积分日志的条数
logScoreSchema.static('getLogScoreCount',function(uid,callback) {
  if(uid) {
    return this.find({'uid':uid}).count(function (err, count) {
       callback(err,count);
    });
  }else{
    return this.find().count(function (err, count) {
       callback(err,count);
    });
  }
  
}) 

// 获取最近一次的签到积分
logScoreSchema.static('getLastSignScore', function(uid, callback){
  // 按时间(time)倒序排列
  return this.find({ uid: uid, type: 3 }, 'score time', { sort: { time: -1 }, limit: 1 }, function(err, result){
    if(result.length){
      result = result[0];
    } else {
      result = false;
    }
    callback(err, result);
  });
});




var logScore = mongoose.model('Logs.score', logScoreSchema);

module.exports = logScore;