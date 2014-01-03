/*
 * 对应操作权限限制域
 */


//需登录
exports.checkLogin = function(req,res,next) {
	if(!req.session.user) {
		return res.redirect('/login');
	}
	next();
}

//管理员权限
exports.requireAdmin = function(req,res,next) {
	console.log('管理员权限')	
	if(!req.session.user) {
		return res.redirect('/login');
	}
	if(req.session.user['role'] != '2') {
		return res.redirect('/login');
	}
	next();
}

