/*
 * 数据库RedisFour路由
 */
var querystring = require('querystring');
var mw = require('./middleware');
var url = require('url');
var models = require('../models/models');

function RedisFour(app) {
	this.init(app);
}

RedisFour.prototype.init = function(app) {
	var that = this;
	['get', 'post', 'put', 'patch', 'delete', 'del','all'].forEach(function(method) {
		app&&app[method]('/data/:controller/:action',function(req, res) {
			that.resolution(req, res);
		}); 
	});
}

RedisFour.prototype.isEmptyObject = function(o) {
	for(var n in o) {
		return false;
	}	
	return true;
}

RedisFour.prototype.resolution = function(req, res) {
	// var url = req.originalUrl;
	var controller = req.params['controller'];
	var action = req.params['action'];
	var options = querystring.parse(url.parse(req.url).query);
	if(this.isEmptyObject(options)) {
		options = req.body;
	}
	if(typeof models[controller][action] === 'function') {
		// delete options['callback'];
		models[controller][action](options,function(err,result) {
			res.header("Access-Control-Allow-Origin", "*");
			if(!err) {
				res.json({
					'code' : '1'
					,'message' : 'success'
					,'data' : result
				});
			} else {
				res.json({
					'code' : '0'
					,'message' : 'failure'
				});
			}
		});
	}else {
		res.send('Invalid Action!');
	}
}


exports.RedisFour = RedisFour;