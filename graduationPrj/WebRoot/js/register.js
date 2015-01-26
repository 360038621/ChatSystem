var User = new Ext.data.Record.create([{
			name : 'username',
			mapping : 'username',
			type : 'string'
		}, {
			name : 'password',
			mapping : 'password',
			type : 'string'
		}, {
			name : 'sex',
			mapping : 'sex',
			type : 'string'
		}, {
			name : 'email',
			mapping : 'email',
			type : 'string'
		}, {
			name : 'price',
			mapping : 'price',
			type : 'string'
		}, {
			name : 'realName',
			mapping : 'realName',
			type : 'string'
		}, {
			name : 'nickName',
			mapping : 'nickName',
			type : 'string'
		}, {
			name : 'age',
			mapping : 'age',
			type : 'int'
		}, {
			name : 'website',
			mapping : 'website',
			type : 'string'
		}, {
			name : 'phone',
			mapping : 'phone',
			type : 'string'
		}, {
			name : 'qq',
			mapping : 'qq',
			type : 'string'
		}, {
			name : 'description',
			mapping : 'description',
			type : 'string'
		},
// {name : 'uploadUrl',mapping : 'uploadUrl',type : 'string'}
]);

var win;

var rg = function() {
	var fieldWidth = 200;
	var username = new Ext.form.TextField({
				fieldLabel : "用户名",
				width : fieldWidth,
				vtype : "checkUserName",
				allowBlank : false,
				blankText : "用户名不能为空",
				id : "username",
				maxLength : 20,
				name : "ub.username"
			});
	var password = new Ext.form.TextField({
				fieldLabel : "密码",
				maxLength : 20,
				width : fieldWidth,
				inputType : "password",
				allowBlank : false,
				blankText : "密码不能为空",
				id : "password",
				name : "ub.password"
			});
	var rePassword = new Ext.form.TextField({
				fieldLabel : "重复密码",
				width : fieldWidth,
				inputType : "password",
				maxLength : 20,
				allowBlank : false,
				blankText : "重复密码不能为空",
				initialPassField : "password",
				vtype : "password",
				id : "rePassword",
				name : "ub.rePassword"
			});

	var sexdata = [];
	sexdata.push(['m', '男']);
	sexdata.push(['f', '女']);

	var ds = new Ext.data.SimpleStore({
				fields : ['sexId', 'sexName'],
				data : sexdata
			});
	var sex = new Ext.form.ComboBox({
		name : 'ub.sex',
		id : 'sex',
		fieldLabel : "性别",
		width : fieldWidth,
		hiddenName : 'ub.sexId',
		valueField : 'sexId',
		displayField : 'sexName',
		editable : false,
		selectOnFocus : true,
		mode : 'local',
		// mode : 'remote',
		store : ds,
		triggerAction : 'all',
		editable : false
			// listClass : 'x-combo-list-small',
			// lazyRender : true
		});

	var sexRender = function() {
		sex.un('render', sexRender);
		sex.setValue('m');
		sex.un('render', sexRender);
	};
	sex.on('render', sexRender);

	ds.loadData(sexdata);

	// console.log('a');
	var email = new Ext.form.TextField({
				fieldLabel : "邮箱",
				width : fieldWidth,
				allowBlank : false,
				blankText : "邮箱不能为空",
				vtype : "email",
				id : "email",
				maxLength : 50,
				name : "ub.email"
			});
	// --------------------advance info-----------------------
	var realName = new Ext.form.TextField({
				fieldLabel : "真实姓名",
				vtype : "chinese",
				width : fieldWidth,
				id : "realName",
				maxLength : 20,
				name : "ub.realName"
			});
	var nickName = new Ext.form.TextField({
				fieldLabel : "昵称",
				width : fieldWidth,
				id : "nickName",
				maxLength : 20,
				name : "ub.nickName"
			});
	var age = new Ext.form.TextField({
				fieldLabel : "年龄",
				vtype : "age",
				width : fieldWidth,
				id : "age",
				name : "ub.age"
			});
	var website = new Ext.form.TextField({
				fieldLabel : "个人主页",
				vtype : "url",
				width : fieldWidth,
				maxLength : 50,
				id : "website",
				name : "ub.website"
			});
	var born = new Ext.form.DateField({
				fieldLabel : "生日",
				width : fieldWidth,
				id : "born",
				name : "ub.born",
				format : "Y-m-d",
				selectOnFocus : true
			});
	var phone = new Ext.form.TextField({
				fieldLabel : "电话",
				width : fieldWidth,
				vtype : "phone",
				id : "phone",
				maxLength : 20,
				name : "ub.phone"
			});
	var qq = new Ext.form.TextField({
				fieldLabel : "QQ/MSN",
				width : fieldWidth,
				vtype : "integer",
				id : "qq",
				maxLength : 20,
				name : "ub.qq"
			});
	var description = new Ext.form.TextArea({
				fieldLabel : "个人描述",
				width : fieldWidth,
				height : 58,
				maxLength : 200,
				id : "description",
				name : "ub.description"
			});

	/*
	 * var upload = new Ext.form.FileUploadField({ fieldLabel : "照片", width :
	 * 100, buttonOnly : false, id : "upload", name : "ub.upload", vtype :
	 * "photo", width : fieldWidth });
	 */

	var tab = new Ext.TabPanel({
				buttonAlign : "right",
				border : false,
				autoScroll : false,
				activeTab : 0,
				defaults : {
					autoHeight : true,
					bodyStyle : "padding:10px"
				},
				items : [{
					title : "基本信息",
					items : [username, nickName, sex, password, rePassword,
							email],
					layout : "form"
				}, {
					title : "高级信息",
					items : [realName, age, born, website, phone, qq,
							description],
					layout : "form"
				}]
			});
	var registerForm = new Ext.form.FormPanel({
				collapsible : true,
				// fileUpload : true,
				// renderTo : "registerBox",
				id : "registerForm",
				labelWidth : 85,
				items : tab,
				width : 500,
				authoHeight : true
			});
	var RegSubmit = function() {
		registerForm.form.submit({
			waitTitle : '请稍候',
			waitMsg : '正在注册.......',
			url : '/graduationPrj/register.action',
			method : 'POST',
			success : function(form, action) {
				// 将服务器端返回的字符川转换成对象
				var result = Ext.util.JSON.decode(action.response.responseText);
				// var result = action.response.responseXML
				// .getElementsByTagName("result")[0].firstChild.data;

				if (result.success && result.msg == 'notExist') {
					Ext.MessageBox.alert('信息提示', "注册成功！", function() {
						win.close();
						Ext.getCmp('loginwin').close();
						document.getElementById('center-zone').style.display = 'none';
						waitMsg : '载入登录页面.......', window.location.href = '/graduationPrj/login.html';
					});
				} else {

					Ext.MessageBox.alert('信息提示', "该用户名已被注册！请重新填写！", function() {
								form.findField("ub.username").setRawValue('');
								form.findField("ub.username").focus(true, true);

							});
				}

			},
			failure : function(form, action) {
				Ext.MessageBox.alert('信息提示', "注册失败！请重新注册！", function() {
					win.close();
					Ext.getCmp('loginwin').close();
					document.getElementById('center-zone').style.display = 'none';
					window.location.href = '/graduationPrj/login.html';
				});
				// this.findByType('textfield')[1].focus(true, true);
			},
			scope : this
		});
	}

	var win = new Ext.Window({
				layout : 'fit',
				plain : true,
				title : "新用户注册",
				iconCls : "user-info",
				width : 400,
				height : 350,
				closeAction : 'hide',
				modal : true,
				id : 'registerWin',
				renderTo : 'registerWinDiv',
				autoScroll : false,
				collapsible : false,
				draggable : true,
				closable : false,
				items : registerForm,
				/*
				 * listeners : { 'show' : function() {
				 * this.findByType('textfield')[0].focus(true, true); //
				 * 第一个textfield获得焦点 } },
				 */
				buttons : [{
							text : "确定",
							handler : function() {
								if (registerForm.getForm().isValid()) {
									RegSubmit();
								}
							}
						}, {
							text : '取消',
							handler : function() {
								registerForm.getForm().reset();
								win.hide();
							}
						}]
			}

	);
	var fn = function() {
		var w = Ext.getCmp('loginwin');
		w.findByType('textfield')[0].focus(true, true);
	}

	win.on('hide', fn);

	return win;
}
function initRg() {
	if (!win) {
		win = rg();
	}
	win.show();
}
