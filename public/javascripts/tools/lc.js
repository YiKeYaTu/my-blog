define(function (require,exports,module) {
	(function (window) {
		var lc = function (selector) {
			return selector? new lc.prototype.init(selector):lc.prototype.init();
		}
		lc.prototype = {
			init:function (selector) {
				if (selector) {
					this.selector = [];
					this.createElement(selector) || this.find(selector);
				}
				return this;
			},
			vNode : function () {//虚拟节点 还未添加入DOM的节点方法
				this.appendTo = function () {

				}
			},
			node : function () {
				this.cache = {};
				this.offset = function () {
					var i = -1,
						temp = [];
					while (this[++i]) {
						var obj = {};
						obj.top = this[i].offsetTop;
						obj.left = this[i].offsetLeft;
						obj.width = this[i].offsetWidth;
						obj.height = this[i].offsetHeight;
						temp.push(obj);
					};
					return temp.length > 1?temp:temp[0];
				};
				this.outDom = function () {
					var i = 0;
					while (this[i]) {
						lc.removeCache(this.selector.join(','));
						this[i].parentNode.removeChild(this[i++]);
					}
					return this;
				}
				this.createElement = function (selector) {
					var IsElement = /^<(.+?)>.*?<\/.+?>$/,//判断是不是一个节点元素格式 并抽取节点信息
						nodeInf;
					if (typeof selector === 'string' && selector.match(IsElement)) {
						nodeInf = selector.match(IsElement);
						var expJson = {
							'tagName':/(^.+?)\s/,
							'id':/\s+id\s*=\s*['"](.*?)['"]/,
							'className':/\s+class\s*=\s*['"](.*?)['"]/
						};
						var doc = document,
							temp,
							key;
						nodeInf = nodeInf[1];
						for (key in expJson) {
							expJson[key] = nodeInf.match(expJson[key]);
							if (!expJson[key] || (expJson[key] && !expJson[key][1])) {
								if (key === 'tagName') {
									break;
								} else {
									continue;
								}
							}
							switch (key) {
								case 'tagName' : 
									temp = doc.createElement(expJson[key][1]);
									break;
								case 'id' : 
									temp.id = expJson[key][1];
									break;
								case 'className' : 
									temp.className = expJson[key][1];
									break;
							}
						}
						this[0] = temp;
						return true;
					}
				};
				this.addClass = function () {
					var i = -1,
						j = 0;
					var tools = lc.prototype;
					while (arguments[++i]) {
						if (!tools.is(arguments[i,'string'])) {
							continue;
						}
						while (this[j]) {
							this[j++].className = arguments[i];
						}
					}
					return this;
				};
				this.animation = function (json,speed,callback) {
				};
				this.each =  function (fn) {
					var i = 0;
					while (this[i]) {
						fn(this[i++]);
					}
					return this;
				};
				this.val = function (value) {
					var i = -1;
					if (value) {
						while (this[++i]) {
							this[i].value = value;
						}
						return this;
					} else {
						var arr = [];
						while (this[++i]) {
							arr.push(this[i].value);
						}
						return arr.length == 1 ? arr[0] : arr;
					}
				};
				this.css = function (cssText) {
					var str = [],
						tools = lc.prototype,
						i = 0,
						arr = arguments;
					if (typeof cssText === "object") {
						for (var key in cssText) {
							str.push(key + ":" + cssText[key]);
						}
						str = str.join(";");
						while (this[i]) {
							this[i].style.cssText = str;
							i++;
						}
					} else if(arr.length == 2&&typeof arr[0] === "string"&&typeof arr[1] === "string" || typeof arr[1] === "number") {
						while (this[i]) {
							this[i].style[arr[0]] = arr[1];
							i++;
						}
					} else if (arr.length == 1&&typeof arr[0] === "string") {
						return tools.getStyle(this[0],cssText);
					}
					 else {
						throw "can shu cuo wu";
					}
					
					return this;
				};
				this.back = function () {
					var i = 0;
					while (this[i]) {
						delete this[i++];
					}
					this.selector = [];
					return this;
				};	
				this.attr = function (key,value) {
					var i = 0,
						res = [];
					if (value) {
						while (this[i]) {
							this[i++].setAttribute(key,value);
						}
						return this;
					} else {
						while (this[i]) {
							res[i] = this[i++].getAttribute(key);
						}
						return res.length > 1?res:res[0];
					}
				};
				this.html = function (write) {
					var i = 0,temp = [];
					if (!write) {
						while (this[i]) {
							temp.push(this[i++].innerHTML);
						}
						return temp.length == 1?temp[0]:temp;
					}
					while (this[i]) {
						this[i++].innerHTML = write;
					}
					return this;
				};
				this.eq = function () {
					var i = 0,
						that = this,
						temp = [],
						tools = lc.prototype
						_arr = arguments;
					if (_arr.length > 0) {
						while (that[i]) {
							tools.each(_arr,function (item) {
								if (i == item&&tools.indexOf(temp,that[i]) == -1) {
									temp.push(that[i]);
								}
							});
							i++;
						}
						tools.each(temp,function (item,index) {
							that[index] = item;
						})
						i = temp.length;
						while (that[i]) {
							delete that[i++];
						}
					}
					return this;
				},
				this.children = function (which) {
					var i = 0,temp = [],that = this,
						tools = lc.prototype;
					while (this[i]) {
						if (this[i].children[which]) {
							temp.push(this[i].children[which]);
						}
						i++;
					}
					tools.each(temp,function (item,index) {
						that[index] = item;
					});
					i = temp.length;
					while (that[i]) {
						delete that[i++];
					}
					return that;
				};
				this.unon = function (type,callback) {
					var i = 0,
						key = callback.toString().replace(/\s/g,"");
					if (this[i].removeEventListener) {
						while (this[i]) {
							if (!this[i].eventKeeper || !this[i].eventKeeper[key]) {
								i++;
								continue;
							}
							this[i].removeEventListener(type,this[i++].eventKeeper[key]);
						}
					} else if (this[i].detachEvent) {
						while (this[i]) {
							if (!this[i].eventKeeper || !this[i].eventKeeper[key]) {
								i++;
								continue;
							}
							this[i].detachEvent("on" + type,this[i++].eventKeeper[key]);
						}
					} else {
						while (this[i]) {
							this[i]["on" + type] = null;
						}
					}
					return this;
				}
				this.on = function (type,callback) {
					var i = 0,fn,
						handle = function (event,that) {
							var e = event || window.event,
								_that = that || this,
								preventDefault = e.preventDefault,
								stopPropagation = e.stopPropagation,
								flag;
							e.target = e.target || e.srcElement;
							e.preventDefault = function () {
								if (preventDefault) {
									preventDefault.call(e);
								} else {
									e.returnValue = false;
								}
							};
							e.stopPropagation = function () {
								if (stopPropagation) {
									stopPropagation.call(e);
								} else {
									e.cancelBubble = true;
								}
							};
							flag = callback.call(_that,e);
							if (flag === undefined) {
								flag = true;
							}
							if (!flag) {
								e.preventDefault();
							}
						},
						keep = function (target,ie) {
							var key = callback.toString().replace(/\s/g,"");
							if (!target.eventKeeper) {
								target.eventKeeper = {};
							}
							target.eventKeeper[key] = ie || handle;
						};
					if (this[0].addEventListener) {
						while (this[i]) {
							keep(this[i]);
							this[i++].addEventListener(type,handle);
						}
					} else if (this[0].attachEvent) {
						while (this[i]) {
							this[i].attachEvent("on" + type,(function (that) {
								fn = function (event) {
									handle(event,that);
								};
								return fn;
							})(this[i]));
							keep(this[i++],fn);
						}
					} else {
						while (this[i]) {
							keep(this[i]);
							this[i++]["on" + type] = handle;
						}
					}
					return this;
				};
				this.prv = function () {
					var i = 0,j = 0,temp,
						tools = lc.prototype;
					while (this[j]) {
						if (temp = tools.prvElement(this[j])) {
							this[i++] = temp; 
						}
						j++;
					}
					while (this[i]) {
						delete this[i++];
					}
					return this;
				};
				this.next = function () {
					var i = 0,j = 0,temp,
						tools = lc.prototype;
					while (this[j]) {
						if (temp = tools.nextElement(this[j])) {
							this[i++] = temp; 
						}
						j++;
					}
					while (this[i]) {
						delete this[i++];
					}
					return this;
				};
				this.parent = function () {
					var i = 0,j = 0,temp;
					while (this[j]) {
						if (temp = this[j].parentNode) {
							this[i++] = temp; 
						}
						j++;
					}
					while (this[i]) {
						delete this[i++];
					}
					return this;
				};
				this.all = function (fn) {
					var i = 0;
					while (this[i]) {
						fn(lc(this[i++]));
					}
					return this;
				};
				this.add = function () {
					
				}
				this.find = function (selector) {
					if (!selector) {
						throw "least 1 can shu";
					}		
					if (typeof selector == "object") {
						this[0] = selector;
						return this;
					}	
					if (!selector.replace(/\s/g,"")) {
						throw "your can shu shi empty de";
					};
					
					var tools = lc.prototype,doc = [],that = this,res = [],
						selector = selector.replace(/^\s*|\s*$/g,""),
						selector = selector.replace(/>/g," > "),
						selector = selector.replace(/\+/g," + "),
						selector = selector.replace(/\s*\[\s*/g,"["),
						selector = selector.replace(/\s*\]/g,"]"),
						selector = selector.replace(/\s*=\s*/g,"="),
						selector_arr = selector.match(/[^\s]+/g),
						i = selector_arr.length - 1,
						keep_selector = that.selector.toString() + "," + selector_arr.toString(),
						exp_json = {
							tagName:/^([^\[\]>\+\.#\s]+)/,
							className:/\.([^\[\]#\+>\s]+)/,
							id:/#([^\[\]\+>\s\.]+)/,
							attr:/\[(.+)\]/,
							context:/([>\+])/
						},
						match_json = {
							tagName:"",
							className:"",
							id:"",
							attr:"",
							context:""
						},
						match_fn = function () {
							var out_cache,cache_len;
							if (keep_selector[0] == ",") {
								keep_selector = keep_selector.slice(1);
							}
							if (that.cache[keep_selector]) {
								out_cache = tools.cloneLc(that.cache[keep_selector]);
								for (var key in out_cache) {
									if (key*1) {
										cache_len = key*1 + 1;
									}
									if (key*1 == "0") {
										cache_len = 1;
									}
									that[key] = out_cache[key];
								}
								while (that[cache_len]) {
									delete that[cache_len++];
								}
								return that;
							}
						//	console.log(1);
							var temp,
								name,
								exp,
								count_len,
								count = 0;
							if (that[count]) {
								while (that[count]) {
									doc.push(that[count++]);
								}
							} else if (!that.selector[0]) {
								doc[0] = document;
							}
							that.selector.push(selector.replace(/\s+/g,","));
							for (count = 0,count_len = doc.length;count < count_len;count++) {
								temp = null;
								for (var key in exp_json) {
									match_json[key] = selector_arr[i].match(exp_json[key]);
									if (match_json[key]) {
										match_json[key] = match_json[key][1];
										if (key == "attr") {
											var tempObject = {};
											tempObject["key"] =  match_json[key].split("=")[0];
											tempObject["value"] =  match_json[key].split("=")[1];
											match_json[key] = tempObject;
										}
									}
								}
								if (name = match_json["id"]) {
									temp = [];
									temp[0] = tools.get_by_id(doc[count],name);
									if (!temp[0]) continue;
								}
								if (name = match_json["className"]) {
									if (temp) {
										exp = eval("/[\\s]" + name + "\\s|" + "[\\s]" + name + "$|" + "^" + name + "\\s|" + "^" + name + "$/");
										temp[0].className.match(exp)?temp = temp:temp = [];
									} else {
										temp = tools.get_by_class(doc[count],name);
									}
									if (!temp[0]) continue;
								}
								if (name = match_json["tagName"]) {
									if (!temp) {
										temp = tools.make_arr(doc[count].getElementsByTagName(name));
									} else {
										var res_temp = [];
										tools.each(temp,function (item,index) {
											if (item.nodeName.toLowerCase() == name.toLowerCase()) {
												res_temp.push(item);
											}
										});
										temp = res_temp;
									}
								}
								if (name = match_json["attr"]) {
									res_temp = [];
									if (!temp) {
										temp = doc[count].getElementsByTagName("*");
									}
									tools.each(temp,function (item) {
										if (item.getAttribute(name.key) == name.value) {
											res_temp.push(item);
										}
									});
									temp = res_temp;
								}
								res = res.concat(search_top(temp,temp,i - 1));
							}
							tools.each(res,function (item,index) {
								that[index] = item;
							});
							count = res.length;
							while (that[count]) {
								delete that[count++];
							}
						},
						search_top = function (temp,res,i,context) {
							var j,len,target,name,exp,
								_temp = [],
								_res = [];
							if (i < 0) {
								return res;
							}
							for (var key in exp_json) {
								match_json[key] = selector_arr[i].match(exp_json[key]);
								if (match_json[key]) {
									match_json[key] = match_json[key][1];
									if (key == "attr") {
										var tempObject = {};
										tempObject["key"] =  match_json[key].split("=")[0];
										tempObject["value"] =  match_json[key].split("=")[1];
										match_json[key] = tempObject;
									}
								}
							}
							if (name = match_json["context"]) {
								if (name == ">") {
									name = "parentNode";
								} else if (name == "+") {
									name = "previousSibling";
								}
								return search_top(temp,res,--i,name);
							}
							for (j = 0,len = temp.length;j < len;j++) {
								if (context == "previousSibling") {
									target = tools.prvElement(temp[j]);
								} else {
									target = temp[j].parentNode;
								}
								do {
									if (!target&&!context) {
										continue;
									} else if (!target) {
										break;
									}
									if (target == document) {
										break;
									}
									if (name = match_json["id"]) {
										if (target.id != name&&!context) {
											continue;
										} else if(target.id != name) {
											break;
										}
									}
									if (name = match_json["attr"]) {
										if (target.getAttribute(name.key) != name.value&&!context) {
											continue;
										} else if (target.getAttribute(name.key) != name.value) {
											break;
										}
									}
									if (name = match_json["className"]) {
										exp = eval("/[\\s]" + name + "\\s|" + "[\\s]" + name + "$|" + "^" + name + "\\s|" + "^" + name + "$/");
										if (!target.className.match(exp)&&!context) {
											continue;
										} else if (!target.className.match(exp)) {
											break;
										}
									}
									if (name = match_json["tagName"]) {
										if (target.nodeName.toLowerCase() != name.toLowerCase()&&!context) {
											continue;
										} else if (target.nodeName.toLowerCase() != name.toLowerCase()) {
											break;
										}
									}
									_temp.push(target);
									_res.push(res[j]);
									if (context) {
										break;
									}
								} while (target = target.parentNode);
								
							}
							return search_top(_temp,_res,--i);
						};		
					match_fn();
					if (that[0]) {
						that.cache[keep_selector] = tools.cloneLc(that);
					}
					return that;
				}
			},
			get : function (target,json,callback) {
				var xhr,key,
					arr = [];
				if (window.XMLHttpRequest) {
					xhr = new XMLHttpRequest();
				} else if (window.ActiveXObject) {
					xhr = new ActiveXObject(Microsoft.XMLHTTP);
				}
				for (key in json) {
					arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(json[key]));
				}
				arr = arr.join("&");
				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {
						if (xhr.status >= 200&&xhr.status < 300||xhr.status == 304) {
							callback && callback(xhr.responseText);
						} else {
							return;
						}
					}
				}
				xhr.open("GET",target + "?" + arr,true);
				xhr.send(null);
			},
			post : function (target,json,callback) {
				var xhr,key,
					arr = [];
				if (window.XMLHttpRequest) {
					xhr = new XMLHttpRequest();
				} else if (window.ActiveXObject) {
					xhr = new ActiveXObject(Microsoft.XMLHTTP);
				}
				for (key in json) {
					arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(json[key]));
				}
				arr = arr.join("&");
				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {
						if (xhr.status >= 200&&xhr.status < 300||xhr.status == 304) {
							callback && callback(xhr.responseText);
						} else {
							return;
						}
					}
				}
				xhr.open("POST",target,true);
				xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				xhr.send(arr);
			},
			ajax : function () {

			},
			cubicBezier : function(p1,p2,p3,p4,t){
			    var self = this,
			        pa = p1 || {x:0,y:0},
			        pb = p2 || {x:100,y:900},
			        pc = p3 || {x:800,y:850},
			        pd = p4 || {x:1400,y:750},
			        x,y;
			    x = pa.x*Math.pow(1-t,3) + 3*pb.x*t*Math.pow(1-t,2) + 3*pc.x*Math.pow(t,2)*(1-t)+pd.x*Math.pow(t,3);
			    y = pa.y*Math.pow(1-t,3) + 3*pb.y*t*Math.pow(1-t,2) + 3*pc.y*Math.pow(t,2)*(1-t)+pd.y*Math.pow(t,3);
			    return {x:x,y:y};
			},
			ready : (function () {
				var	callback = [],
					obj = {
						and : function (fn) {
							callback.push(fn);
							return obj;
						}
					};
				window.onload = function () {
					var i = 0;
					while (callback[i]) {
						callback[i++]();
					}
				};
				return function (fn) {
					callback.push(fn);
					return obj;
				}
			})(),
			prvElement : function (node) {
				if (node.addEventListener) {
					return node.previousElementSibling;
				}else {
					while (node = node.previousSibling) {
						if (node.nodeType == 1) break;
					}
					return node;
				}
			},
			cloneLc : function (obj) {
				var o = {};
				for (var key in obj) {
					if (this.is(obj[key],"array")) {
						var arr = [];
						this.each(obj[key],function (item) {
							arr.push(item);
						});
						o[key] = arr;
					} else {
						o[key] = obj[key];
					}
				}
				return o;
			},
			nextElement : function (node) {
				if (node.addEventListener) {
					return node.nextElementSibling;
				}else {
					while (node = node.nextSibling) {
						if (node.nodeType == 1) break;
					}
					return node;
				}
			},
			walk_dom_all : function (node,fn) {
				node = node.firstChild;
				while (node) {
					fn(node);
					this.walk_dom_all(node,fn);
					node = node.nextSibling;
				}
			},
			walk_dom_child : function (node,fn) {
				while (node) {
					fn(node);
					node = node.nextSibling;
				}
			},
			get_by_class : function (father,target) {
				var node,temp,res,target;
				arguments.length == 1?node = document.body:node = father;
				if(node.getElementsByClassName){
					return this.make_arr(node.getElementsByClassName(target||father));
				}
				temp = node.getElementsByTagName("*"),
				res = [],that = this,exp = /[^\s]+/g,
				target = target?target.match(exp):father.match(exp);
				that.each(target,function (outer_item) {
					that.each(temp,function (inner_item){
						if(that.indexOf(inner_item.className.split(" "),outer_item) >= 0){
							res.push(inner_item);
						}
					});
					temp = res;
					res = [];
				});
				return temp[0]?temp:undefined;
			},
			get_by_id : function (father,target) {
				var node,target,i,len,
					that = this;
				arguments.length == 1?node = document:node = father;
				if(node.getElementById){
					return node.getElementById(target||father);
				}
				temp = that.make_arr(node.getElementsByTagName("*"));
				for (i = 0,len = temp.length;i < len;i++) {
					if (temp[i].id == target) {
						return temp[i];
					}
				}
				return undefined;
			},
			attr : function (node,target) {
				var _node;
				return (_node = node.getAttribute(target))?_node.replace(/\s/g,""):null;
			},
			is : function (target,type) {
				var _type = Object.prototype.toString.call(target);
				return _type.toLowerCase() === "[object " + type.toLowerCase() + "]";
			},
			each : function (arr,fn) {
				var	len = arr.length,
					i = 0;					
				if (!len) {
					arr = this.make_arr(arr);
					len = arr.length;
				}
				if (arr.forEach) {
					arr.forEach(fn);
				} else {
					for (;i < len;i++) {
						fn(arr[i],i,arr);
					}
				}
			},
			getStyle :function (target,style) {
				if(window.getComputedStyle){
					return window.getComputedStyle(target,null)[style];
				}else{
					return target.currentStyle[style];
				}
			},
			indexOf : function (arr,target,from) {
				var len = arr.length,
					from = from * 1 || 0;
				if (!len) {
					arr = this.make_arr(arr);
					len = arr.length;
				}
				if (arr.indexOf) {
					return arr.indexOf(target,from);
				}
				if (typeof from !== "number") {
					from = 0;
				}
				for (var i = from;i < len;i++) {
					if (target === arr[i]) {
						return i;
					}
				}
				return -1;
			},
			get_style : function (element,style) {
				if (element.addEventListener) {
					return window.getComputedStyle(element,null)[style];
				} else {
					return element.currentStyle[style];
				}
			},
			make_arr : function (obj) {
				var res = [],len;
				if (obj.length) {
					len = obj.length;
					for (var i = 0;i < len;i++) {
						res.push(obj[i]);
					}
				}else {
					for (var key in obj) {
						if (obj.hasOwnProperty(key)) {
							res.push(obj[key]);
						}
					}
				}
				return res;
			},
			eachElement : function () {

			},
			startGpu : function () {
				
			}
		}
		var node_init = new lc.prototype.node();
		lc.prototype.init.prototype = node_init;
		lc.removeCache = function (data) {
			if (data) {
				delete node_init.cache[data];
			} else {
				node_init.cache = {};
			}
		}
		if ( typeof module === "object" && module && typeof module.exports === "object" ) {
		    module.exports = lc;
		} else {
			window.lc = lc;
		}
	})(window);
});