/*
 * message控制器
 */
var crypto = require('crypto');
// var User = require('../models/user');
// var Message = require('../models/message');
// var Reply = require('../models/replys');
// var LogScore = require('../models/logs');

var models = require('../models/models');
var CommonJS = require('../models/common');
var querystring = require('querystring');
var url = require('url');
var yp = require('../lib/yp');
var mission = require('../lib/mission');


exports.getDailyDetailForPass = function(req, res) {
  var pquery = querystring.parse(url.parse(req.url).query);   
    var mid = pquery['mid'];

    models['message'].getMessageByMid(mid,function(err,message) {
      if(!err) {
        var uid = message['uid'];
        models['user'].getUsersByUids([uid],function(err,user) {
          message = message.toJSON();
          message['mtime'] = new Date(message['mtime']).format('yyyy-MM-dd hh:mm');
          var data = {
            'uname' : user[0]['name'],
            'message' : message
          }
          res.send(data);
        })
      }
    });
}

//话题详细页
exports.getSingleTopic = function(req, res) {
  var mid = req.params.id;
    var messageDetail = {};
    console.time('nap')
    
    models['message'].getMessageByMid(mid,function(err,data) {
      if(err) {
        //TODO
      } else {
        /*
         * 信息详细页展示  
         * 消息标题     消息内容       发布者姓名和uid 发布时间   回复数      回复实体
         * mtitle        mcontent       mname muid      mtime     replyCount   mReplyObj
         *  
         *  mReplyObj-->rcontent mid uid  uname rtime 
         */
        models['user'].getUsersByUids([data['uid']],function(err,user) {
          messageDetail['mtitle'] = data['mtitle'];
          messageDetail['mcontent'] = data['mcontent'];
          messageDetail['mname'] = user[0]['name'];
          messageDetail['muid'] = user[0]['_id'];
          messageDetail['mtime'] = CommonJS.changeTime(data['mtime']);
          messageDetail['mid'] = data['_id'];
          models['replys'].getReplysByMids([mid],function(err,replyArr) {
            if(err) {
              //TODO
            }else{
              var uidArr = [];
              for(var i=0; i<replyArr.length; i++) {
                uidArr.push(replyArr[i]['uid']);
              }
              models['user'].getUsersByUids(uidArr,function(err,users) {
                var tempArr = [];
                for(var i=0; i<replyArr.length; i++) {
                  var objReply = {
                    'rcontent' : replyArr[i]['rcontent'],
                    'mid' : replyArr[i]['mid'],
                    'uid' : replyArr[i]['uid'],
                    'uname' : models['user'].getUserFieldByUid(replyArr[i]['uid'],users,'name'),
                    'avatar' : models['user'].getUserFieldByUid(replyArr[i]['uid'],users,'avatar'),
                    'rtime' : CommonJS.changeTime(replyArr[i]['rtime']) 
                  }
                  tempArr.push(objReply);
                }
                messageDetail['mReplyObj'] = tempArr;
                models['message'].updateMessagecNumByMid(mid,'clickCount',function(err) {
                    if(err) {
                      //TODO
                    }else{
                      res.render('messageDetail',{
                          'title':messageDetail['mtitle'],
                          'messageDetail' : messageDetail,
                          'otheruser' : req.session.user
                        })
                    }
                  });
              })
              
            }
          })
        });
      }
    })
    console.timeEnd('nap')
}

//发表话题页
exports.getCreateTopic = function(req, res) {
   res.render('create',{
      title : '发表话题'
    });
}

//提交话题
exports.postCreateTopic = function(req, res) {
    var title = req.body['title'];
    var content = req.body['content'];
    var message = new models['message']({
      'mtitle' : title,
      'mcontent' : content,
      'uid' : req.session.user._id,
      'type' : 'normal'
    });

    models['message'].saveMessage(message,function(err,data) {
      if(err) {
        req.session.error = err;
        return res.redirect('/topic/create');
      }
      if(data) {
        return res.redirect('/');
      }
    })
}


