/*
* notice控制器
*/
var crypto = require('crypto');
var models = require('../models/models');
var CommonJS = require('../models/common');
var querystring = require('querystring');
var url = require('url');

//我的消息列表
exports.getNoticeList = function(req, res) {
   res.render('noticeList',{
    title : '我的消息列表',
    otheruser : req.session.user,
    sessionID : req.cookies['connect.sid']
  })
}

//获取我的消息
exports.getNoticeAjax = function(req, res) {
  var pquery = querystring.parse(url.parse(req.url).query);
    var curPage = pquery['curPage'];
    var uid = pquery['uid'];
    var perPages = 10;
    
    models['notice']['list']({'uid':uid},function(err,notices) {
    	var noticeCount = notices.length;
    	console.log(notices.length)
      if(!err) {
        models['notice'].getNoticesByPage(uid,curPage,perPages,function(err,noticesArr) {

          var dtotalPages = 1;
          if(noticeCount % perPages == 0 ) {
            dtotalPages = parseInt(noticeCount/perPages);
          }else{
            dtotalPages = parseInt(noticeCount/perPages) + 1;
          }
          // noticesArr = noticesArr.toJSON();
          var objArr = [];
          for(var i=0,len=noticesArr.length; i<len; i++) {
            objArr[i] = {
              'id' : noticesArr[i]['_id'],
              'uid' : noticesArr[i]['uid'],
              'content' : noticesArr[i]['content'],
              'isRead' : noticesArr[i]['isRead'],
              'time' : new Date(noticesArr[i]['time']).format('yyyy-MM-dd hh:mm')
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