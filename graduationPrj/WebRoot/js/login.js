function reload() {
	window.location.reload();
}
Ext.onReady(function() {
	// 将表单的提示信息放在边上
	Ext.QuickTips.init();
	Ext.BLANK_IMAGE_URL = 'ext/s.gif';
	Ext.form.Field.prototype.msgTarget = 'side';
	Ext.QuickTips.init();

	var loginForm = new Ext.FormPanel({
				title : '用户登陆',
				contentEl : 'loginInfo',
				id : 'loginForm',
				layout : 'form',
				defaults : {
					width : 230
				},
				defaultType : 'textfield',
				items : [{
							fieldLabel : '用户名',
							name : 'user.username',
							style : 'font-size: 15px',
							blankText : '用户名不能为空',
							allowBlank : false
						}, {
							fieldLabel : '密   码',
							name : 'user.password',
							style : 'font-size: 15px',
							inputType : 'password',
							blankText : '密码不能为空',
							allowBlank : false
						}]

			});

	var loginTab = new Ext.Panel({
		el : 'hello-tabs',
		name : 'loginTab',
		autoTabs : true,
		activeTab : 0,
		deferredRender : false,
		border : false,

		items : [{
			xtype : 'tabpanel',
			activeTab : 0,
			defaults : {
				autoHeight : true,
				bodyStyle : 'padding:10px'
			},
			items : [loginForm, {
				title : '关于本系统',
				layout : '',
				html : '畅聊在线实时聊天系统 v 1.0<br> 版权所有 云健飞  &copy; 2009 <br/>邮箱: 233602551@qq.com',
				defaults : {
					width : 230
				}

			}]
		}]
	});

	var loginSubmit = function() {
		var username = loginForm.form.findField("user.username").getValue();
		var password = loginForm.form.findField("user.password").getValue();

		if ((password == null || password == '')
				&& (username == null || username == '')) {
			loginForm.form.findField("user.username").markInvalid("用户名不能为空!");
			loginForm.form.findField("user.password").markInvalid("密码不能为空!");
			// Ext.MessageBox.alert('信息提示', "请填写用户名和密码！");
			loginForm.form.findField("user.username").focus(true, true);
			return;
		} else if ((password != null || password != '')
				&& (username == null || username == '')) {

			loginForm.form.findField("user.username").markInvalid("用户名不能为空!");
			// Ext.MessageBox.alert('信息提示', "请正确填写用户名和密码！");
			loginForm.form.findField("user.username").focus(true, true);
			return;
		} else if ((password == null || password == '')
				&& (username != null || username != '')) {

			loginForm.form.findField("user.password").markInvalid("密码不能为空!");
			// Ext.MessageBox.alert('信息提示', "请正确填写用户名和密码！");
			loginForm.form.findField("user.password").focus(true, true);
			return;
		};

		var confirm = function() {
			Ext.MessageBox.confirm("消息提示", "该用户已经登录！是否重新登陆？", function(button,
							text) {
						if (button == "yes") {
							PublicChatJS.logoutUser(username);
							submit();
						}
					});
		}

		var submit = function() {
			loginForm.form.submit({
				waitTitle : '请稍候',
				waitMsg : '正在登录.......',
				url : '/graduationPrj/login.action',
				method : 'POST',
				params : {
					username : username,
					password : password
				},
				success : function(form, action) {
					Ext.getCmp("loginwin").close();
					document.getElementById('center-zone').style.display = 'none';
					window.location.href = '/graduationPrj/chat.jsp';
					waitMsg : '正在登录.......'
				},
				failure : function(form, action) {
					Ext.MessageBox.alert('信息提示', "用户名或密码不正确，请重新输入！",
							function() {
								form.findField("user.password").setRawValue('');
								form.findField("user.password").focus(true, true);
							}
					);
					// this.findByType('textfield')[1].focus(true, true);
				},
				scope : this
			});
		}
		loginForm.form.submit({
					url : '/graduationPrj/checkLogin.action',
					method : 'POST',
					params : {
						username : username
					},
					success : function(form, action) {
						confirm();
					},
					failure : function(form, action) {
						submit();
					},
					scope : this
				});
		/*
		 * Ext.Ajax.request({ url : '/graduationPrj/checkLogin.action', method :
		 * 'POST', params : { username : username },
		 * 
		 * callback : function(success) { if (success == false) { submit(); }
		 * else { confirm(); } }
		 * 
		 * 
		 * success : function(e, b) { alert('11') //confirm(); }, failure :
		 * function(e, b) { submit(); }
		 * 
		 * });
		 */
	}

	var win = new Ext.Window({
				el : 'hello-win',
				layout : 'fit',
				width : 490,
				height : 280,
				closeAction : 'hide',
				plain : true,
				modal : true,
				id : 'loginwin',
				collapsible : true,
				draggable : true,
				closable : false,
				items : loginTab,
				listeners : {
					'show' : function() {
						this.findByType('textfield')[0].focus(true, true); // 第一个textfield获得焦点
					}
				},
				buttons : [{
							text : '确定',
							handler : function() {
								loginSubmit();
							}
						}, {
							text : '关闭',
							handler : function() {
								win.hide();
							}
						}]
			}

	);

	new Ext.KeyMap(Ext.get('hello-win'), [{
						key : 13,
						fn : loginSubmit
					}]);

	// Ext.get('center-zone')
	win.show();
});

function clearCookie() {
	DelCookie("refresh");
}
