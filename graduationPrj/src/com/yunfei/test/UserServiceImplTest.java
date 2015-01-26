package com.yunfei.test;

import com.yunfei.dao.UserDao;
import com.yunfei.pojo.UserBean;
import com.yunfei.service.UserService;

public class UserServiceImplTest extends BaseCase {
	private UserDao userDao;

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}
	
	private UserService userservince;

	
	public void testGetUserFromUsername() {
		UserService  userservince = (UserService) super.getBean("userService");
		//System.out.println(userservince.getUserBeanFromUsername("yunfei1"));
		UserBean u = new UserBean();
		u.setUsername("yunfei1");
		u.setPassword("1234");
		u.setNickName("asd");
		u.setAge(1);
		Integer id = (Integer) userservince.register(u);
		System.out.println(id);
		
		
		//UserDao userDao = (UserDao) super.getBean("userDao");
		//UserBean u = userDao.getUserBeanFromUsername("yunfei1");
		//System.out.println(userservince.getUserBeanFromUsername("yunfe"));
		
		
		/*UserDao userDao = (UserDao) super.getBean("userDao");
		UserBean u = new UserBean();
		u.setUsername("yunfei1000");
		u.setPassword("1234");
		
		System.out.println(userDao.register(u).toString());*/
	}


	public UserService getUserservince() {
		return userservince;
	}


	public void setUserservince(UserService userservince) {
		this.userservince = userservince;
	}
}
