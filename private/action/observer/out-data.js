
var mysql = require('./mysql-tools');
var fs = require('fs');
var async = require('async');
function outIt (config) {
	this.type = config.type.toUpperCase();
	this.tableName = config.tableName;
	this.take = config.take;
	this.limit = config.limit || [];
	this.callback = config.callback;
	this.sql = '';
	if (this.type == 'SELECT') {
		this.get();
	} else if (this.type == 'DELETE') {
		this.delete();
	}
}
outIt.prototype._parseSelect = function () {
	var tableName = this.tableName,
		take = this.take;
	var	pLimt = 'SELECT ' + take + ' FROM ' + tableName;
	this.sql += pLimt;
}
outIt.prototype._parseDelete = function () {
	var tableName = this.tableName;
	var	pLimt = 'DELETE FROM ' + tableName;
	this.sql += pLimt;
}
outIt.prototype._parseLimit = function () {
	var limit = this.limit,
		pLimt = '';
	if (this.type == 'delete' && !this.limit[0]) {
		throw 'delete mush hava limt';
	}
	limit && limit.forEach(function (item,index) {
		if (index == 0) {
			pLimt += ' WHERE ' + item.name + ' = ?';
		} else {
			pLimt += ' AND ' + item.name + ' = ?';
		}
	});
	this.sql += pLimt;
	console.log(this.sql);
}
outIt.prototype.delete = function () {
	var self = this;
	var sql = mysql();
	var value = [];
	self.limit.forEach(function (item) {
		value.push(item.value);
	});
	self._parseDelete();
	self._parseLimit();
	sql.query(self.sql,value)
		.then(function (err,row) {
			if (err) {
				console.log('database-err' + err);
			}
			self.callback && self.callback(row);
		})
}
outIt.prototype.get = function () {
	var sql = mysql();
	var self = this;
	var value = [];
	self.limit.forEach(function (item) {
		value.push(item.value);
	});
	this._parseSelect();
	this._parseLimit();
	sql.connect();
	sql.query(this.sql,value)
		.then(function (err,row) {
			var name;
			console.log(row);
			var done = self.done(row);
			row.forEach(function (item) {
				if (name = item.content) {
					fs.readFile(__dirname + '/../../artic/' + name + '.lcmd',function (err,data) {
						if (err) {
							throw err;
						}
						item.content = data.toString('utf-8');
						done();
					});
				} else {
					done();
				}
			});
		})
		.then(function () {
			sql.end();
		});
}
outIt.prototype.done = function (row) {
	var self = this;
	if (row.length > 0) {
		var i = 0;
		return function () {
			if (++i == row.length) {
				self.callback && self.callback(row);
			}
		} 
	} else {
		self.callback && self.callback(row);
	}
}
module.exports = outIt;