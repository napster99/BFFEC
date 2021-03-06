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
  pass : {type:String,default:'passed'}, // passed unpass waiting
  
  good : {type : Number, default:0},
  articleURL : String
});

messageSchema.static('saveMessage',function(message,callback) {
	message.save(function(err,message) {
		callback(err,message);
	})
})


//根据第几页页数获得对应的消息列表
messageSchema.static('getMessagesByPage',function(type, page,perCount,callback) {
	return this.find({type:type},null,{skip:(page-1)*perCount,limit:perCount,sort:{mtime:'-1'}},function(err,messags) {
		callback(err,messags);
	})
})


//通过mid获取单条消息内容
messageSchema.static('getMessageByMid',function(mid,callback) {
	return this.where({'_id':mid}).findOne(function(err,message) {
		callback(err,message);
	})
})

//通过mid更改属性
messageSchema.static('updateMessagecNumByMid',function(mid, which, callback) {
	var self = this;
	return this.where({'_id':mid}).findOne(function(err, message) {
			var count = parseInt(message[which]) + 1;
			if(count == 12) {
				return callback(err,'max');
			}
			if(which === 'good') {
				self.update({'_id':mid},{'good':count},function(err,message) {
					console.log(count)
					callback(err, count);
				})	
			}else{
				self.update({'_id':mid},{'clickCount':count},function(err,message) {
					callback(err, message);
				})
			}
			
		})

		// return this.findOneAndUpdate();
	}
)



//根据第几页页数、uid 获得消息 日报 周报 列表
messageSchema.static('getMessagesByMore',function(page,perCount,uid,type,callback) {
	return this.find({type:type,uid:uid},null,{skip:(page-1)*perCount,limit:perCount,sort:{mtime:-1}},function(err,messags) {
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

//获取消息总条数通过用户ID和类型
messageSchema.static('getMessagesCountByUid',function(uid,type,callback) {
	return this.where({'uid': uid,'type' : type}).count(function (err, count) {
			 callback(err,count);
		});
}) 

//获取话题的条数
messageSchema.static('getTopicCount',function(uid,callback) {
  if(uid) {
    return this.find({'uid':uid,'type':'normal'}).count(function (err, count) {
       callback(err,count);
    });
  }else{
    return this.find({'type':'normal'}).count(function (err, count) {
       callback(err,count);
    });
  }
}) 

//获取文章的条数
messageSchema.static('getArticleCount',function(uid,callback) {
  if(uid) {
    return this.find({'uid':uid,'type':'article'}).count(function (err, count) {
       callback(err,count);
    });
  }else{
    return this.find({'type':'article'}).count(function (err, count) {
       callback(err,count);
    });
  }
}) 

//根据第几页页数 获得话题列表
messageSchema.static('getTopicByMore',function(uid,page,perCount,callback) {
  if(uid) {
    return this.find({'uid':uid,'type':'normal'},null,{skip:(page-1)*perCount,limit:perCount,sort:{mtime:'-1'}},function(err,messags) {
      callback(err,messags);
    })
  }else{
    return this.find({'type':'normal'},null,{skip:(page-1)*perCount,limit:perCount,sort:{mtime:'-1'}},function(err,messags) {
      callback(err,messags);
    })
  }
});

//根据第几页页数 获得文章列表
messageSchema.static('getArticleByMore',function(uid,page,perCount,callback) {
  if(uid) {
    return this.find({'uid':uid,'type':'article'},null,{skip:(page-1)*perCount,limit:perCount,sort:{mtime:'-1'}},function(err,messags) {
      callback(err,messags);
    })
  }else{
    return this.find({'type':'article'},null,{skip:(page-1)*perCount,limit:perCount,sort:{mtime:'-1'}},function(err,messags) {
      callback(err,messags);
    })
  }
});


//根据状态不同获取日报
messageSchema.static('getDailyListByStatus',function(status,page,perCount,callback) {
	if(status === '') {
		return this.find({'type':'day'},null,{skip:(page-1)*perCount,limit:perCount,sort:{mtime:'-1'}},function(err,messags) {
			callback(err,messags);
		})
	}else{
		return this.find({'type':'day','pass':status},null,{skip:(page-1)*perCount,limit:perCount,sort:{mtime:'-1'}},function(err,messags) {
			callback(err,messags);
		})
	}
})


//获取热门文章
messageSchema.static('getHotArticles',function(callback) {
	return this.find({'type': 'article'},null,{'sort': { 'good':'-1'},'limit': 10},function (err, messags) {
			 callback(err,messags);
		});
}) 

//+++++++++++++++Redis Four START++++++++++++++++

//list
messageSchema.static('list',function(options,callback) {
	return this.find(options,null, {sort:{mtime:'-1'}},function(err,users) {
		callback(err,users);
	})
})

//add
messageSchema.static('add',function(options,callback) {
	var newMessage = new User(options);
	newMessage.save(function(err,user) {
		callback(err,user);
	})
})

//edit
messageSchema.static('edit',function(options,callback) {
	var condition = options['conditionObj']
	,editObj = options['fieldObj'];

	return this.findOneAndUpdate(condition, editObj,  function(err,user) {
		callback(err,user);
	})
})

//del
messageSchema.static('del',function(options,callback) {
	var condition = options['conditionObj'];
	return this.remove(condition,function(err,users) {
		callback(err,users);
	})
})

//+++++++++++++++Redis Four  END++++++++++++++++

var Message = mongoose.model('Message', messageSchema);


module.exports = Message;
