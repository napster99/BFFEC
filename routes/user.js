
/*
 * GET users listing.
 */

var users = {
	'napster' : {
		name : 'zhangxiaojian',
		website : 'https://github.com/napster99'
	}
};

exports.list = function(req, res){
	//用户一定存在，直接展示
  res.send(JSON.stringify(users[req.params.username]));
};