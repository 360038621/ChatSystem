package com.yunfei.pojo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.directwebremoting.ScriptSession;

public class ScriptSessionMap {
	private Map<String, ScriptSession> m;

	private static ScriptSessionMap instance = null;

	// 以private的方式来声明构造方法,使得其他的类对象无法调用此类的构造函数
	private ScriptSessionMap() {
		m = new HashMap<String, ScriptSession>();
	}

	public static synchronized ScriptSessionMap getInstance() {
		if (instance == null) {
			instance = new ScriptSessionMap();
		}
		return instance;
	}

	public void addScriptSession(String sessionid,ScriptSession ss) {
		if (ss != null) {
			m.put(sessionid, ss);
		}
	}

	public void delScriptSession(String sessionid) {
		if (sessionid != null)
			m.remove(sessionid);
	}

	public Map<String, ScriptSession> getMap() {
		return m;
	}
}
