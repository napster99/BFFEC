/*
* index控制器
*/
var models = require('../models/models');
var funs_index = require('../functions/index');

module.exports.controllers = {
  "/": {
    get: function(req, res, next){
      funs_index.test();
      res.send('hello world');
    }
  , post: function(req, res, next){
      res.send(200);
    }
  }
};

module.exports.filters = {
  "/": {
    'get': ['checkLogin']
  }
};