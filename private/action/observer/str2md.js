var fs = require('fs');
function str2md (str) {
	this.str = str;
	this.keeper = new Object();
	this.replace();
};
str2md.prototype.get = function () {
	return this.str;
};
str2md.prototype.replace = function () {
	var tpl = this.str;
	tpl = this._codeKeeper(tpl);
	tpl = this._h(tpl);
	tpl = this._p(tpl);
	tpl = this.freeKeeper(tpl,'code');
	this.str = tpl;
};
str2md.prototype._codeKeeper = function (tpl) {
	var self = this;
	return tpl.replace(/`([\s\S]+?)`/g,function (match,code) {
		if (!self['codeKeeper']) {
			self['codeKeeper'] = [];
		}
		self['codeKeeper'].push(code);
		return '<lc-codeKeeper-lc>';
	});
};
str2md.prototype._h = function (tpl) {//替换h标签
	var i = 8,
		str = tpl;
	var exp;
	while (--i > 1) {	
		exp = eval('/#{' + i + '}([\\s\\S]+?)(?:\\n|$)/g');
		str = str.replace(exp,function (match,code) {
			return '<h' + i + '>' + code + '</h' + i + '>' + '\n';
		});
	}
	return str;
};
str2md.prototype._p = function (tpl) {
	return tpl.replace(/(.*?)(?:\n|$)/g,function (match,code) {
		if (code.match(/^<.+?>/)) {
			return match;
		}
		return '<p>' + code + '</p>' + '\n';
	})
};
str2md.prototype.freeKeeper = function (tpl,keep) {
	var i = 0,
		str = tpl,
		self = this;
	var exp = eval('/<lc-' + keep + 'Keeper-lc>/g');
	return str.replace(exp,function (match) {
		return '<pre><code>' + self[keep + 'Keeper'][i++] + '</code></pre>';
	});
};
str2md.prototype.writeInFile = function (fileName,dirname) {
	
};
module.exports = str2md;