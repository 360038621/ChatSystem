package com.yunfei.pojo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("serial")
public class UserList implements Serializable {
	private List list;

	private static UserList instance = null;

	// 以private的方式来声明构造方法,使得其他的类对象无法调用此类的构造函数
	private UserList() {
		list = new ArrayList();
	}

	public static synchronized UserList getInstance() {
		if (instance == null) {
			instance = new UserList();
		}
		return instance;
	}

	public void addUser(User u) {
		if (u != null) {
			list.add(u);
		}
	}

	public void removeUser(User u) {
		if (u != null)
			list.remove(u);
	}

	public List getList() {
		return list;
	}
}
