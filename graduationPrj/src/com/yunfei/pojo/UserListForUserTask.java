package com.yunfei.pojo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("serial")
public class UserListForUserTask implements Serializable {
	private List list;

	private static UserListForUserTask instance = null;

	// 以private的方式来声明构造方法,使得其他的类对象无法调用此类的构造函数
	private UserListForUserTask() {
		list = new ArrayList();
	}

	public static synchronized UserListForUserTask getInstance() {
		if (instance == null) {
			instance = new UserListForUserTask();
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
