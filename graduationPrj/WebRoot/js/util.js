var xmlHttp;

// 全局变量，用来标识是否设置为自动滚动条
var flag = true;

var tabFlickerUsers = [];

/**
 * @method tabFlicker
 * @private
 * @description 创建闪烁任务，该方法已经弃用
 */
var tabFlicker = function(taskName, tabs, tabID) {
	var flag1 = false;
	taskName = {
		run : function() {
			// var tabs = Ext.getCmp('tabs');
			// var tab = tabs.getItem(tabID);
			if (flag1) {
				tabs.getItem(tabID).setTitle('<font color="red">和' + tabID
						+ '聊天中</font>');
				flag1 = false;
			} else {
				tabs.getItem(tabID).setTitle('<font color="blue">和' + tabID
						+ '聊天中</font>');
				flag1 = true;
			}
		},
		interval : 100
	}
	return taskName;
}

/**
 * @method createXMLHttpRequest
 * @private
 * @description 创建XMLHttpRequest对象
 */
function createXMLHttpRequest() {

	if (window.ActiveXObject) // IE
	{
		try {
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
			}
		}
	} else {
		if (window.XMLHttpRequest) // Mozilla, Safari,
		{
			xmlHttp = new XMLHttpRequest();
			if (xmlHttp.overrideMimeType) {
				xmlHttp.overrideMimeType('text/xml');
			}
		}
	}

	if (!xmlHttp) {
		alert('错误：不能创建 XMLHTTP 实例');
	}
}
/**
 * @method unloadDestorySession
 * @private
 * @description 当点击关闭的时候调用该方法来销毁session
 */
function unloadDestorySession(event) {

	event = (event) ? event : window.event;
	// 首先要判断是要关闭页面还是要刷新页面
	// 关闭页面要销毁session而刷新页面要保留session
	if (event.clientX < 0 && event.clientY < 0 || event.altKey) {
		try {
			// 关闭
			createXMLHttpRequest();
			var url = "/graduationPrj/logout.action";
			xmlHttp.open("POST", url, false);
			xmlHttp.send(null);
			// var result = xmlHttp.responseText;
		} catch (e) {
			// 异常处理，防止服务器关闭后，解决用户关闭页面产生脚本错误！
		} finally {
			// alert(document.getElementById('CurrUser').value)

			// alert("关闭");
			var CurrUser = document.getElementById('CurrUser').value;
			var sessionid = document.getElementById('sessionid').value;
			PublicChatJS.reloadUsers(CurrUser, sessionid, "logout");
			DelCookie("refresh");
		}
	} else {
		// alert(GetCookie("refresh"));
		SetCookie("refresh", "true");
	}
}

/**
 * @method init
 * @private
 * @description 初始化方法，激活dwr反转，并且获取群体聊天室聊天信息以及更新所有用户上网在线用户树
 */
function init() {
	var CurrUser = document.getElementById('CurrUser').value;
	var sessionid = document.getElementById('sessionid').value;
	dwr.engine.setActiveReverseAjax(true);
	var refresh = GetCookie("refresh");

	if (refresh != null && refresh == 'true') {
		PublicChatJS.updateScriptSessionMap(sessionid, "login");
		PublicChatJS.getMessages();
		checkUserOnline();
	} else {
		PublicChatJS.reloadUsers(CurrUser, sessionid, "login");
		PublicChatJS.getMessages();
		checkUserOnline();
	}
}

/**
 * @method addOrOpenTab
 * @private
 * @description 判断tab有没有存在，如果不存在添加新tab
 */
