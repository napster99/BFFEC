var yp = require('./yp');
var models = require('../models/models');

module.exports = (function(){
  var mission = {
    fDoSign: function(data, callback){
      var user = data.user
        , logScore = new models['logs']({
          name : user.name,
          uid : user._id,
          score : data.signScore,
          type : 3
        })
      , score = (+user.score) + (+data.signScore);

      models['user'].updateScore(user._id, score, function(err, rows) {
        if(rows) {
          models['logs'].saveLogScore(logScore, function(){
            user.score = score;
            callback && callback();
          });  // 写日志
        }
      });
    }
  };

  // 接收任务信息，签到任务
  yp.sub('doSign', function(msg){
    var e = msg.event;
    e.stop = true;
    mission.fDoSign(msg.data, e.callback);
  });

  return mission;

})();