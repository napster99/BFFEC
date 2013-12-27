
var mongoose = require('mongoose'); //引用mongoose模块

mongoose.connect('mongodb://127.0.0.1:27017/BFClubTest'); //创建一个数据库连接

exports.mongoose = mongoose;

var db = mongoose.connection;
  
db.once('open', function callback () {
  console.log('opened...');
});