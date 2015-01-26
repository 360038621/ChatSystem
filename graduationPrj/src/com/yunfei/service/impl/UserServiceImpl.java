package com.yunfei.service.impl;

import java.util.List;

import com.yunfei.dao.UserDao;
import com.yunfei.pojo.User;
import com.yunfei.pojo.UserBean;
import com.yunfei.service.UserService;

public class UserServiceImpl implements UserService {

	private UserDao userDao;

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	public User login(User user) {
		return userDao.login(user);
	}

	@Override
	public User getUserFromUsername(String username) {
		return userDao.getUserFromUsername(username);
	}

	@Override
	public Integer register(UserBean ub) {
		if(getUserBeanFromUsername(ub.getUsername())){
			return 0;
		}else{
			System.out.println("123");
			return userDao.register(ub);
		}
		
	}

	@Override
	public boolean getUserBeanFromUsername(String username) {
		UserBean ub = userDao.getUserBeanFromUsername(username);
		if (ub != null) {
			return true;
		} else {
			return false;
		}

	}

}
