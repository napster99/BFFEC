/**
 * Routing map drawer. Encapsulates all logic required for drawing maps:
 * get, post, put, ..., all requests
 *
 * @param {Object} app - ExpressJS application
 * @param {Function} URLConfig - some URLConfig method that will server requests from
 * routing map to application
 *
 * Usage example:
 *		Initialization Listener	&& register url handler
 *      var nap = new routing.Nap(app, URLConfig, mw);
 *		nap.setControllerPath('./controllers');
 *		nap.startPorts();
 * 		
 * 		URLConfig eg: 
 *		 {
 *		 	'url' :'main',
 *		 	'controller':'index',
 *		 	'actions':'main',
 *		 	'type':'get',
 *		 	'middleware':['requireAdmin']
 *		 }
 *
 */

function Nap(app, URLConfig, mw) {
	if (!(this instanceof Nap)) return new Nap(app, URLConfig, mw);
    this.app = app;
    this.URLConfig = URLConfig || {};
    this.mw = mw || [];
}

Nap.prototype.startListener = function() {
	var that = this;
	var actionArr = this.URLConfig.Action;
	if(Array.isArray(actionArr) && actionArr.length > 0) {
		actionArr.forEach(function(action) {
			var  url        = action['url']
				,controller = action['controller']
				,actions  = action['actions']
				,type       = action['type']
				,middleware = action['middleware'] || [];

				var middlewareArr = [];
				for(var i in middleware) {
					if(typeof that.mw[middleware[i]] === 'function') {
						middlewareArr.push(that.mw[middleware[i]]);
					}
				}
				var handlerCallback = that.setHandler(controller,actions);
				that.app[type || 'get']('/'+url,middlewareArr,handlerCallback);
		})
	}
}

Nap.prototype.setControllerPath = function(path) {
	if(path) 
		path = path.replace(/\/*$/g,'') + '/';
	this.controllerPath ='../../'+ path || './';
}

Nap.prototype.setHandler = function(controller,action) {
	try{
		var ctlFile = this.controllerPath + controller;
		var responseHandler = require(ctlFile)[action];
	} catch(e) {
		throw new Error('get the handler File occur!');
	}

	return responseHandler ? responseHandler  : function(req,res) {
		 res.send('Handler not found for ' + ns + req.param('controller') + '#' + req.param('action'));
	}
}

exports.Nap = Nap;