// 写日报页
exports.getAddDaily = function(req, res) {
  res.render('addDaily',{
      title : '发布日报',
      user : req.session.user,
      otheruser:req.session.user
    });
}

//提交日报
exports.postCreateDaily = function(req, res) {
  var title = req.body['title'];
    var content = req.body['content'];
    
    var message = new models['message']({
      'mtitle' : title,
      'mcontent' : content,
      'uid' : req.session.user._id,
      'type' : 'day',
      'pass' : 'waiting'
    });

    models['message'].saveMessage(message,function(err,data) {
      if(err) {
        req.session.error = err;
        return res.redirect('/addDaily');
      }
      if(data) {
        return res.redirect('/dailyList/'+req.session.user['_id']);
      }
    })
}

//日报列表页
exports.getDailyListByUid = function(req, res) {
   var uid = req.params.uid;
    models['user'].getUsersByUids([uid],function(err,data) {
      if(!err) {
        res.render('dailyList',{
          title : '日报列表',
          uid : uid,
          user : data[0],
          otheruser : data[0]
        });
      }
    })
}



//话题列表
exports.getTopicListByUid = function(req, res) {
   var uid = req.params.uid;
    models['user'].getUsersByUids([uid],function(err,data) {
      if(!err) {
        res.render('topicList',{
          title : '话题列表',
          uid : uid,
          user : data[0],
          otheruser : data[0]
        });
      }
    })
}

//ajax获取分页列表
exports.getDailyAjax = function(req, res) {
  var pquery = querystring.parse(url.parse(req.url).query);   
    var perPages = 5;
    var type = pquery['type'] || 'day';
    var uid = pquery['uid'] || req.session.user._id;
    // getMessagesByMore(page,perCount,uid,type,callback)
    models['message'].getMessagesCountByMore('day',uid,function(err,dayCount) {
      models['message'].getMessagesByMore(pquery['curPage'],perPages,pquery['uid'],'day',function(err,dayArr) {
        var dtotalPages = 1;
        if(dayCount % perPages == 0 ) {
          dtotalPages = parseInt(dayCount/perPages);
        }else{
          dtotalPages = parseInt(dayCount/perPages) + 1;
        }
        var dayObj = [];
        for(var i=0,len=dayArr.length; i<len; i++) {
          dayObj[i] = {
            '_id' : dayArr[i]['_id'],
            'pass' : dayArr[i]['pass'],
            'mtitle':dayArr[i]['mtitle'],
            'mtime' : CommonJS.changeTime(dayArr[i]['mtime'])
          }
        }
        var data = {
          'type' : type,
          'day' : {
            'page' : pquery['curPage'],
            'totalPages' : dtotalPages,
            'data' : dayObj,
          }
        }
        res.send(data);
      })
    })
}

exports.getDailyDetailById = function(req, res) {
  var mid = req.params.id;
    var messageDetail = {};
    console.time('nap')

    models['message'].getMessageByMid(mid,function(err,data) {
      if(err) {
        //TODO
      } else {
        /*
         * 信息详细页展示  
         * 消息标题     消息内容       发布者姓名和uid 发布时间   回复数      回复实体
         * mtitle        mcontent       mname muid      mtime     replyCount   mReplyObj
         *  
         *  mReplyObj-->rcontent mid uid  uname rtime 
         */
        models['user'].getUsersByUids([data['uid']],function(err,user) {
          messageDetail['mtitle'] = data['mtitle'];
          messageDetail['mcontent'] = data['mcontent'];
          messageDetail['isPass'] = data['pass'];
          messageDetail['mname'] = user[0]['name'];
          messageDetail['muid'] = user[0]['_id'];
          messageDetail['mtime'] = CommonJS.changeTime(data['mtime']);
          messageDetail['mid'] = data['_id'];
          models['replys'].getReplysByMids([mid],function(err,replyArr) {
            if(err) {
              //TODO
            }else{
              if(replyArr.length > 0 && replyArr[0]['type'] === 'admin') {
                messageDetail['rcontent'] = replyArr[0]['rcontent'];
                messageDetail['rtime'] = replyArr[0]['rtime'];
                res.render('dailyDetail',{
                  'title':messageDetail['mtitle'],
                  'messageDetail' : messageDetail,
                  'otheruser' : req.session.user,
                  'user' : req.session.user
                })
              } else {
                res.render('dailyDetail',{
                  'title':messageDetail['mtitle'],
                  'messageDetail' : messageDetail,
                  'otheruser' : req.session.user,
                  'user' : req.session.user
                })
              }
            }
          })
        });
      }
    })
    console.timeEnd('nap')
}

