package com.yunfei.action;

import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
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

import com.yunfei.pojo.Message;
import com.yunfei.pojo.PublicChatLog;
import com.yunfei.pojo.ScriptSessionMap;
import com.yunfei.pojo.User;
import com.yunfei.pojo.UserList;
import com.yunfei.pojo.UserListForUserTask;


public class PublicChat {
	
	/**
	 * 公共聊天功能，用于发送公共聊天消息
	 * 
	 * @return
	 */
	public synchronized String addMessage(String fromUserName, String toUserName,
			String message) {

		PublicChatLog messages = PublicChatLog.getInstance();
		// Make sure we have a list of the list 10 messages
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
		messages.addMsg(m);

		LinkedList<Message> l = messages.getList();

		WebContext wctx = WebContextFactory.get();
		String currentPage = wctx.getCurrentPage();
		ScriptBuffer script = new ScriptBuffer();
		script.appendScript("receivePublicMessages(").appendData(l)
				.appendScript(");");

		// Loop over all the users on the current page
		Collection pages = wctx.getScriptSessionsByPage(currentPage);
		for (Iterator it = pages.iterator(); it.hasNext();) {
			ScriptSession otherSession = (ScriptSession) it.next();
			System.out.println(otherSession.getId());
			otherSession.addScript(script);
		}

		return null;
	}
	/**
	 * 用户登陆时，自动加载已有公共聊天信息
	 * 
	 * @return
	 */
	public void getMessages() {

		PublicChatLog messages = PublicChatLog.getInstance();

		LinkedList<Message> l = messages.getList();

		WebContext wctx = WebContextFactory.get();
		ScriptBuffer script = new ScriptBuffer();
		script.appendScript("receivePublicMessages(").appendData(l)
				.appendScript(");");

		ScriptSession thisSession = wctx.getScriptSession();
		thisSession.addScript(script);
	}
	/**
	 * 用户登陆，退出时，向其他客户端推入此方法，更新用户列表
	 * 
	 * @return
	 */
	public void reloadUsers(String username, String sessionid,
			String onlineFlag, HttpServletRequest request) {
		System.out.println("执行了reloadUsers");
		WebContext wctx = WebContextFactory.get();
		String currentPage = wctx.getCurrentPage();
		ScriptBuffer script = new ScriptBuffer();
		// System.out.println("reloadUsers currentPage:" + currentPage);
		this.updateScriptSessionMap(sessionid, onlineFlag, request);
		if (onlineFlag.equals("login")) {
			// this.setScriptSessionFlag(sessionid);
			script.appendScript("reloadUsers(").appendData(username)
					.appendScript(",").appendData(sessionid).appendScript(",")
					.appendData("上线了！").appendScript(");");
		} else {
			// System.out.println("zhixing logout");
			script.appendScript("reloadUsers(").appendData(username)
					.appendScript(",").appendData(sessionid).appendScript(",")
					.appendData("下线了！").appendScript(");");
		}
		// Loop over all the users on the current page
		Collection pages = wctx.getScriptSessionsByPage(currentPage);
		for (Iterator it = pages.iterator(); it.hasNext();) {
			ScriptSession otherSession = (ScriptSession) it.next();
			otherSession.addScript(script);
		}
	}

	/**
	 * 将session和页面脚本session绑定
	 * 
	 * @param sessionid
	 */
	public void setScriptSessionFlag(String sessionid) {
		WebContextFactory.get().getScriptSession().setAttribute("sessionid",
				sessionid);
	}

	/**
	 * 更新用户页面脚本session，主要用于用户刷新页面时，记录HttpSession对应的ScriptSession
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public void updateScriptSessionMap(String sessionid, String onlineFlag,
			HttpServletRequest request) {
		ScriptSessionMap ssm = ScriptSessionMap.getInstance();
		Map m = ssm.getMap();

		HttpSession session = request.getSession();

		if (onlineFlag.equals("login")) {
			String thisSessionID = session.getId();

			WebContext wctx = WebContextFactory.get();
			ScriptSession thisSession = wctx.getScriptSession();

			if (sessionid != null && thisSessionID.equals(sessionid)) {
				ScriptSession ss = (ScriptSession) m.get(sessionid);
				if (ss != null) {
					ssm.delScriptSession(sessionid);
					ssm.addScriptSession(sessionid, thisSession);
				} else {
					ssm.addScriptSession(sessionid, thisSession);
				}
			}
		} else {
			ssm.delScriptSession(sessionid);
		}
		// System.out.println(m.size());
	}
	
	
	/**
	 * 强制一个用户下线，主要用于用户重复登陆的处理，同时只允许一个用户在线
	 * 
	 * @return
	 */
	public void logoutUser(String username, HttpServletRequest request) {
		UserList userList = UserList.getInstance();
		List list = userList.getList();
		String sessionid = null;
		for (int i = 0; i < list.size(); i++) {
			User u = (User) list.get(i);
			if (u.getUsername().equals(username)) {
				sessionid = u.getSessionid();
				break;
			}
		}
		ScriptSession scriptSession = this
				.getScriptSessionByID(sessionid);

		ScriptBuffer script = new ScriptBuffer();
		script.appendScript("logoutCurrUser(").appendScript(");");
		scriptSession.addScript(script);

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
	 * 服务器定时给客户端发送命令，要求其调用此方法，以便把已经关闭浏览器的客户强制下线
	 * 
	 * @param sessionid
	 * @return
	 */
	public static synchronized void receiveClientMsg(String username,String sessionid, HttpServletRequest request) {
		UserListForUserTask utlistInstance = UserListForUserTask.getInstance();			
		utlistInstance.removeUser(getUserBySessionID(sessionid));
		System.out.println("删掉临时userList中的：" + username);
		System.out.println(utlistInstance.getList().size());
	}
	
	/**
	 * 通过sessionid来获取对应的User实体
	 * 
	 * @param sessionid
	 * @return
	 */
	
	public static User getUserBySessionID(String sessionid){
		UserList userList = UserList.getInstance();
		List list = userList.getList();
		User user = null;
		for (int i = 0; i < list.size(); i++) {
			User u = (User) list.get(i);
			if (u.getSessionid().equals(sessionid)) {
				user = u;
				break;
			}
		}
		return user;
	}
}
