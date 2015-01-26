package com.yunfei.pojo;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

@SuppressWarnings("serial")
public class PublicChatLog implements Serializable {
	private LinkedList<Message> messages;
	private static PublicChatLog instance = null;

	// 以private的方式来声明构造方法,使得其他的类对象无法调用此类的构造函数
	private PublicChatLog() {
		messages = new LinkedList<Message>();
	}

	public static synchronized PublicChatLog getInstance() {
		if (instance == null) {
			instance = new PublicChatLog();
		}
		return instance;
	}

	public void addMsg(Message m) {
		if (m != null) {
			messages.addFirst(m);
			while (messages.size() > 50) {
				messages.removeLast();
			}
		}
	}

	public LinkedList<Message> getList() {
		return messages;
	}
	
}
