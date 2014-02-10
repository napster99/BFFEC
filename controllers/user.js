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
var fs = require('fs');
var yp = require('../lib/yp');
var mission = require('../lib/mission');



//修改密码页
exports.getModifyPwd = function(req, res) {
   req.session.error = null;
    res.render('modifyPwd',{
      title : '修改口令'
    });
}

//修改头像
exports.getModifyAvatar = function(req, res) {
    res.render('modifyAvatar',{
      title : '修改头像',
      otheruser : req.session.user,
      user : req.session.user
    });
}

// 上传头像
exports.postModifyAvatar = function(req, res) {
  // 获得文件的临时路径
  var tmp_path = req.files.myfile.path;
  // 指定文件上传后的目录 - 示例为"images/avatar"目录。 
  var  extensionName = req.files.myfile.name.split('.')[1];
  var target_path = './public/images/avatar/' + req.session.user._id + '.'+extensionName;
  var dataUrl = '../images/avatar/' + req.session.user._id + '.'+extensionName;
  
  // 移动文件
  fs.rename(tmp_path, target_path, function(err) {
    if (err) 
      res.send(err);
    // 删除临时文件夹文件, 
    fs.unlink(tmp_path, function() {
       if (err)
        res.send('error');

        models['user'].edit({'conditionObj':{'_id':req.session.user._id},'fieldObj':{'avatar':dataUrl}},function(err,user) {
          
          if(!err) {
            req.session.user = user;
            res.redirect('/');
          }  
        })

      
    });
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

          // if(0 == nowDay || 6 == nowDay || now.format('yyyy-MM-dd') == lastSign.time.format('yyyy-MM-dd')){
          //   curSign = 0;  // 表示不需要签到
          // } else if( ( 1 == nowDay && 5 == lastDay ) || nowDay == (+lastDay + 1) ){
          //   curSign += lastSign.score;
          // }

          if(now.format('yyyy-MM-dd') == lastSign.time.format('yyyy-MM-dd')){
            curSign = 0;  // 表示不需要签到
          } else if( ( 1 == nowDay && 0 == lastDay ) || nowDay == (+lastDay + 1) ){
            curSign += lastSign.score;
          }
          curSign = Math.min(curSign, 5);
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
            mesObj[i]['name'] = models['user'].getUserFieldByUid(messages[i]['uid'],users,'name');
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


//获取当前用户信息
exports.getCurrentUserInfo = function(req, res) {
  if(req.session.user) {
      res.send({
        'code' : '1',
        'message' : 'success',
        'data' : {
          'name' : req.session.user.name,
          'uid'  : req.session.user._id,
          'role' : req.session.user.role
        }
      })
  }else{
     res.redirect('/login');
  }
}

//获取所有用户的信息
exports.getAllUserInfo = function(req, res) {
  models['user'].getUsers(function(err,users) {
    if(!err) {
      var userArr = [];
      for(var i=0; i<users.length; i++) {
        userArr.push({
          'name' : users[i]['name'],
          'uid'  : users[i]['_id']
        })
      }
      res.send({
        'code' : '1',
        'message' : 'success',
        'data' : userArr
      })
    }else{
      res.send({
        'code' : '0',
        'message' : 'failure'
      })
    }
  })
}

// 个人更新进度
exports.postProjectEdit = function(req, res) {
  models['user'].projectEdit(req.body,function(err, result) {
    if(!err) {
      res.send({
        'code' : '1',
        'message' : 'success'
      });
    }else{
      res.send({
        'code' : '0',
        'message' : 'failure'
      });
    }
  });
}

//人员明细列表
exports.getProjectList = function(req, res) {
    models['user'].list(function(err,users) {
      models['project'].list(function(err,projects) {
          if(err) {
            res.send({
              'code' : '0',
              'message' : 'failure'
            });
          }else{
               var projectObj = {}, userObj = {}, dataArr = [];
              //组装 用户        
              for(var i=0,len=users.length; i<len; i++) {
                if(typeof userObj[users[i]['_id']] == 'undefined') {
                  userObj[users[i]['_id']] = users[i];
                }
              }
              //组装 项目        
              for(var i=0,len=projects.length; i<len; i++) {
                if(typeof projectObj[projects[i]['_id']] == 'undefined') {
                  projectObj[projects[i]['_id']] = projects[i];
                }
              }

              for(var i=0; i<users.length; i++) {
                users[i]['projects'].forEach(function(val) {
                  var joinPerson = [];
                  if(typeof projectObj[val['pid']] != 'undefined') {
                    for(var j=0; j<projectObj[val['pid']]['joinPerson'].length; j++) {
                      joinPerson.push(userObj[projectObj[val['pid']]['joinPerson'][j]]);
                    }
                    dataArr.push({
                      'uname' : users[i]['name']
                      ,'pname': projectObj[val['pid']]
                      ,'resPerson' : userObj[projectObj[val['pid']]['resPerson']]
                      ,'joinPerson': joinPerson
                      ,'startTime' : projectObj[val['pid']]['startTime']
                      ,'endTime'   : projectObj[val['pid']]['endTime']
                      ,'state'    : projectObj[val['pid']]['state']
                    })
                  }
                  
                });
              }

              res.send({
                  'code' : '1',
                  'message' : 'success',
                  'data' : dataArr
              })

          }
      })
    })
}