var dbObj = require('./db');
var mongoose = dbObj.mongoose
,Schema = mongoose.Schema
,ObjectId = mongoose.Schema.Types.ObjectId;

var noticeSchema = new Schema({
  uid:  String,
  content:   String,
  time : {type:Date,default:Date.now},
  isRead : {type:Boolean,default:false}
});


//根据第几页页数获得对应的我的消息列表
noticeSchema.static('getNoticesByPage',function(uid, page,perCount,callback) {
	return this.find({uid : uid},null,{skip:(page-1)*perCount,limit:perCount,sort:{time:'-1'}},function(err,notices) {
		callback(err,notices);
	})
})


//+++++++++++++++Redis Four START++++++++++++++++

//list
noticeSchema.static('list',function(options,callback) {
	return this.find(options,null, {sort:{time:'-1'}},function(err,notices) {
		callback(err,notices);
	})
})

//add
noticeSchema.static('add',function(options,callback) {
	var newNotice = new Notice(options);
	newNotice.save(function(err,notice) {
		callback(err,notice);
	})
})

//edit
noticeSchema.static('edit',function(options,callback) {
	console.log(options);
	var condition = options['conditionObj']
	,editObj = options['fieldObj'];
	return this.findOneAndUpdate(condition, editObj,  function(err,notice) {
		callback(err,notice);
	})
})

//del
noticeSchema.static('del',function(options,callback) {
	var condition = options['conditionObj'];
	return this.remove(condition,function(err,notices) {
		callback(err,notices);
	})
})

//+++++++++++++++Redis Four  END++++++++++++++++

var Notice = mongoose.model('Notice', noticeSchema);


module.exports = Notice;
