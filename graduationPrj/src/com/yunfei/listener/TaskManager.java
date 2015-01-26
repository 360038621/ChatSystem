package com.yunfei.listener;

import java.util.Timer;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.yunfei.action.UpdateUserTask;

public class TaskManager implements ServletContextListener {
	/**
	 * 定时毫秒数
	 */
	public static final long PERIOD_SECOND = 1000*30;
	/**
	 * 无延迟
	 */
	public static final long NO_DELAY = 0;
	/**
	 * 定时器
	 */
	private Timer timer;

	/**
	 * 在Web应用启动时初始化任务
	 */
	public void contextInitialized(ServletContextEvent event) {
		// 定义定时器
		timer = new Timer("定时检查在线用户", true);
		// 每10秒执行一次
		timer.schedule(new UpdateUserTask(), NO_DELAY, PERIOD_SECOND);
		// timer.schedule(new BackUpTableTask(),NO_DELAY, 30000);
	}

	/**
	 * 在Web应用结束时停止任务
	 */
	public void contextDestroyed(ServletContextEvent event) {
		timer.cancel(); // 定时器销毁
	}
}
