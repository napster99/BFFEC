var dbObj = require('./db');
//var ObjectID = require("mongodb").ObjectID;
var mongoose = dbObj.mongoose
,Schema = mongoose.Schema
,ObjectId = mongoose.Schema.Types.ObjectId;



// function Reply(mid, content, uid, time) {
// 	this.mid = mid || '';
// 	this.rcontent = content;
// 	this.uid = uid;
// 	this.rtime = time || +new Date();
// };


var replySchema = new Schema({
  mid:  String,
  rcontent: String,
  type:   {type:String,default:'normal'},   //normal  admin
  uid    : String,
  rtime : {type:Date,default:Date.now}
});


replySchema.static('saveReply',function(reply,callback) {

	reply.save(function(err,reply) {
		callback(err,reply);
	})
});

//根据mid获取对应的reply对象
replySchema.static('getReplysByMids',function(midsArr,callback) {
	return this.find({'mid':{$in:midsArr}},function(err,docs) {
		callback(err,docs);
	})
});

replySchema.static('getReplyCountByMid',function(mid,arrs) {
	var count = 0;
	for(var i=0; i<arrs.length; i++) {
		if(mid == arrs[i]['mid']) count++;
	}
	return count;
});

//更新日报评语(基于日报没法回复，才可行)
replySchema.static('updateDailyComment',function(mid,content,callback) {
	return this.update({'mid':mid},{'rcontent':content},function(err,message) {
				callback(err,message);
			});
});



//+++++++++++++++Redis Four START++++++++++++++++

//list
replySchema.static('list',function(options,callback) {
	return this.find(options,function(err,users) {
		callback(err,users);
	})
})

//add
replySchema.static('add',function(options,callback) {
	var newReply = new User(options);
	newReply.save(function(err,user) {
		callback(err,user);
	})
})

//edit
replySchema.static('edit',function(options,callback) {
	var condition = options['conditionObj']
	,editObj = options['fieldObj'];

	return this.findOneAndUpdate(condition, editObj,  function(err,user) {
		callback(err,user);
	})
})

//del
replySchema.static('del',function(options,callback) {
	var condition = options['conditionObj'];
	return this.remove(condition,function(err,users) {
		callback(err,users);
	})
})

//+++++++++++++++Redis Four  END++++++++++++++++


var Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;