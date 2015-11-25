var mysql = require('mysql');
var fs = require('fs');
var mysqlTools = function (opt) {
	var connection = function (opt) {
		var self = this,
			data = opt;
		if (!data) {		
			data = fs.readFileSync(__dirname + '/../../config.json','utf-8');
			data = JSON.parse(data);
		} 
		self.connection = mysql.createConnection(data);
	};
	connection.prototype.connect = function (req,res) {
		try {
			this.connection.connect();
		} catch (err) {
			res.send(err.toString());
		}
	};
	connection.prototype.end = function (req,res) {
		try {
			this.connection.end();
		} catch (err) {
			res.send(err.toString());
		}
	};
	connection.prototype.query = function (sql,value) {
		var self = this,
			callbackArr = [];
		var callback = function (err,row,fields) {
			var i = -1;
			while (typeof callbackArr[++i] === 'function') {
				callbackArr[i](err,row,fields);
			}
		};
		var then = function (fn) {
			callbackArr.push(fn);
			return {
				then:then
			}
		};
		setTimeout(function () {
			if (value) {
				self.connection.query(sql,value,callback);
			} else {
				self.connection.query(sql,callback);
			}
		},10);
		return {
			then : then
		}
	}
	return new connection(opt);
}
module.exports = mysqlTools;