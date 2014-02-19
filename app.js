
/**
 * Module dependencies.
 */

var express = require('express')
  , router = require('./routes/router')
  , http = require('http')
  , path = require('path')
  , MongoStore = require('connect-mongo')(express)
  , settings = require('./settings')
  , partials = require('express-partials');

var querystring = require('querystring');
var url = require('url');

var app = express();

app.configure(function() {
  app.set('port',process.env.PORT || 3000);
  app.set('views',__dirname + '/views');
  app.set('view engine','ejs');
  app.use(partials());
  // app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({uploadDir: __dirname + '/upload-temp'}));
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  // app.use(function(req, res, next) {
  //   var pquery = querystring.parse(url.parse(req.url).query);   
  //   var sessionID = pquery['sessionID'];
    
  //   if(sessionID) {
  //     //单点登录 Cookie同步
  //     req.ConnectSidObj = {
  //       'connect.sid' : sessionID.replace(/\s/g,'+')
  //     }
  //   }
  //   console.log('单点登录 Cookie同步');
  //   console.log(req.ConnectSidObj);

  //   next();
  // })
  app.use(express.session({
    secret : settings.cookieSecret,
    store : new MongoStore({db : settings.db})
  }));

  // app.use(app.router);
  // app.use(express.router(routes));


  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    
    res.locals.success = req.session? req.session.success : null;
    res.locals.user = req.session? req.session.user : null;
    res.locals.error = req.session? req.session.error : null;

    // req.session.error = null;
    // req.session.success = null;
    // var url = req.originalUrl;
    // if (url != '/login' && url != '/' && !req.session.user) {
    //     return res.redirect('/login');
    // }
    next();
  });
  
  app.use(express.static(path.join(__dirname,'public')));
});

app.configure('development',function() {
  app.use(express.errorHandler());
});

http.createServer(app).listen(3000,function() {
  console.log('DEV Express server listening on port ' + 3000);
});

router.init(app);

// init(app);