//管理员通过审核 【Admin】
exports.postChangeMessageStatus = function(req, res) {
  var mid = req.body['mid'];
    var uid = req.body['uid'];
    var status = req.body['status'];
    var reviews = req.body['reviews'];
    var score = req.body['score'];
    models['message'].changeMessageStatus(mid,status,function(err,message) {
      //如果管理员有点评
      if(reviews != '') {
        var reply = new models['replys']({
          'mid' : mid,
          'rcontent' : reviews,
          'uid' : uid,
          'type' : 'admin'
        });

        models['replys'].getReplysByMids([mid],function(err,docs) {
         
          if(docs && docs.length == 0) {
            models['replys'].saveReply(reply,function(err,message) {
              if(status === 'passed') {
                //给成员加积分
                models['user'].getUserByUid(uid,function(err,user) {
                  if(!err) {
                    var logOptions = {
                      'name' : user['name'],
                      'uid' : uid,
                      'score' : score,
                      'type' : 1, //日报
                      'totalScore' : user['score'],
                      'mark' : '--'
                    }
                    score = (+user['score']) + (+score);
                    models['user'].updateScoreAdmin(uid,score,logOptions,function(err,rows) {
                      if(!err) {
                        res.send({'message':'success'});
                      }
                    })
                  }
                })
              } else {
                //不通过
                res.send({'message':'success'});
              }
            });
          } else {
            models['replys'].updateDailyComment(mid,reviews,function(err,reply) {
              if(status === 'passed') {
                //给成员加积分
                models['user'].getUserByUid(uid,function(err,user) {
                  if(!err) {
                    var logOptions = {
                      'name' : user['name'],
                      'uid' : uid,
                      'score' : score,
                      'type' : 1, //日报
                      'totalScore' : user['score'],
                      'mark' : '--'
                    }
                    score = (+user['score']) + (+score);
                    models['user'].updateScoreAdmin(uid,score,logOptions,function(err,rows) {
                      if(!err) {
                        res.send({'message':'success'});
                      }
                    })
                  }
                })
              } else {
                //不通过
                res.send({'message':'success'});
              }
            })
          }
        });
      }else{
         if(status === 'passed') {
            //给成员加积分
            models['user'].getUserByUid(uid,function(err,user) {
              if(!err) {
                var logOptions = {
                  'name' : user['name'],
                  'uid' : uid,
                  'score' : score,
                  'type' : 1, //日报
                  'totalScore' : user['score'],
                  'mark' : '--'
                }
                score = (+user['score']) + (+score);
                models['user'].updateScoreAdmin(uid,score,logOptions,function(err,rows) {
                  if(!err) {
                    res.send({'message':'success'});
                  }
                })
              }
            })
          } else {
            //不通过
            res.send({'message':'success'});
          }
      }
    })
}

//修改没审核通过的日志
exports.postModifyDaily = function(req, res) {
   var mid = req.body['mid'];
    var uid = req.body['uid'];
    var content = req.body['content'];

    models['message'].updateMessageContentByMid(mid,content,function(err,rows) {
      if(rows > 0 ) {
        models['message'].changeMessageStatus(mid,'waiting',function(err,data) {
          if(!err) {
            res.send({'message':'success'});
          }
        });
      }
    });
}

