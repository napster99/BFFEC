var dbObj = require('./db');
var mongoose = dbObj.mongoose
,Schema = mongoose.Schema
,ObjectId = mongoose.Schema.Types.ObjectId;

var messageSchema = new Schema({
  mid:  String,
  mtitle: String,
  mcontent:   String,
  uid    : String,
  mtime : {type:Date,default:Date.now},
  clickCount : {type:Number,default:0},
  type : String,
  pass : {type:String,default:'passed'}  // passed unpass waiting
});

messageSchema.static('saveMessage',function(message,callback) {
	message.save(function(err,message) {
		callback(err,message);
	})
})


//根据第几页页数获得对应的消息列表
messageSchema.static('getMessagesByPage',function(page,perCount,callback) {
	return this.find({type:'normal'},null,{skip:(page-1)*perCount,limit:perCount},function(err,messags) {
		callback(err,messags);
	})
})


//通过mid获取单条消息内容
messageSchema.static('getMessageByMid',function(mid,callback) {
	return this.where({'_id':mid}).findOne(function(err,message) {
		callback(err,message);
	})
})

//通过mid更改点击数
messageSchema.static('updateMessagecNumByMid',function(mid,callback) {
	var self = this;
	return this.where({'_id':mid}).findOne(function(err,message) {
			var count = parseInt(message['clickCount']) + 1;
			self.update({'_id':mid},{'clickCount':count},function(err,message) {
				callback(err,message);
			})
		})

		// return this.findOneAndUpdate();
	}
)



//根据第几页页数、uid 获得消息 日报 周报 列表
messageSchema.static('getMessagesByMore',function(page,perCount,uid,type,callback) {
	return this.find({type:type,uid:uid},null,{skip:(page-1)*perCount,limit:perCount},function(err,messags) {
		callback(err,messags);
	})
})

//获取消息总条数通过类型
messageSchema.static('getMessagesCountByType',function(type,callback) {
	return this.where('type', type).count(function (err, count) {
			 callback(err,count);
		});
}) 

//获取消息总条数通过类型&uid
messageSchema.static('getMessagesCountByMore',function(type,uid,callback) {
	return this.where({'type': type,'uid' : uid}).count(function (err, count) {
			 callback(err,count);
		});
}) 

//获取待审核消息
messageSchema.static('getUnPassMessages',function(callback) {
	return this.find({'type': 'day','pass' : 'waiting'},function (err, messags) {
			 callback(err,messags);
		});
}) 

//通过mid更改当前message状态【审核】 Admin
messageSchema.static('changeMessageStatus',function(mid,status,callback) {
	var self = this;
	return this.where({'_id':mid}).findOne(function(err,message) {
			self.update({'_id':mid},{'pass':status},function(err,message) {
				callback(err,message);
			})
		})

		// return this.findOneAndUpdate();
	}
)

//通过mid更新日报内容
messageSchema.static('updateMessageContentByMid',function(mid,content,callback) {
	var self = this;
	return this.where({'_id':mid}).findOne(function(err,message) {
			self.update({'_id':mid},{'mcontent':content},function(err,row) {
				callback(err,row);
			})
		})
	}
)

var Message = mongoose.model('Message', messageSchema);


module.exports = Message;
