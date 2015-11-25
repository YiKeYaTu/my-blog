var express = require('express');
var router = express.Router();
var keeper = require('../private/action/observer/keep');
var outData = require('../private/action/observer/out-data');
/* GET users listing. */
router.get('/', function(req, res, next) {
	var getData = new outData({
		type:'select',
		tableName:'draft',
		take:'title',
		callback:function (data) {
			console.log(data);
			res.render('admin',{
				res : data
			})
		}
	});
	
});
router.get('/str2md', function(req, res, next) {
	var str2md = require('../private/action/observer/str2md');
	str2md = new str2md(req.query.content);
	res.send(str2md.get());
});
router.get('/controlDraft', function(req, res, next) {
	var query = req.query;
	var getData = new outData({
		type:query.getType,
		tableName:'draft',
		limit:[{
			name:'title',
			value:query.title
		}],
		callback:function (data) {
			console.log(data);
			res.send(JSON.stringify(data));
		}
	});
});
router.post('/keep', function(req, res, next) {
	var keep = new keeper('artic');
	keep.getValue(req,res);
	keep.query(req,res);
});
router.post('/keepDraft', function(req, res, next) {
	var keep = new keeper('draft');
	keep.getValue(req,res);
	keep.query(req,res);
});
module.exports = router;