//获取话题、日报数
exports.getAllCount = function(req, res) {
   var pquery = querystring.parse(url.parse(req.url).query);       
    var uid = pquery['uid'] || req.session.user._id || req.session.user.uid;
    var countObj = {
      'normal' : 0,
      'day' : 0
    };
    models['message'].getMessagesCountByUid(uid,'normal',function(err,count) {
       models['message'].getMessagesCountByUid(uid,'day',function(err,dayCount) {
        countObj['normal'] = count;
        countObj['day'] = dayCount;
        res.json(countObj);
      });
    });

}

 //根据状态不同获取日报
exports.getDailyListByStatus = function(req, res) {
  var pquery = querystring.parse(url.parse(req.url).query);   
  var status = pquery['status'];


  var curPage = pquery['curPage'];
  var perPages = 10;
  
  var options = {
    type : 'day'
  }
    switch(status) {
      case '1':
        status = 'waiting';
        options['pass'] = 'waiting';
        break;
      case '2':
        status = 'unpass';
        options['pass'] = 'unpass';
        break;
      case '3':
        status = 'passed';
        options['pass'] = 'passed';
        break;
      default:
        status = '';
    }

    models['message'].list(options, function(err,messages) {
      var dtotalPages = 1;
      if(messages.length % perPages == 0 ) {
        dtotalPages = parseInt(messages.length/perPages);
      }else{
        dtotalPages = parseInt(messages.length/perPages) + 1;
      }

      models['message'].getDailyListByStatus(status,curPage,perPages, function(err,messages) {
        if(!err) {
          var mesObj = [];
          var uids = [];
          for(var i=0; i<messages.length; i++) {
            uids.push(messages[i]['uid']);
          }
          models['user'].getUsersByUids(uids,function(err,users) {
            for(var i=0; i<messages.length; i++) {
              mesObj[i] = {
                '_id' : messages[i]['_id'],
                'mtitle' : messages[i]['mtitle'],
                'mcontent' : messages[i]['mcontent'],
                'uid': messages[i]['uid'],
                'type' : messages[i]['type'],
                'pass' : messages[i]['pass']
              }
              mesObj[i]['name'] = models['user'].getUserFieldByUid(messages[i]['uid'],users,'name');
              mesObj[i]['avatar'] = models['user'].getUserFieldByUid(messages[i]['uid'],users,'avatar');
              mesObj[i]['mtime'] = new Date(messages[i]['mtime']).format('yyyy-MM-dd hh:mm');
            }
            res.json({
              'page' : curPage,
              'totalPages' : dtotalPages,
              'data' : mesObj
            })
          });
        }
      })  

    })
}


//获取个人话题
exports.getLogTopicAjax = function(req, res) {
  var pquery = querystring.parse(url.parse(req.url).query);
    var curPage = pquery['curPage'];
    var uid = pquery['uid'];
    var perPages = 5;
    models['message'].getTopicCount(uid,function(err,topicCount) {
      if(!err) {
        models['message'].getTopicByMore(uid,curPage,perPages,function(err,topicsArr) {
          var dtotalPages = 1;
          if(topicCount % perPages == 0 ) {
            dtotalPages = parseInt(topicCount/perPages);
          }else{
            dtotalPages = parseInt(topicCount/perPages) + 1;
          }
          // topicsArr = topicsArr.toJSON();
          var objArr = [];
          for(var i=0,len=topicsArr.length; i<len; i++) {
            objArr[i] = {
              'mtitle' : topicsArr[i]['mtitle'],
              '_id' : topicsArr[i]['_id'],  
              'mtime' : new Date(topicsArr[i]['mtime']).format('yyyy-MM-dd hh:mm')
            }
          }
          var data = {
            'page' : curPage,
            'totalPages' : dtotalPages,
            'data' : objArr,
          }
          res.send(data);
        });
      }
    });
}


