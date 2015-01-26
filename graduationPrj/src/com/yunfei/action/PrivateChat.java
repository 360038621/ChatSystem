package com.yunfei.action;

import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.directwebremoting.ScriptBuffer;
import org.directwebremoting.ScriptSession;
import org.directwebremoting.ServerContextFactory;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.proxy.dwr.Util;

import com.yunfei.core.BaseAction;
import com.yunfei.pojo.Message;
import com.yunfei.pojo.PublicChatLog;
import com.yunfei.pojo.ScriptSessionMap;
import com.yunfei.pojo.User;
import com.yunfei.pojo.UserList;
import com.yunfei.service.UserService;

public class PrivateChat {

	private UserService userService;

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	/**
	 * 根据sessionid获得指定用户的页面脚本session
	 * 
	 * @param sessionid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public ScriptSession getScriptSessionByID(String sessionid) {
		ScriptSessionMap ssm = ScriptSessionMap.getInstance();
		return ssm.getMap().get(sessionid);
	}
	/**
	 * 发送私人聊天消息
	 * 
	 * @return
	 */
	public synchronized String sendPrivateMessages(String fromUserName, String toUserName,
			String message, String fromUserSessionid, String toUserSessionid,
			String onlineFlag, HttpServletRequest request) {

		// System.out.println("----------------------------sendPrivateMessages");
		LinkedList<Message> privateMsg = null;
		Date d = new Date();
		// SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
		String time = sdf.format(d);

		Message m = new Message();
		m.setFromUserName(fromUserName);
		m.setToUserName(toUserName);
		m.setMessage(message);
		m.setSendDate(time);

		// System.out.println(message);

		HttpSession session = request.getSession();

		// System.out.println(session.getId());
		// System.out.println("fromUserName=======" + fromUserName
		// + "toUserName=======" + toUserName);
		privateMsg = (LinkedList<Message>) session.getAttribute(fromUserName
				+ "ChatWith" + toUserName);
		if (privateMsg == null) {
			privateMsg = new LinkedList<Message>();
		}
		privateMsg.addFirst(m);
		while (privateMsg.size() > 50) {
			privateMsg.removeLast();
		}

		session
				.setAttribute(fromUserName + "ChatWith" + toUserName,
						privateMsg);

		ScriptSession fromUserScriptSession = this
				.getScriptSessionByID(fromUserSessionid);

		ScriptBuffer script = new ScriptBuffer();
		script.appendScript("receivePrivateMessages(").appendData(fromUserName)
				.appendScript(",").appendData(toUserName).appendScript(",")
				.appendData(fromUserSessionid).appendScript(",").appendData(
						privateMsg).appendScript(");");
		if (onlineFlag.equals("online")) {
			ScriptSession toUserScriptSession = this
					.getScriptSessionByID(toUserSessionid);
			toUserScriptSession.addScript(script);
		}
		fromUserScriptSession.addScript(script);

		return null;
	}
	/**
	 * 接收私人聊天消息（用于记录双方的聊天记录）这里是用session存储私人聊天信息的
	 * 
	 * @return
	 */
	public String getPrivateMessages(String fromUserName, String toUserName,
			LinkedList<Message> msgs, HttpServletRequest request) {
		LinkedList<Message> privateMsg = null;
		HttpSession session = request.getSession();
		privateMsg = (LinkedList<Message>) session.getAttribute(toUserName
				+ "ChatWith" + fromUserName);

		if (privateMsg == null) {
			privateMsg = msgs;
		} else {
			privateMsg = msgs;
		}
		session
				.setAttribute(toUserName + "ChatWith" + fromUserName,
						privateMsg);
		return null;
	}
	
	/**
	 * 双击用户节点，打开tab时，自动加载和该节点用户的聊天信息
	 * 
	 * @return
	 */
	public void getMessages(String fromUserName, String toUserName,
			HttpServletRequest request) {

		LinkedList<Message> privateMsg = null;
		HttpSession session = request.getSession();
		privateMsg = (LinkedList<Message>) session.getAttribute(fromUserName
				+ "ChatWith" + toUserName);
		if (privateMsg == null) {

		} else {
			WebContext wctx = WebContextFactory.get();
			ScriptBuffer script = new ScriptBuffer();
			script.appendScript("dbclickOpenTabGetMessages(").appendData(
					toUserName).appendScript(",").appendData(privateMsg)
					.appendScript(");");
			ScriptSession thisSession = wctx.getScriptSession();
			thisSession.addScript(script);
		}
	}
	/**
	 * 从单例List中通过用户的sessionid取出对用的姓名
	 * 
	 * @return
	 */
	public String getUserNameFromSessionId(String sessionid) {
		UserList userList = UserList.getInstance();
		List list = userList.getList();
		String username = null;
		for (int i = 0; i < list.size(); i++) {
			User u = (User) list.get(i);
			if (u.getSessionid().equals(sessionid)) {
				username = u.getUsername();
				break;
			}
		}
		return username;
	}

}
