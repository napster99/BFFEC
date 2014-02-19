/*
 *	核心函数
 */
var request = function () {

  var _this		= this;
  var req 		= null;	//request对象
  var res			= null;
  var postData	= null; //存放POST数据
  var getData 	= null;	//存放GETDATA数据
  var cookieData  = null; //存放cookie数据
  var cookieArr	= []; //存放cookie输出数据
  var url 	 	= require("url");
  var util 	 	= require('util');
  var querystring = require('querystring');
  var os			= require('os');

  
  /*	
   *	说明：Request 请求初始化
   */
  this.init = function (initnode) {
    req 		= initnode.req;
    res			= initnode.res;
    postData 	= this._post(initnode.postData);
    getData 	= this._get(req);
    cookieData 	= this._cookie(req);
  };

  /*	
   *	说明：GET方法，获取URL中的GET提交数据
   * 	使用：
   *	获取单个	initnode.request.get('username');
   *	获取多个	initnode.request.get(['username', 'age']);
   *	获取全部	initnode.request.get('');
   */
  this.get = function (name) {
    return this._requestData(name, getData);
  };

  
  /*	
   *	说明：POST方法，获取URL中的POST提交数据
   * 	使用：
   *	获取单个	initnode.request.post('username');
   *	获取多个	initnode.request.post(['username', 'age']);
   *	获取全部	initnode.request.post('');
   */
  this.post = function (name) {
    return this._requestData(name, postData);
  };

  /*	
   *	说明：COOKIE方法，获取URL中的COOKIE提交数据
   * 	使用：
   *	获取单个	initnode.request.get_cookie('username');
   *	获取多个	initnode.request.get_cookie(['username', 'age']);
   *	获取全部	initnode.request.get_cookie('');
   */
  this.get_cookie = function (name) {
    return this._requestData(name, cookieData);
  };
  
  /*	
   *	说明：设置COOKIE
   * 	使用：
   *	设置Cookie initnode.request.set_cookie('username', 'initnode', 30, '/');
   *	name 	cookie名称
   *	value	cookie值
   *	expires 有效期时间，秒计算
   *	path	有效目录
   *	domain	域名
   */
  this.set_cookie = function (name, value, expires, path, domain) {
    var cookieSrt = '';
    cookieStr = name + '=' + value + ';';
    //cookie有效期时间
    if (expires != undefined) {
      expires = parseInt(expires);
      var today = new Date();
      var time = today.getTime() + expires * 1000;
      var new_date = new Date(time);
      var expiresDate = new_date.toGMTString(); //转换成 GMT 格式。
      cookieStr += 'expires=' +  expiresDate + ';';
    }
    //目录
    if (path != undefined) {
      cookieStr += 'path=' +  path + ';';	
    }
    //域名
    if (domain != undefined) {
      cookieStr += 'domain=' +  domain + ';';	
    }
    cookieArr.push(cookieStr);
    return true;
  }
  
  /*	
   *	说明：设置COOKIE
   * 	使用：
   *	设置Cookie initnode.request.set_cookie('username', 'initnode', 30, '/');
   *	name 	cookie名称
   *	value	cookie值
   *	expires 有效期时间，秒计算
   *	path	有效目录
   *	domain	域名
   */
  this.del_cookie = function (name) {
    this.set_cookie(name, '', -999);
    return true;
  }
  
  /*	
   *	说明：header头部发送cookie设置信息
   * 	使用：
   *	设置Cookie initnode.request.flush_cookie();
   */
  this.flush_cookie = function () {
    res.setHeader("Set-Cookie", cookieArr);	
  }

  /*	
   *	说明：获取HTTP头部数据信息
   * 	使用：
   *	获取单个	initnode.request.headers('accept');
   *	获取多个	initnode.request.headers(['referer', 'referer']);
   *	获取全部	initnode.request.headers('');
   *  参数：accept referer accept-language user-agent content-type 
   *	accept-encoding host content-length connection cache-control cookie	
   */
  this.headers = function (name) {
    return this._requestData(name, req.headers);
  };
  
  /*	
   *	说明：获取客户端IP地址
   * 	使用：
   *	initnode.request.getClientIp();
   */
  this.getClientIp = function () {
    	var ipAddress;
    	var forwardedIpsStr = this.headers('x-forwarded-for'); 
    	if (forwardedIpsStr) {
        	var forwardedIps = forwardedIpsStr.split(',');
        	ipAddress = forwardedIps[0];
    	}
    	if (!ipAddress) {
        	ipAddress = req.connection.remoteAddress;
    	}
    	return ipAddress;
  };
  
  /*	
   *	说明：获取客户端IP地址
   * 	使用：
   *	initnode.request.getServer('hostname');
   *	hostname 主机名称
   *	type 操作系统类型
   *	release 发型版本
   *	uptime	更新时间
   *	loadavg 平均负载
   *	totalmem 总内存
   *	freemem 空闲内存
   *	cpus CUP
   */
  this.getServer = function (name) {
    if (os[name]) {
      return os[name]();
    } else {
      return '';	
    }
  }

  /*	
   *	从req头部信息中获取cookie，并且转化成对象格式
   */
  this._cookie = function (req) {
    return querystring.parse(req.headers.cookie);
  };

  /*	
   *	获取POSTDATA数据
   */
  this._post = function (_postData) {
    return querystring.parse(_postData);
  };

  /*	
   *	获取GET数据
   */
  this._get = function (req) {
    var getQuery= url.parse(req.url).query;
    var getData = querystring.parse(getQuery); //getData数据
    return getData;
  };

  //封装GET，POST获取数据接口
  this._requestData = function (name, data) {
    if (name == '') {
      return data;
    }
    if (typeof(name) == 'object') { //数组形式传递进来
      var temp = {};
      for (var i = 0; i < name.length; i++) {
        if (data[name[i]]) {
          temp[name[i]] = data[name[i]];
        } else {
          temp[name[i]] = '';
        }
      }
      return temp;
    } else {
      if (data[name]) {
        return data[name];
      } else {
        return '';
      }
    }
  };

}

module.exports = request;