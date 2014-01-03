/*
* logs控制器
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

//获取积分日志
exports.getLogScoreAjax = function(req, res) {
  var pquery = querystring.parse(url.parse(req.url).query);
    var curPage = pquery['curPage'];
    var uid = pquery['uid'];
    var perPages = 5;
    models['logs'].getLogScoreCount(uid,function(err,logCount) {
      if(!err) {
        models['logs'].getLogScoresByMore(uid,curPage,perPages,function(err,logsArr) {
          var dtotalPages = 1;
          if(logCount % perPages == 0 ) {
            dtotalPages = parseInt(logCount/perPages);
          }else{
            dtotalPages = parseInt(logCount/perPages) + 1;
          }
          // logsArr = logsArr.toJSON();
          var objArr = [];
          for(var i=0,len=logsArr.length; i<len; i++) {
            objArr[i] = {
              'name' : logsArr[i]['name'],
              'type' : logsArr[i]['type'],  
              'score' : logsArr[i]['score'],
              'time' : new Date(logsArr[i]['time']).format('yyyy-MM-dd hh:mm')
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

//更新日志页面
exports.getChangeLog = function(req, res) {
  res.render('changeLog',{
      title : '更新日志'
    }); 
}

//获取个人积分日志
exports.getScoreListByUid = function(req, res) {
  var uid = req.params.uid;
    res.render('scoreList',{
        title : '我的积分日志',
        user : req.session.user,
        otheruser : req.session.user
      });
}