var receiveMsgAddOrOpenTab = function(tabs, fromUserSessionid, fromUserName) {
	var n = tabs.getComponent(fromUserName);
	var flag1 = false
	var runner = new Ext.util.TaskRunner();;
	var task = {
		run : function() {
			if (flag1) {
				tabs.getItem(fromUserName).setTitle('<font color=red>和'
						+ fromUserName + '聊天中</font>');
				flag1 = false;
			} else {
				tabs.getItem(fromUserName).setTitle('<font color=blue>和'
						+ fromUserName + '聊天中</font>');
				flag1 = true;
			}
		},
		interval : 100
	};
	if (!n) {
		n = tabs.add({
			id : fromUserName,
			title : '和' + fromUserName + '聊天中',
			layout : 'border',
			closable : true,
			items : [new Ext.Panel({
						region : 'center',
						title : '聊天记录  ',
						autoScroll : true,
						html : '<div id=' + fromUserName + 'div></div>',
						/*
						 * tools : [{ id : 'refresh', qtip :
						 * '注意：如果长时间没有收到对方回应，试一下', // hidden:true, handler :
						 * function(event, toolEl, panel) { // refresh logic }
						 * }],
						 */
						bbar : ['->', {
									id : 'changScoll',
									xtype : 'button',
									text : '锁定滚动条',
									handler : function() {
										if (flag) {
											flag = false;
										} else {
											flag = true;
										}
										this.setText(flag ? '锁定滚动条' : '恢复自动滚动');
									}
								}]
					})]
		});
		var currActiveTabId = tabs.getActiveTab().getId();
		var currActiveTab = tabs.getItem(currActiveTabId);

		tabs.setActiveTab(n);
		tabs.setActiveTab(currActiveTab);

	}
	var afn = function() {
		runner.stop(task);
		tabFlickerUsers.remove(fromUserName);
		tabs.getItem(fromUserName).setTitle('和' + fromUserName + '聊天中');
		autoScollTop(fromUserName + 'div');
		Ext.getCmp("htmleditor").focus(true, true);
		// n.un('activate', afn);
	};

	var beforeClose = function() {
		runner.stop(task);
		tabFlickerUsers.remove(fromUserName);
		// tabs.un('beforeremove', beforeClose);
	}
	n.on('activate', afn);

	tabs.on('beforeremove', beforeClose);

	var currActiveTabId = tabs.getActiveTab().getId();
	var currActiveTab = tabs.getItem(currActiveTabId);
	var fromUserTab = tabs.getItem(fromUserName);
	if (currActiveTab != fromUserTab) {
		// var taskName = tabFlicker(fromUserName,tabs,fromUserName);
		Ext.example.msg('消息提示', '收到 "{0}" 的消息！请注意查收!', fromUserName);

		for (i = 0; i < tabFlickerUsers.length; i++) {
			if (tabFlickerUsers[i] == fromUserName) {
				return;
			}
		}
		tabFlickerUsers.push(fromUserName);
		runner.start(task);
	}
}

/**
 * @method autoScollTop
 * @private
 * @description 设置滚动条是否自动滚动
 */
var autoScollTop = function(divid) {
	// var flag = document.getElementById('flag').value;
	if (flag) {
		// 让滚动条一直呆在最下面
		var publicChatDiv = document.getElementById(divid);
		publicChatDiv.parentNode.scrollTop = publicChatDiv.parentNode.scrollHeight;
		publicChatDiv.parentNode.scrollTop = publicChatDiv.parentNode.scrollHeight;
	} else {

	}
}

/**
 * @method reloadUsers
 * @private
 * @description 在用户登陆和退出时，会执行此方法，实时更新在线用户
 */
var reloadUsers = function(username, sessionid, onlineFlag) {
	Ext.getCmp('im-tree').root.reload();
	var CurrUser = document.getElementById('CurrUser').value;

	if (username == CurrUser) {

	} else {
		Ext.example.msg('消息提示', '您的好友 "{0}" {1}！', username, onlineFlag);
	}

}

/**
 * @method checkUserOnline
 * @private
 * @description 服务器端定时调用此方法，让客户端调用服务器端的receiveClientMsg方法，如果没调用，则认为该用户已离线
 */
var checkUserOnline = function() {
	var sessionid = document.getElementById('sessionid').value;
	var CurrUser = document.getElementById('CurrUser').value;
	PublicChatJS.receiveClientMsg(CurrUser,sessionid);
}

function allChatAutoScroll() {
	var tabs = Ext.getCmp('tabs');
	var allchatTab = tabs.getItem(tabs.getActiveTab().getId());
	var fn = function() {
		// Ext.getCmp("htmleditor").focus(true,true);
		autoScollTop('publicChat');
		allchatTab.un('activate', fn);
	}

	allchatTab.on('activate', fn);
}

/**
 * @method receivePublicMessages
 * @private
 * @description 接收公共聊天室的消息
 */
function receivePublicMessages(messages) {
	// var tabs = Ext.getCmp('tabs');
	var chatlog = "";
	for (var data in messages) {
		if (messages[data].sendDate == undefined
				|| messages[data].sendDate == '') {

		} else if (messages[data].toUserName == undefined
				|| messages[data].toUserName == '') {
			chatlog = "<div style='margin:20px 5px 10px 5px'> &nbsp;&nbsp;"
					+ messages[data].sendDate + " <b>"
					+ messages[data].fromUserName + "</b>说:"
					+ messages[data].message + "</div>" + chatlog;
		} else {
			chatlog = "<div style='margin:20px 5px 10px 5px'> &nbsp;&nbsp;"
					+ messages[data].sendDate + " <b>"
					+ messages[data].fromUserName + "</b> 对 <b> "
					+ messages[data].toUserName + "</b> 说:"
					+ messages[data].message + "</div>" + chatlog;
		}
	}
	document.getElementById('publicChat').innerHTML = chatlog;
	autoScollTop('publicChat');
}

/**
 * @method receivePrivateMessages
 * @private
 * @description 接收私人聊天的消息
 */
