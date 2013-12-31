/*
* 路由解析后，在controller程序处理前，可选择执行的方法，如未使用res.send/res.redirect等方法，则必须使用next()
*/
var models = require('../models/models');

module.exports = function(req, res, next){
	console.log('checkLogin');
	next();
}