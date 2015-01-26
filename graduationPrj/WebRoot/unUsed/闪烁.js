var flag = false;
Ext.onReady(function() {
	var tabs = new Ext.TabPanel({
				renderTo : Ext.getBody(),
				activeTab : 0,
				items : [{
							id : 't',
							title : '<font color="red">Tab 1</font>',
							html : 'A simple tab'
						}, {
							title : 'Tab 2',
							html : 'Another one'
						}]
			});
	var t = Ext.getCmp('t');

	t.on('activate', function() {

			});
	var task = {
		run : function() {
			if (flag) {
				tabs.items.itemAt(0).setTitle('<font color="red">Tab 1</font>');
				flag = false;
			} else {
				tabs.items.itemAt(0)
						.setTitle('<font color="blue">Tab 1</font>');
				flag = true;
			}
		},
		interval : 100
	}
	var runner = new Ext.util.TaskRunner();
	runner.start(task);
});