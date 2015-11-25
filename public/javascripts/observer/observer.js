define(function (require,exports,module) {
	var lc = require('../tools/lc');
	(function () {
		function handleText (node) {
			this.node = node;
		}
		handleText.prototype.tab = function () {

			var self = this,
				node = this.node;

			node.on('keydown',function (e) {
				var focus,
					l,
					r;
				if (e.keyCode == 9) {
					focus = self.getFocus();
					l = node.val().slice(0,focus);
					r = node.val().slice(focus);
					node.val(l + '    ' + r)
					self.setFocus(focus + 4);
					e.preventDefault();
				}
			})
		};
		handleText.prototype.getFocus = function () {
			return this.node[0].selectionStart;
		};
		handleText.prototype.setFocus = function (i) {
			this.node[0].selectionStart = i;
			this.node[0].selectionEnd = i;
		}
		var tab = new handleText(lc('.write-container'));
		tab.tab();
	})();

	(function () {
		function startAdmin () {
			this.titleContent = lc('.push-title');
			this.writeContent = lc('.write-container');
			this.classifyContent = lc('.tag');
			this.tagFocus = lc('.rizhi');
		};
		startAdmin.prototype._getPrview = function (src,callback) {
			var self = this;
			setTimeout(function () {
				lc().get(src,{
					'title':self.titleContent.val(),
					'content':self.writeContent.val()
				},function (res) {
					callback && callback(res);
				});
			});
		};
		startAdmin.prototype.prview = function () {
			var self = this;
			self.writeContent.on('keydown',function () {
				self._getPrview('/observer/str2md',function (res) {
					lc('.prview').html(res);
				});
			});
			return this;
		};
		startAdmin.prototype.focusChooseTag = function () {
			var eventArr = [lc('.luanxie'),lc('.rizhi'),lc('.xinqing')],
				self = this;
			for (var i = 0;i < 3;i++) {
				eventArr[i].on('click',function () {
					self.tagFocus.css('background','#6F81D6');
					lc(this).css('background','#FFB400');
					self.tagFocus = lc(this);
				})
			}
			return this;
		};
		startAdmin.prototype._checkUpload = function () {
			return !!this.titleContent.val() && !!this.writeContent.val()
				&& !!this.classifyContent.val();
		};
		startAdmin.prototype.bindUpload = function () {
			var self = this;
			var btn = lc('.tool-btn-outer').children(2);
			btn.on('click',function () {
				self.upload();
			});
			return this;
		};
		startAdmin.prototype.upload = function () {
			var self = this;
			if (!this._checkUpload()) {
				alert('信息填写不完整');
				return false;
			};
			lc().post('/observer/keep',{
				title:self.titleContent.val(),
				content:lc('.prview').html(),
				tag:self.tagFocus.html(),
				classifyContent:self.classifyContent.val()
			},function (res) {
				if (JSON.parse(res).status == 200) {
					alert('成功');
				}
			});
		};
		startAdmin.prototype.keepDraft = function () {
			var self = this;
			controlDraftShow(self);
			keepDraft(self);
			function controlDraftShow (self) {
				var controllers = lc('.show-tools-container'),
					tools = lc('.tools'),
					inf = lc('.show-tools-container').children(0),
					flag = true;

				controllers
					.on('click',function () {
						if (flag) {
							lc(this).css('left','308px');
							lc('.tools').css('left','0');
							inf.html('收回去');
						} else {
							lc(this).css('left','352px');
							lc('.tools').css('left','-392px');
							inf.html('工具栏');
						}
						flag = !flag;
					})
					.on('mouseover',function () {
						if (flag) {
							lc(this).css('left','392px');
						}
					})
					.on('mouseout',function () {
						if (flag) {
							lc(this).css('left','352px');
						}
					});
				tools
					.on('click',function (e) {
						e.stopPropagation();
					})
				lc(document.documentElement)
					.on('click',function () {
						if (!flag) {
							controllers.css('left','352px');
							lc('.tools').css('left','-392px');
							inf.html('工具栏');
							flag = !flag;
						}
					});
			}
			function keepDraft (self) {
				var btn = lc('.tool-btn-outer').children(0);
				var keepIt = function () {
					lc().post('/observer/keepDraft',{
						title:self.titleContent.val(),
						content:lc('.prview').html(),
						tag:self.tagFocus.html(),
						classifyContent:self.classifyContent.val()
					},function (res) {
						if (JSON.parse(res).status == 200) {
							successKeep(res);
							alert('成功');
						}
					});
				};
				var successKeep = function (res) {
					res = JSON.parse(res).content;
					res = JSON.parse(res);
					var node = lc('<p class="draft-el"></p>')
						.html(
							'<span>' + res[0] + '</span>' +
							'<span class="delete">D</span>' +
							'<span class="show">S</span>'
						);
					lc('.draft').find('p.no-data')[0] && lc('.draft').find('p.no-data').outDom();
					lc('.draft')[0].appendChild(node[0]);
				};
				btn.on('click',function () {
					keepIt();
				});
			}
			return this;
		};
		startAdmin.prototype.deleteDraft = function () {
			var btnAll = lc('.draft');
			btnAll.on('click',function (e) {
				var target = lc(e.target);
				if (target.attr('class') === 'delete') {
					lc().get('/observer/controlDraft',{
						getType: 'Delete',
						title: target.prv().html()
					},function (res) {
						res = JSON.parse(res);
						if (res.affectedRows) {
							_successDelete(target);
						}
					})
				}
			});

			function _successDelete (target) {
				btnAll[0].removeChild(target[0].parentNode);
				!lc('.draft').find('.delete')[0] && lc('.draft')[0].appendChild(lc('<p class="no-data"></p>').html('暂无数据')[0]);
				lc.removeCache('.draft,.delete');
				alert('删除成功');
			}
			return this;
		};
		startAdmin.prototype.showDraft = function () {
			var btnAll = lc('.draft');
			btnAll.on('click',function (e) {
				var target = lc(e.target);
				if (target.attr('class') === 'show') {
					lc().get('/observer/controlDraft',{
						getType: 'returnDate',
						title: '*'
					},function (res) {
						res = JSON.parse(res);
						if (res.affectedRows) {
							_successDelete(target);
						}
						console.log(res);
					})
				}
			});

		};
		var observer = new startAdmin();
		observer
			.prview()
			.focusChooseTag()
			.bindUpload()
			.keepDraft()
			.deleteDraft()
			.showDraft();
	})();

})