function receivePrivateMessages(fromUserName, toUserName, fromUserSessionid,
		privateMsg) {
	var tabs = Ext.getCmp('tabs');
	var CurrUser = document.getElementById('CurrUser').value;
	if (CurrUser == fromUserName) {

	} else {
		receiveMsgAddOrOpenTab(tabs, fromUserSessionid, fromUserName);
	}

	var chatlog = "";
	for (var data in privateMsg) {
		if (privateMsg[data].sendDate == undefined
				|| privateMsg[data].sendDate == '') {

		} else {
			chatlog = "<div style='margin:20px 5px 10px 5px'> &nbsp;&nbsp;"
					+ privateMsg[data].sendDate + " <b>"
					+ privateMsg[data].fromUserName + "</b>说:"
					+ privateMsg[data].message + "</div>" + chatlog;
		}
	}
	if (CurrUser == fromUserName) {
		document.getElementById(toUserName + 'div').innerHTML = chatlog;
		// document.getElementById(fromUserName).innerHTML = chatlog;
		autoScollTop(toUserName + 'div');
	} else {
		PrivateChatJS.getPrivateMessages(fromUserName, toUserName, privateMsg);
		document.getElementById(fromUserName + 'div').innerHTML = chatlog;
		autoScollTop(fromUserName + 'div');
	}

	/*
	 * var currActiveTabId = tabs.getActiveTab().getId(); var currActiveTab =
	 * tabs.getItem(currActiveTabId); var fromUserTab =
	 * tabs.getItem(fromUserSessionid); if(currActiveTab != fromUserTab){
	 * Ext.example.msg('消息提示', '收到 "{0}" 的消息！请注意查收!', fromUserName); }
	 */
	// Ext.getCmp("htmleditor").focus(true, true);
}
/**
 * @method dbclickOpenTabGetMessages
 * @private
 * @description 双击打开一个tab时，获取对应用户的聊天记录
 */
function dbclickOpenTabGetMessages(toUserName, privateMsg) {
	var chatlog = "";
	for (var data in privateMsg) {
		if (privateMsg[data].sendDate == undefined
				|| privateMsg[data].sendDate == '') {

		} else {
			chatlog = "<div style='margin:20px 5px 10px 5px'> &nbsp;&nbsp;"
					+ privateMsg[data].sendDate + " <b>"
					+ privateMsg[data].fromUserName + "</b>说:"
					+ privateMsg[data].message + "</div>" + chatlog;
		}
	}
	document.getElementById(toUserName + 'div').innerHTML = chatlog;
	autoScollTop(toUserName + 'div');
}

/**
 * @method getSesssionIdByTabId
 * @private
 * @description 通过tab的id获取对应用户的sessionid
 */
function getSesssionIdByTabId(tabid) {
	var allNodes = getAllChildrenNodesByRoot();
	for (var i = 0; i < allNodes.length; i++) {
		if (allNodes[i].text == tabid) {
			// alert('用户存在');
			return allNodes[i].id;
		}
	}
	return null;
}

/**
 * 取得一个节点的所有子节点 包括本节点，用于判断打开的tab对应的用户是否下线
 */
function getAllChildrenNodesByRoot() {
	var root = Ext.getCmp('im-tree').root;
	var children = [];
	for (var i = 0; i < root.childNodes.length; i++) {
		children[i] = root.childNodes[i];
	}

	return children;
}

/**
 * @method logoutCurrUser
 * @private
 * @description 当有重复的用户上线时，顶替当前在线的重复用户（一个账户只允许在线一个）
 */
function logoutCurrUser() {
	Ext.Ajax.request({
				url : '/graduationPrj/logout.action',
				success : function() {
					var currUser = document.getElementById("CurrUser").value;
					var sessionid = document.getElementById('sessionid').value;
					PublicChatJS.reloadUsers(currUser, sessionid, "logout");
				}
			});
	Ext.MessageBox.alert('消息提示', "您的账号在其他地方重复登陆！该账号退出！", function() {
				DelCookie("refresh");
				window.location.href = '/graduationPrj/login.html';
			});
	/*
	 * var req = function() { Ext.Ajax.request({ url :
	 * '/graduationPrj/logout.action', success : function() { var currUser =
	 * document.getElementById("CurrUser").value; var sessionid =
	 * document.getElementById('sessionid').value;
	 * PublicChatJS.reloadUsers(currUser, sessionid, "logout");
	 * window.location.href = '/graduationPrj/login.html'; } });
	 */

	// }
}

/**
 * @method logoutNoneSendRequestUsers
 * @private
 * @description
 */
function logoutNoneSendRequestUsers(username,sessionid) {
	var currUser = document.getElementById("CurrUser").value;
	if (currUser == null || currUser == '') {
		PublicChatJS.reloadUsers(username, sessionid, "logout");
	} else {
		Ext.Ajax.request({
					url : '/graduationPrj/logout.action',
					success : function() {
						var sessionid = document.getElementById('sessionid').value;
						PublicChatJS.reloadUsers(currUser, sessionid, "logout");
					}
				});
		Ext.MessageBox.alert('消息提示', "您的账号由于网络原因，强制退出！请重新登陆！", function() {
					DelCookie("refresh");
					window.location.href = '/graduationPrj/login.html';
				});
	}

}