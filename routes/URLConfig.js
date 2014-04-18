/*
 * 配置URL地址与controller对应的操作
 */
module.exports = {
	'Controller' : ['index','message','user','replys','logs'],
	'Action' : [
	{'url' : '','controller':'index','actions':'index','type':'get'},

	{'url' : 'getTopicList','controller':'index','actions':'getTopicList','type':'get'},	
	{'url' : 'getArticleList','controller':'index','actions':'getArticleList','type':'get'},	
	{'url' : 'getDailyList','controller':'index','actions':'getDailyList','type':'get'},	


	{'url' : 'modifyPwd','controller':'user','actions':'getModifyPwd','type':'get','middleware':['checkLogin']},
	{'url' : 'modifyPwd','controller':'user','actions':'postModifyPwd','type':'post','middleware':['checkLogin']},
	{'url' : 'login','controller':'user','actions':'getLogin','type':'get'},
	{'url' : 'login','controller':'user','actions':'postLogin','type':'post'},
	{'url' : 'logout','controller':'user','actions':'getLogout','type':'get'},
	{'url' : 'addUser','controller':'user','actions':'getAddUser','type':'get','middleware':['checkLogin','requireAdmin']},
	{'url' : 'addUser','controller':'user','actions':'postAddUser','type':'post','middleware':['checkLogin','requireAdmin']},
	{'url' : 'webList','controller':'user','actions':'getWebList','type':'get','middleware':['checkLogin']},

	
	{'url' : 'modifyAvatar','controller':'user','actions':'getModifyAvatar','type':'get','middleware':['checkLogin']},
	{'url' : 'avatar-upload','controller':'user','actions':'postModifyAvatar','type':'post','middleware':[]},


	{'url' : 'getDailyDetailForPass','controller':'message','actions':'getDailyDetailForPass','type':'get','middleware':['checkLogin']},
	
	{'url' : 'getLogTopicAjax','controller':'message','actions':'getLogTopicAjax','type':'get','middleware':['checkLogin']},

	{'url' : 'user/:uid','controller':'user','actions':'getSingleUser','type':'get'},
	{'url' : 'setting','controller':'index','actions':'getSetting','type':'get','middleware':[]},
	{'url' : 'setting','controller':'index','actions':'postSetting','type':'post','middleware':[]},
	{'url' : 'getRanking','controller':'index','actions':'getRanking','type':'get','middleware':[]},
	{'url' : 'topic/:id','controller':'message','actions':'getSingleTopic','type':'get','middleware':[]},
	{'url' : 'createTopic','controller':'message','actions':'getCreateTopic','type':'get','middleware':[]},
	{'url' : 'topic/create','controller':'message','actions':'postCreateTopic','type':'post','middleware':[]},
	{'url' : 'reply/:mid','controller':'replys','actions':'postSingleReply','type':'post','middleware':[]},
	{'url' : 'addDaily','controller':'message','actions':'getAddDaily','type':'get','middleware':[]},
	{'url' : 'createDaily','controller':'message','actions':'postCreateDaily','type':'post','middleware':[]},
	{'url' : 'dailyList/:uid','controller':'message','actions':'getDailyListByUid','type':'get','middleware':[]},

	{'url' : 'topicList','controller':'message','actions':'getTopicList','type':'get'},


	{'url' : 'topicList/:uid','controller':'message','actions':'getTopicListByUid','type':'get','middleware':[]},
	{'url' : 'getDailyAjax','controller':'message','actions':'getDailyAjax','type':'get','middleware':[]},
	{'url' : 'dailyDetail/:id','controller':'message','actions':'getDailyDetailById','type':'get','middleware':[]},
	{'url' : 'updateScore','controller':'user','actions':'getUpdateScore','type':'get','middleware':[]},
	{'url' : 'changeSignStatus','controller':'user','actions':'postChangeSignStatus','type':'post','middleware':[]},
	{'url' : 'changeMessageStatus','controller':'message','actions':'postChangeMessageStatus','type':'post','middleware':[]},
	{'url' : 'modifyDaily','controller':'message','actions':'postModifyDaily','type':'post','middleware':[]},
	{'url' : 'getLogScoreAjax','controller':'logs','actions':'getLogScoreAjax','type':'get','middleware':[]},
	{'url' : 'changeLog','controller':'logs','actions':'getChangeLog','type':'get','middleware':[]},
	{'url' : 'getAllCount','controller':'message','actions':'getAllCount','type':'get','middleware':['']},
	{'url' : 'getDailyListByStatus','controller':'message','actions':'getDailyListByStatus','type':'get','middleware':[]},
	{'url' : 'scoreList/:uid','controller':'logs','actions':'getScoreListByUid','type':'get','middleware':[]},
	{'url' : 'getCurrentUserInfo','controller':'user','actions':'getCurrentUserInfo','type':'get','middleware':[]},
	{'url' : 'getAllUserInfo','controller':'user','actions':'getAllUserInfo','type':'get','middleware':[]},
	{'url' : 'data/user/projectEdit','controller':'user','actions':'postProjectEdit','type':'post','middleware':[]},
	{'url' : 'data/user/projectList','controller':'user','actions':'getProjectList','type':'get','middleware':[]},

	{'url' : 'article','controller':'message','actions':'getArticleList','type':'get'},
	{'url' : 'createArticle','controller':'message','actions':'getCreateArticle','type':'get','middleware':['checkLogin']},
	{'url' : 'article/create','controller':'message','actions':'postCreateArticle','type':'post','middleware':['checkLogin']},
	{'url' : 'getURLContentAjax','controller':'index','actions':'getURLContentAjax','type':'get'},
	{'url' : 'article/:id','controller':'message','actions':'getSingleArticle','type':'get'},

	{'url' : 'sendGoodAction','controller':'message','actions':'postSendGoodAction','type':'post','middleware':['checkLogin']},
	{'url' : 'getHotArticles','controller':'message','actions':'getHotArticles','type':'get'},

	{'url' : 'articleList/:uid','controller':'message','actions':'getArticleListByUid','type':'get','middleware':[]},
	
	{'url' : 'getAticleAjax','controller':'message','actions':'getAticleAjax','type':'get','middleware':['checkLogin']},

	{'url' : 'getAlreadyGood','controller':'message','actions':'getAlreadyGood','type':'get'},

	{'url' : 'changeScoreByAdmin','controller':'logs','actions':'changeScoreByAdmin','type':'post'}

	

	]
}
