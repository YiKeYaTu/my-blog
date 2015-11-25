var express = require('express');
var router = express.Router();
var outData = require('../private/action/observer/out-data');
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
	var getData = new outData({
		type:'select',
		tableName:'artic',
		take:'*',
		callback:function (data) {
			res.render('index',{
				res :  data
			})
		}
	});
});

module.exports = router;
