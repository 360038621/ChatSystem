Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.BLANK_IMAGE_URL = 'ext/s.gif';
	/**
	 * @method
	 * @private
	 * @description 构建用户树
	 */
	var Tree = Ext.tree;
	// 定义（可以异步加载）根节点
	var root = new Tree.AsyncTreeNode({
				id : '0',
				text : '目录根节点'
			});
	// 开始构建树面板
	var treePanel = new Tree.TreePanel({
		id : 'im-tree',
		root : root,
		loader : new Tree.TreeLoader({
					// 从数据库加载树形结构数据
					dataUrl : '/graduationPrj/treePro.action'
				}),
		deferredRender : false,
		region : 'west',
		title : '在线用户',
		border : false,
		rootVisible : false,
		lines : false,
		autoScroll : true,
		enableDD : false,
		animate : false,
		split : true,
		width : 200,
		minSize : 175,
		maxSize : 400,
		collapsible : false,
		selModel : new Ext.tree.MultiSelectionModel(),
		margins : '0 0 0 5',
		tools : [{
					id : 'refresh',
					qtip : '刷新在线信息',
					// hidden:true,
					handler : function(event, toolEl, panel) {
						treePanel.root.reload();
					}
				}, {
					id : 'close',
					qtip : '清除选定',
					// hidden:true,
					handler : function(event, toolEl, panel) {
						Ext.getCmp('im-tree').getSelectionModel()
								.clearSelections();
					}
				}],
		tbar : [{
					text : '欢迎您！' + document.getElementById('CurrUser').value
							+ '！'

				}, '->', {
					text : '退出登陆',
					handler : function(e) {
						Ext.MessageBox.confirm("请确认", "是否真的要退出", function(
								button, text) {
							if (button == "yes") {
								Ext.Ajax.request({
									url : '/graduationPrj/logout.action',
									success : function() {
										var currUser = document
												.getElementById("CurrUser").value;
										var sessionid = document
												.getElementById('sessionid').value;
										PublicChatJS.reloadUsers(currUser,
												sessionid, "logout");
										DelCookie("refresh");
										window.location.href = '/graduationPrj/login.html';
									}
								});
							}
						});
					}

				}]
	});

	/**
	 * @method expandAll
	 * @private
	 * @description 展开所有节点
	 */
	var expandAll = function() {
		treePanel.root.expand(true, false);
	}

	/**
	 * @method updateUserList
	 * @private
	 * @description 定时更新在线用户列表，刷新时间为10分钟 注： 因为使用了长连接，不再使用轮询，故此方法作废
	 */
	/*
	 * var updateUserList = function() { treePanel.root.reload();
	 * treePanel.root.expand(true, false); setTimeout(updateUserList, 1000 * 60 *
	 * 10); }
	 */

	/**
	 * @method treeDoubleClick
	 * @private
	 * @description 添加‘双击事件’处理 当双击节点时，弹出聊天对话框
	 */
	var treeDoubleClick = function(node, e) {
		if (node.isLeaf()) {
			addOrOpenTab(node.id, node.text);
		}
		var currUser = document.getElementById("CurrUser").value;
		PrivateChatJS.getMessages(currUser, node.text);
		Ext.getCmp('im-tree').getSelectionModel().clearSelections();
	}
	treePanel.on('dblclick', treeDoubleClick);

	/**
	 * @method addOrOpenTab
	 * @private
	 * @description 判断tab有没有存在，如果不存在添加新tab
	 */
	var addOrOpenTab = function(nodeID, nodeText) {
		var n = tabs.getComponent(nodeText);
		if (!n) {
			n = tabs.add({
						id : nodeText,
						title : '和' + nodeText + '聊天中',
						layout : 'border',
						closable : true,
						items : [new Ext.Panel({
									region : 'center',
									title : '聊天记录  ',
									autoScroll : true,
									html : '<div id=' + nodeText + 'div></div>',
									/*
									 * tools : [{ id : 'refresh', qtip :
									 * '注意：如果长时间没有收到对方回应，试一下', // hidden:true,
									 * handler : function(event, toolEl, panel) { //
									 * refresh logic } }],
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
											this.setText(flag
													? '锁定滚动条'
													: '恢复自动滚动');
										}
									}]
								})]
					});
			var fn = function() {
				autoScollTop(nodeText + 'div');
				Ext.getCmp("htmleditor").focus(true, true);
			}

			n.on('activate', fn);
		}
		tabs.setActiveTab(n);
		Ext.getCmp("htmleditor").focus(true, true);
		// tabs.getItem('allChat').setTitle('公共聊天室','<span
		// style="color:red"></span>');
	}

	/**
	 * @method chatPanel
	 * @private
	 * @description 公用的输入文本框
	 */
	var chatPanel = new Ext.Panel({
				region : 'south',
				title : '文本框',
				layout : 'fit',
				// split:true,
				autoScroll : true,
				height : 250,
				// minSize: 200,
				// maxSize: 500,
				collapsible : true,
				margins : '0 0 0 0',
				items : {
					xtype : 'form',
					baseCls : 'x-plain',
					autoHeight : true,
					autoWidth : true,
					bodyStyle : 'padding:10 10px 0;',
					defaults : {
						anchor : '98%'
					},
					items : [{
								xtype : 'htmleditor',
								height : 150,
								id : 'htmleditor',
								hideLabel : true
							}]
				},
				bbar : ['->', {
							text : '发送请输入Ctrl-Enter',
							handler : function() {
								sendmsg();
							}
						}

						, '-', {
							text : '清除',
							handler : function() {
								Ext.getCmp("htmleditor").reset();
							}
						}]
			});
	/**
	 * @method logPanel，allChatPanel
	 * @private
	 * @description 公共聊天室tab
	 */
	var logPanel = new Ext.Panel({
				region : 'center',
				title : '聊天记录  ',
				id : 'history_panel',
				autoScroll : true,
				html : '<div id=publicChat></div>',
				/*
				 * tools : [{ id : 'refresh', qtip : '注意：如果长时间没有收到对方回应，试一下', //
				 * hidden:true, handler : function(event, toolEl, panel) { //
				 * refresh logic } }],
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
								Ext.getCmp("htmleditor").focus(true, true);
							}
						}]
			});

	var allChatPanel = new Ext.Panel({
				id : 'allChat',
				title : '公共聊天室',
				layout : 'border',
				items : [logPanel]
			});

	/**
	 * 构建标签面板，出现在主显示页面，用于显示信息
	 */
	var tabs = new Ext.TabPanel({
				region : 'center',
				deferredRender : false,
				id : 'tabs',
				resizeTabs : true,
				minTabWidth : 115,
				tabWidth : 135,
				height : 100,
				autoScroll : true,
				enableTabScroll : true,
				plugins : new Ext.ux.TabCloseMenu(),
				items : [allChatPanel]
			});

	tabs.setActiveTab(0);

	/**
	 * @method viewport
	 * @private
	 * @description 主界面，添加各个元素
	 */
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [treePanel, {
							region : 'center',
							layout : 'border',
							// autoScroll : true,
							items : [tabs, chatPanel]
						}

				]
			});

	/**
	 * @method delHtmlTag
	 * @private
	 * @description 去掉发送过来消息的html标签和 &nbsp；符号，用于验证输入的信息是否为空
	 */
	var delHtmlTag = function(str) {
		var s = str.replace(/<[^>]+>/g, '');
		return s.replace(/(^(\s|&nbsp;)*)|((\s|&nbsp;)*$)/g, "");
	}

	var focusToHtmlEditor = function() {
		Ext.getCmp("htmleditor").focus(true, true);
	}

	/**
	 * @method sendPublicMsg
	 * @private
	 * @description 发送公共信息
	 */

	var sendPublicMsg = function() {
		var content_value = Ext.getCmp("htmleditor").getValue();
		var str = delHtmlTag(content_value);

		var currUser = document.getElementById("CurrUser").value;
		if (str.trim() == '') {
			Ext.Msg.alert("消息提示", "您没有输入消息文本内容！", function() {
						Ext.getCmp("htmleditor").setValue('');
						focusToHtmlEditor();
					});
			return;
		}

		var receivers_values = [];
		var tree = Ext.getCmp('im-tree');
		var receivers = tree.getSelectionModel().getSelectedNodes();
		for (i = 0; i < receivers.length; ++i) {

			receivers_values.push(receivers[i].attributes.text);

		}
		if (receivers_values.length > 1) {
			Ext.Msg.alert("消息提示", '只能选择一个接收者！', function() {
						tree.focus();
					});
			return;
		}
		// alert(receivers[0].attributes.text);
		if (receivers.length == 0) {
			// Ext.getCmp("htmleditor").reset();
			Ext.getCmp("htmleditor").setValue('');
			Ext.getCmp("htmleditor").focus(true, true);
			PublicChatJS.addMessage(currUser, '', content_value);

		} else {
			// Ext.getCmp("htmleditor").reset();
			Ext.getCmp("htmleditor").setValue('');
			Ext.getCmp("htmleditor").focus(true, true);
			PublicChatJS.addMessage(currUser, receivers[0].attributes.text,
					content_value);
		}

		/*
		 * var pars = { "message":content_value, "toUserName":"" +
		 * receivers_values[0], "fromUserName":currUser };
		 */
	}

	/**
	 * 取得一个节点的所有子节点 包括本节点，用于判断打开的tab对应的用户是否下线
	 */
	var getAllChildrenNodes = function() {
		var children = [];
		for (var i = 0; i < root.childNodes.length; i++) {
			children[i] = root.childNodes[i].id;
		}
		return children;
	};

	/**
	 * @method sendPrivateMsg
	 * @private
	 * @description 发送私人信息
	 */

	var sendPrivateMsg = function() {
		var content_value = Ext.getCmp("htmleditor").getValue();

		var str = delHtmlTag(content_value);
		var tabid = tabs.getActiveTab().getId();
		var currUser = document.getElementById("CurrUser").value;
		var fromUserSessionid = document.getElementById("sessionid").value;
		var toUserSessionid = getSesssionIdByTabId(tabid);
		var tabTitle = tabs.getItem(tabid).title
		var s = tabTitle.indexOf("聊");
		var toUsername = tabTitle.substring(1, s);

		if (str.trim() == '') {
			Ext.Msg.alert("消息提示", "您没有输入消息文本内容！", function() {
						Ext.getCmp("htmleditor").setValue('');
						Ext.getCmp("htmleditor").focus(true, true);
					});
			return;
		}
		if (toUserSessionid != null) {
			// alert(toUsername);

			// alert('用户存在');
			Ext.getCmp("htmleditor").setValue('');
			Ext.getCmp("htmleditor").focus(true, true);
			PrivateChatJS
					.sendPrivateMessages(currUser, toUsername, content_value,
							fromUserSessionid, toUserSessionid, 'online');
		} else {
			// alert('用户不存在');
			Ext.MessageBox.confirm("请确认", "该用户已经下线，是否发送离线消息", function(button,
							text) {
						if (button == "yes") {
							Ext.getCmp("htmleditor").setValue('');
							Ext.getCmp("htmleditor").focus(true, true);
							PrivateChatJS.sendPrivateMessages(currUser,
									toUsername, content_value,
									fromUserSessionid, toUserSessionid,
									'outline');
						}
					});
		}
	}
	/**
	 * @method sendmsg
	 * @private
	 * @description 发送信息（通过当前活动的tab页自动获知是公共消息还是私人消息）
	 */
	var sendmsg = function() {
		var t = tabs.getActiveTab().getId();
		if (t == 'allChat') {
			sendPublicMsg();
		} else {
			sendPrivateMsg();
		}
	}
	/**
	 * @method
	 * @private
	 * @description 添加按键映射，按ctrl+回车时，发送消息
	 */
	new Ext.KeyMap(Ext.getCmp("htmleditor").getEl(), [{
						key : 13,
						ctrl : true,
						stopEvent : true,
						fn : sendmsg
					}]);

	Ext.getCmp("htmleditor").onEditorEvent = function(e) {
		this.updateToolbar();
		var keyCode = (document.layers) ? keyStroke.which : e.keyCode;
		if (keyCode == 13 && e.ctrlKey)
			sendmsg(); // it'a my handler
	}

	expandAll();
	Ext.getCmp("htmleditor").focus(true, true);

	allChatAutoScroll();

});