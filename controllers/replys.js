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
  var content = req.body['content'];
    var mid = req.params.mid;
    var uid = req.session.user._id;
    var reply = new models['replys']({
      'mid' : mid,
      'rcontent' : content,
      'uid' : uid
    });

    models['replys'].saveReply(reply,function(err,reply) {
      if(err) {
        //TODO
      } else {
        return res.redirect('/topic/'+mid);
      }
    })
}

