/*
* user控制器
*/

var crypto = require('crypto');
// var User = require('../models/user');
// var Message = require('../models/message');
// var Reply = require('../models/replys');
var LogScore = require('../models/logs');
var models = require('../models/models');
var CommonJS = require('../models/common');
var querystring = require('querystring');
var url = require('url');
var yp = require('../lib/yp');
var mission = require('../lib/mission');


//修改密码页
exports.getModifyPwd = function(req, res) {
   req.session.error = null;
    res.render('modifyPwd',{
      title : '修改口令'
    });
}

//提交密码
exports.postModifyPwd = function(req, res) {
   var password = req.body['password'];
    var oldpassword = req.body['oldpassword'];

    //检测密码长度为6~20位之间
    if(password.length < 6 || password.length > 20) {
      req.session.error = 'pwdformaterror';
      return res.redirect('/modifyPwd');
    }

    //生成口令的散列值
    var newPassword = crypto.createHash('md5').update(password).digest('base64');
    var oldPassword = crypto.createHash('md5').update(oldpassword).digest('base64');
    
    //检测是否匹配原密码
    if(req.session.user.password != oldPassword) {
      req.session.error = 'oldpassworderror';
      return res.redirect('/modifyPwd');
    }
    
    if(newPassword != req.session.user.password) {
      //检查口令是否已经存在
      models['user'].getUserByPwd(newPassword, function(err, user) {
        if(user) {
          req.session.error = 'passwordisexsit';
          return res.redirect('/modifyPwd');
        }
        if(err) {
          req.session.error = err;
          return res.redirect('/modifyPwd');
        }

        //如果不存在则更新该用户口令
        models['user'].setUserPwd(req.session.user,newPassword,function(err,result) {
          req.session.success = 'success';
          return res.redirect('/login');
        })
      });
    }else{
      req.session.success = 'success';
      return res.redirect('/login');
    }
}

//用户登陆页
exports.getLogin = function(req, res) {
      res.render('login', {
      title : '用户登入'
    });
}

//提交用户登陆
exports.postLogin = function(req, res) {
  //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    models['user'].getUserByPwd(password, function(err, user) {
      if(!user) {
        req.session.error = 'usernotexsit';
        return res.redirect('/login');
      }
      if(user.password != password) {
        req.session.error = 'pwderror';
        return res.redirect('/login');
      }
      user = user.toJSON();
      models['logs'].getLastSignScore(user._id, function(err, lastSign){
        // 判断今天签到可获得的积分
        var curSign = 1;
        if(lastSign){
          // 今天是星期几
          var now = new Date()
            , nowDay = now.getDay()
            , lastDay = lastSign.time.getDay();

          if(0 == nowDay || 6 == nowDay || now.format('yyyy-MM-dd') == lastSign.time.format('yyyy-MM-dd')){
            curSign = 0;  // 表示不需要签到
          } else if( ( 1 == nowDay && 5 == lastDay ) || nowDay == (+lastDay + 1) ){
            curSign += lastSign.score;
          }
        }
        user.curSign = curSign;
        req.session.user = user;

        console.log('+++++++++++登入成功++++++++++++++');
        console.log(req.session.user);
        console.log('+++++++++++登入成功++++++++++++++');
        req.session.success = '登入成功';
        req.session.error = null;
        res.redirect('/');
      });
    });
}

exports.getLogout = function(req, res) {
  req.session.user =  null;
  req.session.success = '登出成功';
  res.redirect('/');
}

exports.getWebList = function(req, res) {
 var user = new models['user'](req.session.user);
    models['user'].getUsers(function(err,datas) {
      models['message'].getUnPassMessages(function(err,messages) {
        var uids = [];
        var mesObj = [];
        for(var i=0; i<messages.length; i++) {
          uids.push(messages[i]['uid']);
          mesObj.push(messages[i]);
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
            mesObj[i]['name'] = models['user'].getUsernameByUid(messages[i]['uid'],users);;
            mesObj[i]['mtime'] = CommonJS.changeTime(messages[i]['mtime']);
          }
          res.render('webList', {
            title : '管理人员',
            users : datas,
            messages : mesObj
          });

        });
      })
    })
}

//新成员录入页
exports.getAddUser = function(req,res) {
	 res.render('addUser', {
      title : '新成员录入'
    });
}

//提交新成员录入
exports.postAddUser = function(req, res) {
   var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password || '123456').digest('base64');

    var name = req.body.name;
    var mobile = req.body.mobile;
    var authority = req.body.authority;

    if(name.replace(/\s*/g,'') === '') {
      req.session.error = 'namenotnull';
      return res.redirect('/addUser');
    }
    if(mobile.replace(/\s*/g,'') === '') {
      req.session.error = 'mobilenotnull';
      return res.redirect('/addUser');
    }
    if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobile))){ 
      req.session.error = 'mobileformaterror';
      return res.redirect('/addUser');
    }

    var newUser = new models['user']({
       name : name,
       password : password,
       role : authority,
       mobile : mobile
    });

    //将新成员录入数据库
    models['user'].saveUser(newUser,function(err,user) {
      if(err) {
        req.session.error = 'saveError';
        return res.redirect('/addUser');
      }
      // req.session.user = newUser;
      req.session.success = 'saveSuccess';
      req.session.error = null;
      
      res.redirect('/login');
    }) 
}

//个人主页
exports.getSingleUser = function(req, res) {
  var uid = req.params.uid;
    models['user'].getUserByUid(uid,function(err,user) {
      if(!err&& user) {
        res.render('user',{
          title : user.name + '的主页',
          otheruser : user,
          user : req.session.user
        });
      }
    });
}

//积分更新
exports.getUpdateScore = function(req, res) {
  var pquery = querystring.parse(url.parse(req.url).query);   
    var uid = pquery['uid'];
    var score = pquery['score'];

    models['user'].getUserByUid(uid,function(err,user) {
      if(!err) {
        // 发布任务信息，签到任务
        var event = {
          stop: false
        , callback: function(){
            res.send({'message': 'success'});
          }
        };
        yp.pub('doSign', {data: {signScore: score, user: req.session.user}, event:event});
        if (!event.stop) event.callback();
      } else {
        res.send({'message': 'error'});
      }
    })
}

//改变签到状态
exports.postChangeSignStatus = function(req, res) {
   models['user'].changeSignStatus(req.session.user._id,function(err,user) {
      if(!err && user) {
        req.session.user = user;
        res.send();
      }
    })
}
