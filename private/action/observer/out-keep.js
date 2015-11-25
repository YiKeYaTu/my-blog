
var mysql = require('./mysql-tools');

var outKeep = {
	route:{
		Delete: function (take,callback) {
			var	sql = mysql();
			sql.connect();
			sql.query('DELETE FROM draft WHERE title = ?',[take.replace(/\s/g,'')])
				.then(function (err,row,fields) {
					callback(err,row,fields)
				})
				.then(function () {
					sql.end();
				});
		},
		returnDate: function (take,callback) {
			var	sql = mysql(),
				limit = limit || {},
				name = limit.name,
				value = limit.value;
			var sqlS;
			if (name && value) {
				sqlS = 'SELECT ' + take + 'FROM draft WHERE ' + name + '= ' + value;
			} else {
				sqlS = 'SELECT ' + take + ' FROM draft';
			}
			sql.connect();
			sql.query(sqlS)
				.then(function (err,row,fields) {
					callback(err,row,fields)
				})
				.then(function () {
					sql.end();
				});
		}
	},
	controlDraft: function (method,take,callback) {
		if (typeof this.route[method] === 'function') {
			this.route[method](take,callback);
		}
	}
};
	
module.exports = outKeep;