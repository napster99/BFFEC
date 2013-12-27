var path = require("path")
  , fs = require("fs")
  , modelsPath = path.normalize( __dirname )
  , models = {};

// 获取所有models
var files = fs.readdirSync(modelsPath)
  , basename;

for( var i = 0, len = files.length; i < len; i++ ){
  basename = path.basename(files[i], '.js');
  if('models' != basename){
    models[basename] = require(modelsPath + '/' + basename);
  }
}

module.exports = models;