//获取文章列表
exports.getArticleList = function(req, res) {
  var curPage = 1,perPages = 10;
  if(req.url.indexOf('article?page=') > -1) 
    curPage = req.url.split('=')[1];
  //根据curPage 获得message数组
  models['message'].getMessagesByPage('article',curPage,perPages,function(err, data) {
    //根据每页显示数量，message数组长度，计算出总页数
    var totalPages = 1;
    /* 
     * 输出给页面的元素
     *  回复数        点击数       标题      发表时间  消息ID    用户ID
     *  replyCount    clickCount   title     time       mid      uid
     */
    var objArr = [];
    if(data instanceof Array) {
      models['message'].getMessagesCountByType('article',function(err,count) {
        if(count % perPages == 0 ) {
          totalPages = parseInt(count/perPages);
        }else{
          totalPages = parseInt(count/perPages) + 1;
        }
        var midsArr = [],uidsArr = [];
        for(var i=0; i<data.length; i++) {
          midsArr.push(data[i]['_id']);
          uidsArr.push(data[i]['uid']);
        }
        models['replys'].getReplysByMids(midsArr,function(err,replyArr) {
          if(err) {
            //TODO 查询回复数出错
          }else{
            models['user'].getUsersByUids(uidsArr,function(err,userArr) {
              for(var i=0; i<data.length; i++) {
                //根据message数组不同元素，获得元素对应的回复数
                var mtime = data[i]['mtime']
                var time = CommonJS.changeTime(mtime);
                
                var obj = {
                  'replyCount' : models['replys'].getReplyCountByMid(data[i]['_id'],replyArr),
                  'clickCount' : data[i]['clickCount'] || 0,
                  'title'      : data[i]['mtitle'],
                  'time'       : time,
                  'mid'        : data[i]['_id'],
                  'uid'        : data[i]['uid'],
                  'uname'    : models['user'].getUserFieldByUid(data[i]['uid'],userArr,'name'),
                  'avatar'   : models['user'].getUserFieldByUid(data[i]['uid'],userArr,'avatar'),
                  'totalPages' : totalPages
                }
                objArr.push(obj);
              }

              if(req.session.user) {
                res.render('article',{
                  title : '阅读版块',
                  objArr : objArr,
                  user : req.session.user,
                  otheruser : req.session.user,
                  score : req.session.user['score']
                });
              }else{
                //组装成对象，输出到页面
                res.render('article',{
                  title : '阅读版块',
                  objArr : objArr,
                  user : req.session.user,
                  otheruser : req.session.user
                });
              }
            })
          }
        });
      })
    }
  });
}

//发表文章
exports.getCreateArticle = function (req, res) {
    res.render('createArticle',{
      title : '发表文章'
    });
}

//发表文章
exports.postCreateArticle = function(req, res) {
    var title = req.body['title'];
    var content = req.body['content'];
    var articleURL = req.body['articleURL'];

    var message = new models['message']({
      'mtitle' : title,
      'articleURL' : articleURL,
      'mcontent' : content,
      'uid' : req.session.user._id,
      'type' : 'article'
    });

    models['message'].saveMessage(message,function(err,data) {
      if(err) {
        req.session.error = err;
        return res.redirect('/');
      }
      if(data) {
        return res.redirect('/article');
      }
    })
}



