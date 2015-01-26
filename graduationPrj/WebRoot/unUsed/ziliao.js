grid.on('headerclick', function(grid, columnIndex, e) {
			grid.getColumnModel().setColumnHeader(columnIndex,
					'<span style="color:red">商品编号</span>');
		});

var timeoutProcess;// 设定变量用于控制停止闪烁的控件
// 在执行录像以后录像按钮会不停的闪烁（开始）
function FreshPointSet() {
	timeoutProcess = setTimeout("FreshPointSet()", 500);
	var ExtPoint = Ext.get(hello); // 得到需要闪烁的div或是按钮，图片等的di
	ExtPoint.fadeOut({
				duration : 0.05
			});
	ExtPoint.fadeIn({
				duration : 0.05
			});

}
// 在执行录像以后录像按钮会不停的闪烁（停止）
function FreshPointclear() {
	clearTimeout(timeoutProcess);
}



<title>屏蔽鼠标右键、Ctrl+n、shift+F10、F5刷新、退格键－中国站长站www.chinaz.com</title>
</head>
<body onkeydown="KeyDown()"
oncontextmenu="event.returnValue=false">

<script language="Javascript"><!--
// 屏蔽鼠标右键、Ctrl+n、shift+F10、F5刷新、退格键
// Author: meizz(梅花雨) 2002-6-18

function KeyDown(){ 
if ((window.event.altKey)&&
((window.event.keyCode==37)|| // 屏蔽 Alt+ 方向键 ←
(window.event.keyCode==39))){ // 屏蔽 Alt+ 方向键 →
alert("不准你使用ALT+方向键前进或后退网页！");
event.returnValue=false;
}

/*
 * 注：这还不是真正地屏蔽 Alt+ 方向键， 因为 Alt+ 方向键弹出警告框时，按住 Alt 键不放， 用鼠标点掉警告框，这种屏蔽方法就失效了。以后若
 * 有哪位高手有真正屏蔽 Alt 键的方法，请告知。
 */

if ((event.keyCode==8) || // 屏蔽退格删除键
(event.keyCode==116)|| // 屏蔽 F5 刷新键
(event.ctrlKey && event.keyCode==82)){ // Ctrl + R
event.keyCode=0;
event.returnValue=false;
}
if ((event.ctrlKey)&&(event.keyCode==78)) // 屏蔽 Ctrl+n
event.returnValue=false;
if ((event.shiftKey)&&(event.keyCode==121)) // 屏蔽 shift+F10
event.returnValue=false;
if (window.event.srcElement.tagName == "A" && window.event.shiftKey) 
window.event.returnValue = false; // 屏蔽 shift 加鼠标左键新开一网页
if ((window.event.altKey)&&(window.event.keyCode==115)){ // 屏蔽Alt+F4
window.showModelessDialog("about:blank","","dialogWidth:1px;dialogheight:1px");
return false;}
}
/*
 * 另外可以用 window.open 的方法屏蔽 IE 的所有菜单 第一种方法： window.open("你的.htm",
 * "","toolbar=no,location=no,directories=no,menubar=no,scrollbars=no,resizable=yes,status=no,top=0,left=0")
 * 第二种方法是打开一个全屏的页面： window.open("你的.asp", "", "fullscreen=yes")
 */
// --></script>
<h2 align=center>屏蔽鼠标右键、Ctrl+n、shift+F10、F5刷新、退格键</h2>
</body>
</html> 





javascript脚本收藏--屏蔽类,方便以后查找
一、屏蔽键盘所有键 
<script language="javascript">
<!--
function document.onkeydown()...{
event.keyCode = 0;
event.returnvalue = false;
}
-->
</script>
 
二、屏蔽鼠标右键
在body标签里加上oncontextmenu="return  false"　或者: 
 
<script language="javascript">
<!--
function document.oncontextmenu() 
...{ 
return false; 
} 
-->
</script>
function nocontextmenu()
...{ 
if(document.all) ...{
event.cancelBubble=true;
event.returnvalue=false; 
return false; 
}
}或者:
<body onmousedown="rclick()" oncontextmenu= "nocontextmenu()">
<script language="javascript">
<!--
function rclick()
...{
if(document.all) ...{
if (event.button == 2)...{
event.returnvalue=false;
}
}
}
-->
</script>
三、屏蔽 Ctrl+N、Shift+F10、F5刷新、退格键
 
