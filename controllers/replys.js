/*
* replys控制器
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

//提交回复
exports.postSingleReply = function(req, res) {
    var which = req.body['which'];
    var title = req.body['title'];
    var content = req.body['content'];
    var mid = req.params.mid;
    var uid = req.session.user._id;
    var uname = req.session.user['name'];
    var reply = new models['replys']({
      'mid' : mid,
      'rcontent' : content,
      'uid' : uid
    });

    models['replys'].saveReply(reply,function(err,reply) {
      if(!err) {
        var options = {
          '_id' : mid
        }
        models['message']['list'](options,function(err, message) {
          var ownUid = message instanceof Array && message[0]['uid'];
          var time = CommonJS.changeTime(new Date()) ;

          var noticeObj = {
            'uid' : ownUid,
            'content' : uname + '在'+time+'回复了您的话题（<a target="_blank" href="/topic/'+mid+'#day" >'+title+'</a>）'
          }
          if(which != 'topic') 
            noticeObj['content'] = uname + '在'+time+'回复了您的分享（<a target="_blank" href="/topic/'+mid+'#day" >'+title+'</a>）';

          var notice = new models['notice'](noticeObj);
          models['notice']['add'](notice, function(err, notice) {});
          if(which == 'topic') {
            return res.redirect('/topic/'+mid);
          }else{
            return res.redirect('/article/'+mid);
          }

        });
        
      }
    })
}