//文章详细页
exports.getSingleArticle = function(req, res) {
   var mid = req.params.id;
    var articleDetail = {};
    models['message'].getMessageByMid(mid,function(err,data) {
      if(err) {
        //TODO
      } else {
        /*
         * 信息详细页展示  
         * 文章标题  原文链接    消息内容   发布者姓名和uid 发布时间   回复数      回复实体     
         * mtitle    articleURL   mcontent   mname muid      mtime     replyCount   mReplyObj
         * 被赞次数
         * good 
         *  mReplyObj-->rcontent mid uid  uname rtime 
         */
        models['user'].getUsersByUids([data['uid']],function(err,user) {
          articleDetail['mtitle'] = data['mtitle'];
          articleDetail['articleURL'] = data['articleURL'];  //原文链接
          articleDetail['good'] = data['good'];             //被赞次数
          articleDetail['mcontent'] = data['mcontent'];
          articleDetail['mname'] = user[0]['name'];
          articleDetail['muid'] = user[0]['_id'];
          articleDetail['mtime'] = CommonJS.changeTime(data['mtime']);
          articleDetail['mid'] = data['_id'];
          models['replys'].getReplysByMids([mid],function(err,replyArr) {
            if(err) {
              //TODO
            }else{
              var uidArr = [];
              for(var i=0; i<replyArr.length; i++) {
                uidArr.push(replyArr[i]['uid']);
              }
              models['user'].getUsersByUids(uidArr,function(err,users) {
                var tempArr = [];
                for(var i=0; i<replyArr.length; i++) {
                  var objReply = {
                    'rcontent' : replyArr[i]['rcontent'],
                    'mid' : replyArr[i]['mid'],
                    'uid' : replyArr[i]['uid'],
                    'uname' : models['user'].getUserFieldByUid(replyArr[i]['uid'],users,'name'),
                    'avatar' : models['user'].getUserFieldByUid(replyArr[i]['uid'],users,'avatar'),
                    'rtime' : CommonJS.changeTime(replyArr[i]['rtime']) 
                  }
                  tempArr.push(objReply);
                }
                articleDetail['mReplyObj'] = tempArr;
                models['message'].updateMessagecNumByMid(mid,'clickCount',function(err) {
                    if(err) {
                      //TODO
                    }else{
                      res.render('articleDetail',{
                          'title':articleDetail['mtitle'],
                          'articleDetail' : articleDetail,
                          'otheruser' : req.session.user
                        })
                    }
                  });
              })
              
            }
          })
        });
      }
    })
}


//点赞
exports.postSendGoodAction = function(req, res) {
  var mid = req.body.mid;
  
  models['message'].updateMessagecNumByMid(mid,'good',function(err, goodNum) {
    if(goodNum == 'max') {
      res.send({'code':'1','message':'max'});
    } else{
      if(!err) {
        var options = {
          mid : mid,
          uid : req.session.user._id
        }
        models['records']['RecordGood'].add(options,function(err,record) {
          if(!err) 
            res.send({'code':'0','message':'success','data':{'goodNum':goodNum}});
        })
      }
    }
    
  })
}

//是否已赞
exports.getAlreadyGood = function(req, res) {
  var pquery = querystring.parse(url.parse(req.url).query);
  var mid = pquery['mid'];
  var uid = pquery['uid'];
  var options = {
    mid : mid,
    uid : uid
  }

  models['records']['RecordGood'].list(options,function(err, record) {
    if(!err && record instanceof Array && record.length > 0) {
      res.send({
        'code' : 0,
        'message' : 'success',
        'data' : '1'
      })
    }else{
      res.send({
        'code' : 0,
        'message' : 'success',
        'data' : '0'
      })
    }
  }); 
}


// 获取热门文章
exports.getHotArticles = function(req, res) {
  models['message'].getHotArticles(function(err, messages) {
    if(!err) {
        res.send({
          'code' : 0,
          'message' : 'success',
          'data' : messages
        })
    }else{
      res.send({
          'code' : 1,
          'message' : 'failure'
        })
    }
  })
}


//个人文章列表页
exports.getArticleListByUid = function(req, res) {
   var uid = req.params.uid;
    models['user'].getUsersByUids([uid],function(err,data) {
      if(!err) {
        res.render('articleList',{
          title : '文章列表',
          uid : uid,
          user : data[0],
          otheruser : data[0]
        });
      }
    })
}


