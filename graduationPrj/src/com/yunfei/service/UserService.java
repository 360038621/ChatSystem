package com.yunfei.service;

import java.util.List;

import com.yunfei.pojo.User;
import com.yunfei.pojo.UserBean;

/**
 * 
 * @author �����
 * @version 1.0
 */
public interface UserService {

	/**
	 * ��½ϵͳ
	 * 
	 * @param user
	 * @return user
	 */
	public User login(User user);

	/**
	 * 通过username获取user
	 * 
	 * @param user
	 * @return
	 */
	public User getUserFromUsername(String username);

	/**
	 * 注册�û���¼����
	 * 
	 * @param user
	 * @return
	 */
	public Integer register(UserBean ub);

	public boolean getUserBeanFromUsername(String username);

}
