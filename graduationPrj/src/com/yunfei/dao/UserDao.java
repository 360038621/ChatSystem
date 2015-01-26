package com.yunfei.dao;

import com.yunfei.pojo.User;
import com.yunfei.pojo.UserBean;

/**
 * UserDao.java
 * 
 * @author �����
 * @version 1.0
 */
public interface UserDao {

	/**
	 * 登陆�û���¼����
	 * 
	 * @param user
	 * @return
	 */
	public User login(User user);

	/**
	 * 注册�û���¼����
	 * 
	 * @param user
	 * @return
	 */
	public Integer register(UserBean ub);

	/**
	 * 通过username获取user
	 * 
	 * @param user
	 * @return
	 */
	public User getUserFromUsername(String username);

	public UserBean getUserBeanFromUsername(String username);

}