//获取个人文章
exports.getAticleAjax = function(req, res) {
  var pquery = querystring.parse(url.parse(req.url).query);
    var curPage = pquery['curPage'];
    var uid = pquery['uid'];
    var perPages = 5;
    models['message'].getArticleCount(uid,function(err,articleCount) {
      if(!err) {
        models['message'].getArticleByMore(uid,curPage,perPages,function(err,topicsArr) {
          var dtotalPages = 1;
          if(articleCount % perPages == 0 ) {
            dtotalPages = parseInt(articleCount/perPages);
          }else{
            dtotalPages = parseInt(articleCount/perPages) + 1;
          }
          // topicsArr = topicsArr.toJSON();
          var objArr = [];
          for(var i=0,len=topicsArr.length; i<len; i++) {
            objArr[i] = {
              'mtitle' : topicsArr[i]['mtitle'],
              '_id' : topicsArr[i]['_id'],  
              'mtime' : new Date(topicsArr[i]['mtime']).format('yyyy-MM-dd hh:mm')
            }
          }
          var data = {
            'page' : curPage,
            'totalPages' : dtotalPages,
            'data' : objArr,
          }
          res.send(data);
        });
      }
    });
}


//话题列表
exports.getTopicList = function(req, res) {
  var curPage = 1,perPages = 10;
    if(req.url.indexOf('/topicList?page=') > -1) 
      curPage = req.url.split('=')[1];
    //根据curPage 获得message数组
    models['message'].getMessagesByPage('normal',curPage,perPages,function(err, data) {
      //根据每页显示数量，message数组长度，计算出总页数
      var totalPages = 1;
      /* 
       * 输出给页面的元素
       *  回复数        点击数       标题      发表时间  消息ID    用户ID
       *  replyCount    clickCount   title     time       mid      uid
       */
      var objArr = [];
      if(data instanceof Array) {
        models['message'].getMessagesCountByType('normal',function(err,count) {
          if(count % perPages == 0 ) {
            totalPages = parseInt(count/perPages);
          }else{
            totalPages = parseInt(count/perPages) + 1;
          }
          var midsArr = [],uidsArr = [];
          for(var i=0; i<data.length; i++) {
            midsArr.push(data[i]['_id']);
            uidsArr.push(data[i]['uid']);
          }
          models['replys'].getReplysByMids(midsArr,function(err,replyArr) {
            if(err) {
              //TODO 查询回复数出错
            }else{
              models['user'].getUsersByUids(uidsArr,function(err,userArr) {
                for(var i=0; i<data.length; i++) {
                  //根据message数组不同元素，获得元素对应的回复数
                  var mtime = data[i]['mtime']
                  var time = CommonJS.changeTime(mtime);
                  
                  var obj = {
                    'replyCount' : models['replys'].getReplyCountByMid(data[i]['_id'],replyArr),
                    'clickCount' : data[i]['clickCount'] || 0,
                    'title'      : data[i]['mtitle'],
                    'time'       : time,
                    'mid'        : data[i]['_id'],
                    'uid'        : data[i]['uid'],
                    'uname'    : models['user'].getUserFieldByUid(data[i]['uid'],userArr,'name'),
                    'avatar'   : models['user'].getUserFieldByUid(data[i]['uid'],userArr,'avatar'),
                    'totalPages' : totalPages
                  }
                  objArr.push(obj);
                }

                if(req.session.user) {
                  res.render('topic',{
                    title : '边锋前端社区',
                    objArr : objArr,
                    user : req.session.user,
                    otheruser : req.session.user,
                    score : req.session.user['score']
                  });
                }else{
                  //组装成对象，输出到页面
                  res.render('topic',{
                    title : '边锋前端社区',
                    objArr : objArr,
                    user : req.session.user,
                    otheruser : req.session.user
                  });
                }
              })
            }
          });
        })
      }
    });
}