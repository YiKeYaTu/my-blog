var express = require('express');
var router = express.Router();
var outData = require('../private/action/observer/out-data');
var fs = require('fs');
/* GET home page. */
router.get('/:id', function(req, res, next) {
	var articId = req.params['id'];
	var getData = new outData({
		type:'select',
		tableName:'artic',
		take:'*',
		callback:function (data) {
			console.log(data);
		}
	}); 
});

module.exports = router;