<script language="javascript">
<!--
// 屏蔽鼠标右键、Ctrl+N、Shift+F10、F5刷新、退格键
function window.onhelp()...{return false} // 屏蔽F1帮助
function KeyDown()...{
if ((window.event.altKey)&&
((window.event.keyCode==37)|| // 屏蔽 Alt+ 方向键 ←
(window.event.keyCode==39)))...{ // 屏蔽 Alt+ 方向键 →
alert("不准你使用ALT+方向键前进或后退网页！");
event.returnvalue=false;
}注：这还不是真正地屏蔽 Alt+ 方向键，因为 Alt+ 方向键弹出警告框时，按住 Alt 键不放，用鼠标点掉警告框，这种屏蔽方法就失效了。
 
 
if ((event.keyCode == 8) && 
(event.srcElement.type != "text" && 
event.srcElement.type != "textarea" && 
event.srcElement.type != "password") || // 屏蔽退格删除键
(event.keyCode==116)|| // 屏蔽 F5 刷新键
(event.ctrlKey && event.keyCode==82))...{ // Ctrl + R
event.keyCode=0;
event.returnvalue=false;
}
if ((event.ctrlKey)&&(event.keyCode==78)) // 屏蔽 Ctrl+n
event.returnvalue=false;
if ((event.shiftKey)&&(event.keyCode==121)) // 屏蔽 shift+F10
event.returnvalue=false;
if (window.event.srcElement.tagName == "A" && window.event.shiftKey) 
window.event.returnvalue = false; // 屏蔽 shift 加鼠标左键新开一网页
if ((window.event.altKey)&&(window.event.keyCode==115))...{ // 屏蔽Alt+F4
window.showModelessDialog("about:blank","","dialogWidth:1px;dialogheight:1px");
return false;}
}另外可以用 window.open 的方法屏蔽 IE 的所有菜单
　　第一种方法：
 
window.open("你的.htm", "","toolbar=no,location=no,directories=no,menubar=no,scrollbars=no,resizable=yes,status=no,top=0,left=0")
　　第二种方法是打开一个全屏的页面：
window.open("你的.asp", "", "fullscreen=yes")
四、屏蔽浏览器右上角“最小化”“最大化”“关闭”键
 
<script language=javascript>
function window.onbeforeunload()
...{
if(event.clientX>document.body.clientWidth&&event.clientY<0||event.altKey)
...{
window.event.returnvalue = "";
}
}
</script>
　或者使用全屏打开页面
<script language="javascript">
<!--
window.open(www.32pic.com,"32pic","fullscreen=3,height=100, width=400, 
top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, 
status=no");
-->
</script>
　　注：在body标签里加上
onbeforeunload="javascript:return false"// 使不能关闭窗口
五、屏蔽F5键

<script language="javascript">
<!--
function document.onkeydown() 
...{ 
if ( event.keyCode==116) 
...{ 
event.keyCode = 0; 
event.cancelBubble = true; 
return false; 
}
}
-->
</script>
六、屏蔽IE后退按钮
　　在你链接的时候用
<a href="javascript:location.replace(url)">

七、屏蔽主窗口滚动条
　　在body标签里加上style="overflow-y:hidden"
八、屏蔽拷屏,不断地清空剪贴板
　　在body标签里加上

onload="setInterval('clipboardData.setData(\'Text\',\'\')',100)"
九、屏蔽IE6.0 图片上自动出现的保存图标
方法一：

<META HTTP-EQUIV="imagetoolbar" CONTENT="no">

　　方法二：

<img galleryimg="no">























function validerbrugernrReturn(event) {   
    
  
    
  
if (window.event && window.event.keyCode == 13) {   
   alert("11");   
        
           
        if(erhvervskunde == "E"){    
           alert("12");   
  
      var inputbrugernr = document.getElementById("brugernr");   
      alert("13");   
      if(inputbrugernr.value.length != 3) {   
     alert("Brugernummer forkert");   
     return !(window.event && window.event.keyCode == 13);    
       } else {    
        
     document.LoginPage.submit();   
     return true;   
   }   
        } else {   
          alert("3");   
          document.LoginPage.submit();   
          return true;   
        }   
    
       }   
}   


<script>   
 function handleKeyPress(evt) {   
  var nbr;   
  var nbr = (window.event)?event.keyCode:evt.which;   
  alert(nbr);   
  return true;   
  }   
 document.onkeydown= handleKeyPress   
</script> 
