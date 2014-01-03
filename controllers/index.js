/*
* index控制器
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




exports.index = function(req, res) {
  var curPage = 1,perPages = 10;
    if(req.url.indexOf('?page=') > -1) 
      curPage = req.url.split('=')[1];
    //根据curPage 获得message数组
    models['message'].getMessagesByPage(curPage,perPages,function(err, data) {
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
                    'uname'    : models['user'].getUsernameByUid(data[i]['uid'],userArr),
                    'totalPages' : totalPages
                  }
                  objArr.push(obj);
                }

                if(req.session.user) {
                  res.render('index',{
                    title : '边锋前端社区',
                    objArr : objArr,
                    user : req.session.user,
                    otheruser : req.session.user,
                    score : req.session.user['score']
                  });
                }else{
                  //组装成对象，输出到页面
                  res.render('index',{
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

//个人主页设置
exports.getSetting = function(req, res) {
  res.render('setting',{
			title : '个人设置--'+req.session.user.name,
     		 otheruser : req.session.user
		})
}

exports.postSetting = function(req, res) {
  	var name = req.body['name'];
		var email = req.body['email'];
		var mobile = req.body['mobile'];
		var url = req.body['url'];
		var signature = req.body['signature'];
		var profile = req.body['profile'];
		var weibo = req.body['weibo'];

		var uid = req.session.user._id;
		var user = new models['user']({
			name : name,
			email : email,
			mobile : mobile,
			url : url,
			signature : signature || '',
			profile : profile,
			weibo : weibo
		});

		models['user'].updateUser(uid,user,function(err,user) {
			if(!err) {
				req.session.user = user;
				res.redirect('/user/'+uid);
			}
		});
}

  //获取积分排行榜
exports.getRanking = function(req, res) {
  models['user'].getRanking(function(err,data) {
      if(!err) {
        res.send(data);
      }
    });
}