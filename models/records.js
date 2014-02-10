var dbObj = require('./db');
var mongoose = dbObj.mongoose
,Schema = mongoose.Schema
,ObjectId = mongoose.Schema.Types.ObjectId;

//点赞记录
var goodSchema = new Schema({
  mid:  String,
  uid: String
});

//+++++++++++++++Redis Four START++++++++++++++++

//list
goodSchema.static('list',function(options,callback) {
	return this.find(options,function(err,records) {
		callback(err,records);
	})
})

//add
goodSchema.static('add',function(options,callback) {
	var newRecord = new RecordGood(options);
	newRecord.save(function(err,record) {
		callback(err,record);
	})
})

//edit
goodSchema.static('edit',function(options,callback) {
	var condition = options['conditionObj']
	,editObj = options['fieldObj'];

	return this.findOneAndUpdate(condition, editObj,  function(err,record) {
		callback(err,record);
	})
})

//del
goodSchema.static('del',function(options,callback) {
	var condition = options['conditionObj'];
	return this.remove(condition,function(err,records) {
		callback(err,records);
	})
})

//+++++++++++++++Redis Four  END++++++++++++++++


var RecordGood = mongoose.model('Record.good', goodSchema);
var Record = {};
	Record['RecordGood'] = RecordGood;

module.exports = Record;