function startChat(chatSendUname,chatGetUid,chatGetName,chatGetImg){

	var temp = Ext.getCmp('msgwin'+chatGetName);
	if( temp != null){
		return;
	}
	
	var chatWin = new Ext.Window({
	    width : 590,
	    height:500,
	    minWidth:400,
	    minHeight:400,
	  	autoDestroy:true,
	  	border:false,
	    plain : true,
	    resizable : true,//可否改变大小
	    closeAction:'close',
	    animCollapse:true,
	    hideCollapseTool:true,
	    title:'与 '+chatGetName+' 聊天中...',
	    id:'msgwin'+chatGetName,
	    frame:true,
	    maximizable:true,
	    layout : 'fit',//布局方式
	    items : [{
        	layout:'border',
 					items:[{
 						width:150,
		          		layout:'border',
		          		region:'east',
		          		split:false,
		          		items:[{
		          			region:'north',
			       			split:false,
			       			id:'getuser'+chatGetUid,
			       			width:150,
			       			height:250,
			       			html:'<img width=150 height=150 src="images/head/h01.png" />'
		          		},{
			       			region:'center',
			       			split:false,
			       			id:'senduser'+chatGetUid,
			       			width:150,
			       			html:'<img width=150 height=150 src="images/head/h02.png" />'
			       		}]
 					},{
 						id: 'msg-panel'+chatGetUid,
						labelAlign: 'top',
						region:'center',
					    bodyStyle:'padding:5px 5px 0',
					    width: 400,
					    height:200,
					    defaults:{width:400,height:200},
					    minWidth:300,
	    				minHeight:300,
					    layout:'border',
					    items:[{
					    	id:'msgpanel'+chatGetUid,
							region: 'center',
						    bodyStyle:'padding:5px 5px 0',
						    autoScroll:true
					    },{
					    	xtype:'form',
					    	id:'chatform'+chatGetUid,
							region: 'south',
						    bodyStyle:'padding:5px 5px 0',
						    width: 400,
						    autoHeight:true,
					   		split:true,
						    defaults: {width: 400,height:150},
						    items: [{
						    	xtype:'hidden',
						    	id:'chatuid2'+chatGetUid,
								name:'chatuid2'
						    },{
						    	xtype:'htmleditor',
						    	anchor:'100%',
						    	id:'scontent'+chatGetUid,
								name:'scontent',
							    enableAlignments:false,
							    enableSourceEdit:false,
							    enableLists:false,
							    enableLinks:false,
							    hideLabel:true
						    }],
						    tbar:[{
								text:'聊天记录',
								tooltip:'查看聊天记录',
								iconCls:'tviewhistory',
								handler:function(){
									viewMsgHistory(chatSendUname,chatGetUid,chatGetName);
								}
							},'-',{
								text:'清屏',
								tooltip:'清空屏幕',
								iconCls:'tdelhistory',
								handler:function(){
									messagePanel.body.dom.innerHTML = '';
								}
							}],
						    keys:[{
						        key: Ext.EventObject.ENTER,
						        ctrl:true,
						        fn: onSend
						    }]
					    }]
			}]
        }],
	    buttons: [{
          	text:'发送',
          	type:'submit',
      		handler:onSend
          },{
          	text:'关闭',
          	type:'button',
      		handler:function(){
              	chatWin.close();
      		}
	   }],
	   tbar:[{
				//text:'视频',
				tooltip:'视频聊天',
				iconCls:'tvideo'
			},'-',{
				//text:'语音',
				tooltip:'语音聊天',
				iconCls:'tvoice'
			}],
	   tools:[{
		    id:'minimize',
		    qtip: '最小化',
		    handler: function(event, toolEl, panel){
		    	chatWin.toggleCollapse();
		    }
		}],
		keys:[{
			key:Ext.EventObject.ESC,
	    	fn:function(){
				chatWin.close();  	
	    	}
		}]
	});
	
	Ext.getCmp('chatform'+chatGetUid).findById('scontent'+chatGetUid).buttonTips = {
	    bold : {
	        title: '粗体(Ctrl+B)',
	        text: '字体加粗.',
	        cls: 'x-html-editor-tip'
	    },
	    italic : {
	        title: '粗体(Ctrl+I)',
	        text: '字体倾斜.',
	        cls: 'x-html-editor-tip'
	    },
	    underline : {
	        title: '下划线(Ctrl+U)',
	        text: '字体下划线.',
	        cls: 'x-html-editor-tip'
	    },
	    increasefontsize : {
	        title: '增大字号',
	        text: '字体增大.',
	        cls: 'x-html-editor-tip'
	    },
	    decreasefontsize : {
	        title: '减小字号',
	        text: '字体减小.',
	        cls: 'x-html-editor-tip'
	    },
	    forecolor : {
	        title: '字体颜色',
	        text: '改变字体颜色.',
	        cls: 'x-html-editor-tip'
	    },
	    backcolor : {
	        title: '背景颜色',
	        text: '改变字体背景颜色.',
	        cls: 'x-html-editor-tip'
	    }
	};
	
    chatWin.on('show',function(){
        cstore.load({params:{chatuid2:chatGetUid,action:"to"}});
        Ext.TaskMgr.start.defer(5000,this,[chatFresh]);
    });
	
    chatWin.on('close',function(){
        Ext.TaskMgr.stop(chatFresh);
    });
	
	chatWin.on('render',function(){
	    Ext.getCmp('chatform'+chatGetUid).findById('scontent'+chatGetUid).focus();
	}, this, {delay: 200});
	
    //自动刷新聊天面板
    var chatFresh = {
        run: function(){
            cstore.reload();
        },
        interval: 5000,
        scope: this
    }
	
    cstore.on('load',onCstoreLoad);
	
    function onCstoreLoad(cstore,r){
        for(var i=0;i<r.length;i++){
            ctpl.append(Ext.getCmp('msgpanel'+chatGetUid).body,r[i].data);
        }
        Ext.getCmp('msgpanel'+chatGetUid).body.scroll("bottom",9999);//滚屏
    }
	
		
	function onSend(){
		if(Ext.getCmp('chatform'+chatGetUid).findById('scontent'+chatGetUid).getValue() == ''){
			var errNow = new Date().format("Y-m-d H:i:s");
			var errMsg = "<div class='chat-view-title'><img src='images/tip_msg.gif' />  "+errNow+":</div><div class='chat-view'>不能发送空内容。</div>";
			Ext.getCmp('msgpanel'+chatGetUid).body.insertHtml("beforeEnd",errMsg);
			Ext.getCmp('msgpanel'+chatGetUid).body.scroll("bottom",9999);
       	    return;
		}
		if(Ext.getCmp('chatform'+chatGetUid).findById('scontent'+chatGetUid).getValue().length >200){
			var errNow = new Date().format("Y-m-d H:i:s");
			var errMsg = "<div class='chat-view-title'><img src='images/tip_msg.gif' />  "+errNow+":</div><div class='chat-view'>您发送的内容过多。</div>";
			Ext.getCmp('msgpanel'+chatGetUid).body.insertHtml("beforeEnd",errMsg);
			Ext.getCmp('msgpanel'+chatGetUid).body.scroll("bottom",9999);
       	    return;
		}
	    Ext.getCmp('chatform'+chatGetUid).getForm().submit({
	        url:'../send',
	        method:'post',
	        success:function(){
	        	var now = new Date().format("Y-m-d H:i:s");
		        var sc = ({u1name:chatSendUname,content:Ext.getCmp('chatform'+chatGetUid).findById('scontent'+chatGetUid).getValue(),sendtime:now});
		        ctpl.append(Ext.getCmp('msgpanel'+chatGetUid).body,sc);
		        Ext.getCmp('msgpanel'+chatGetUid).body.scroll("bottom",9999);
       	        Ext.getCmp('scontent'+chatGetUid).setValue('');
	    	},
			failure:function(){
		  		Ext.MessageBox.alert('出错','发送出错');
			}
		});
	}

	Ext.getCmp('chatform'+chatGetUid).findById('chatuid2'+chatGetUid).setValue(chatGetUid);
    
    chatWin.show();
}