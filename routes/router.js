var URLConfig = require('./URLConfig');
var mw = require('./middleware');
var rf = require('./redisFour');
var routing = require('nap_routes');


exports.init = function(app) {
	var nap = new routing.Nap(app, URLConfig, mw);
	nap.setControllerPath('./controllers');
	nap.startListener();
	
	//redis four 路由分发
	new rf.RedisFour(app);
}
