package com.yunfei.action;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimerTask;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.directwebremoting.ScriptBuffer;
import org.directwebremoting.ScriptSession;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;

import com.yunfei.pojo.ScriptSessionMap;
import com.yunfei.pojo.User;
import com.yunfei.pojo.UserList;
import com.yunfei.pojo.UserListForUserTask;

public class UpdateUserTask extends TimerTask {
	private static Log log = LogFactory.getLog(UpdateUserTask.class);
	private static boolean isRunning = false;
	
	/**
	 * 定时任务，设计思想为：用一个临时的list存放在线用UserList中的所有用户，然后给这个list中所有用户的浏览器发送一个命令
	 *    要求其删除临时list中存放的自己的User实体，这样，如果有的用户关闭了浏览器，就没法删除临时list中的自己的User实体
	 *    每次执行定时任务的时候，先把临时list中的User强制移除，更新在线用户列表。
	 * @param sessionid
	 * @return
	 */
	public void run() {
		if (!isRunning) {
			isRunning = true;
			log.debug("开始执行任务..."); // 开始任务

			ScriptSessionMap ssm = ScriptSessionMap.getInstance();

			UserListForUserTask utlistInstance = UserListForUserTask
					.getInstance();
			List utList = utlistInstance.getList();

			UserList userList = UserList.getInstance();
			System.out.println("现有用户数："+userList.getList().size());
			System.out.println("要强制下线的用户个数：" + utlistInstance.getList().size());
			//强制把没有发送消息客户端的用户下线。
			for (int i = 0; i < utList.size(); i++) {
				User u = (User) utList.get(i);
				String sessionid = u.getSessionid();
				System.out.println("下线的用户:" + sessionid);
				
				//更新在线用户列表，ScriptSessionMap
				userList.removeUser(u);
				ssm.delScriptSession(sessionid);
				utlistInstance.removeUser(u);
				
				//向所有用户发送下线消息
				ScriptBuffer script = new ScriptBuffer();
				script.appendScript("reloadUsers(").appendData(u.getUsername())
						.appendScript(",").appendData(sessionid).appendScript(
								",").appendData("下线了！").appendScript(");");
				// Loop over all the users on the current page
				Map m = ssm.getMap();
				Iterator itrator = m.entrySet().iterator();
				while (itrator.hasNext()) {
					Map.Entry entry = (Map.Entry) itrator.next();
					ScriptSession ss = (ScriptSession) entry.getValue();
					ss.addScript(script);
				}
			}
			
			//给临时存放用户的list初始化，即把在线用户列表里的数据复制到UserListForUserTask的list里面
			List list = userList.getList();
			for (int i = 0; i < list.size(); i++) {
				User u = (User) list.get(i);
				utlistInstance.addUser(u);
			}
			//System.out.println("给检查用的用户列表初始化："
					//+ utlistInstance.getList().size());
			
			//给userlist中的所有用户定时发送命令，要求其执行脚本中的函数checkUserOnline（）
			Map m = ssm.getMap();
			Iterator itrator = m.entrySet().iterator();
			while (itrator.hasNext()) {
				Map.Entry entry = (Map.Entry) itrator.next();

				ScriptSession ss = (ScriptSession) entry.getValue();
				//System.out.println(ss.getId());

				ScriptBuffer script = new ScriptBuffer();
				script.appendScript("checkUserOnline(").appendScript(");");
				ss.addScript(script);
			}

			log.debug("执行任务完成..."); // 任务完成
			isRunning = false;
		} else {
			log.debug("上一次任务执行还未结束..."); // 上一次任务执行还未结束
		}
	}

}
