<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title>聊天窗口</title>

		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="this is my page">
		<link rel="stylesheet" type="text/css"
			href="ext/resources/css/ext-all.css" />
		<script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="ext/ext-all.js"></script>
		<script type="text/javascript" src="ext/ext-lang-zh_CN.js"></script>
		<script type="text/javascript" src="ext/examples.js"></script>
		<script type="text/javascript" src="ext/TabCloseMenu.js"></script>
		<script type='text/javascript' src='/graduationPrj/dwr/engine.js'></script>
		<script type='text/javascript' src='/graduationPrj/dwr/util.js'></script>
		<script type='text/javascript'
			src='/graduationPrj/dwr/interface/PublicChatJS.js'></script>
		<script type='text/javascript'
			src='/graduationPrj/dwr/interface/PrivateChatJS.js'></script>
		<script type='text/javascript'
			src='/graduationPrj/dwr/interface/UpdateUserTaskJS.js'></script>

		<script type="text/javascript" src="js/chatMain.js"></script>

		<script type="text/javascript" src="js/util.js"></script>

		<script type="text/javascript" src="js/cookie.js"></script>

		<!--
.x-tab-strip SPAN.x-tab-strip-text {
	background: url(images/loading32.gif) left top no-repeat;
	font-size: 12px;
}
-->
		<style type="text/css">
html,body {
	font: normal 12px verdana;
	margin: 0;
	padding: 0;
	border: 0 none;
	overflow: hidden;
	height: 100%;
}

p {
	margin: 5px;
}

#msg-div {
	position: absolute;
	left: 35%;
	top: 10px;
	width: 250px;
	z-index: 20000;
}
</style>
	</head>

	<body onunload="unloadDestorySession()" onload="init()">
		<input type="hidden" id="CurrUser" value=${UserSession.username }>
		<input type="hidden" id="sessionid" value=${UserSession.sessionid }>
	</body>
</html>

