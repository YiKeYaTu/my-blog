
var mysql = require('./mysql-tools');
var fs = require('fs');
function insert (keeperName) {
	this.keeperName = keeperName;
	this.valueObj;
}
insert.prototype.getValue = function (req,res) {
	var tempArr = [],
		key;
	this.valueObj = req.body;
	for (key in this.valueObj) {
		tempArr.push(this.valueObj[key]);
		if (key === 'tag') {
			tempArr.push(this._formDate(new Date()));
		}
	}
	this.valueObj = tempArr;
};
insert.prototype.query = function (req,res) {
	var	sql = mysql(),
		self = this;
	this._makeContentFile();
	sql.connect();
	sql.query('INSERT INTO ' + this.keeperName + ' (title,content,tag,date,classify) VALUES (?,?,?,?,?)',this.valueObj)
		.then(function (err,row,fields) {
			if (err) {
				res.send({
					status:500,
					content:'保存失败',
					err:err
				})
			} else {
				res.send({
					status:200,
					content:JSON.stringify(self.valueObj)
				})
			}
		})
		.then(function () {
			sql.end();
		});
};
insert.prototype._makeContentFile = function () {//写入文件内容进文档 并且将之替换为时间
	var timer = new Date().toString().replace(/\s/g,'');
	fs.writeFile(__dirname + '/../../' + this.keeperName + '/' + timer + '.lcmd',this.valueObj[1],function (err) {
		if (err) {
			console.log(err);
		}
	});
	this.valueObj[1] = timer;
};
insert.prototype._formDate = function (date) {
	return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
};

module.exports = insert;