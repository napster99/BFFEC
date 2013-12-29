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

var Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;