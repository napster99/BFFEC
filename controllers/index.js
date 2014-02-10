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

// var phantomjs = require('phantomjs');
var phantom = require('node-phantom');

exports.index = function(req, res) {
  res.render('index',{
    title : '前端社区',
    otheruser : req.session.user
  })
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

//根据URL地址获取网页内容
exports.getURLContentAjax = function(req, res) {
    var pquery = querystring.parse(url.parse(req.url).query);
    var articleURL = pquery['articleURL'];
    
   phantom.create(function(err,ph) {
      return ph.createPage(function(err,page) {
        return page.open(articleURL, function(err,status) {
          console.log("opened site? ", status);
          page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function(err) {
            setTimeout(function() {
              return page.evaluate(function() {
                return $('#code').length > 0?  $('#code').html() : '无法获取！';
              }, function(err,result) {
                res.send({'code':'0','message':'success',data:result});
                ph.exit();
              });
            }, 1000);
          });

        });
      });
    });
}




//获得话题列表
exports.getTopicList = function(req, res) {
   models['message'].list({'type' : 'normal'},function(err, messages) {
      if(!err) 
          res.send({'code':'0','message':'success',data:messages})
   });
}

//获得文章列表
exports.getArticleList = function(req, res) {
   models['message'].list({'type' : 'article'},function(err, messages) {
      if(!err) 
          res.send({'code':'0','message':'success',data:messages})
   });
}

//获得日报列表
exports.getDailyList = function(req, res) {
  var uid = req.session.user._id;
   models['message'].list({'type' : 'day','uid' : uid},function(err, messages) {
      if(!err) 
          res.send({'code':'0','message':'success',data:messages})
   });
}