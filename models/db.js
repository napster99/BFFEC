var mongoose = require('mongoose'); //引用mongoose模块

mongoose.connect('mongodb://localhost/BFClubTest'); //创建一个数据库连接

exports.mongoose = mongoose;
