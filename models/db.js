var mongoose = require('mongoose'); //引用mongoose模块

mongoose.connect('mongodb://192.168.138.23/local'); //创建一个数据库连接

exports.mongoose = mongoose;
