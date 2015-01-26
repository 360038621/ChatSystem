package com.yunfei.pojo;

import java.io.Serializable;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

@SuppressWarnings("serial")
public class User implements HttpSessionBindingListener, Serializable {
	private static final long serialVersionUID = 1549880235571202091L;
	private int id;
	private String username;
	private String password;
	private String sessionid;
	private User u;

	public User getU() {
		return u;
	}

	public void setU(User u) {
		this.u = u;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	private UserList userList = UserList.getInstance();

	public void valueBound(HttpSessionBindingEvent e) {
		System.out.println("==================================执行了valueBound");
		System.out.println("addUser:  " + u.getUsername());
		userList.addUser(u);
		System.out.println(userList.getList());
	}

	public void valueUnbound(HttpSessionBindingEvent e) {
		System.out.println("==================================执行了valueUnBound");
		System.out.println("RemoveUser:   " + u.getUsername());
		userList.removeUser(u);
		System.out.println(userList.getList());

	}

	public String getSessionid() {
		return sessionid;
	}

	public void setSessionid(String sessionid) {
		this.sessionid = sessionid;
	}

}
