package com.yunfei.dao.impl;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.yunfei.dao.UserDao;
import com.yunfei.pojo.User;
import com.yunfei.pojo.UserBean;


/**
 * 
 * @author �����
 * @version 1.0
 */
public class UserDaoImpl extends SqlMapClientDaoSupport implements UserDao {

	public User login(User user) {
		return (User) getSqlMapClientTemplate().queryForObject("User.login",user);
	}

	@Override
	public User getUserFromUsername(String username) {
		return (User) getSqlMapClientTemplate().queryForObject("User.getUserFromUsername",username);
	}

	@Override
	public Integer register(UserBean ub) {
		System.out.println(ub.getNickName());
		return (Integer) getSqlMapClientTemplate().insert("User.register", ub);
	}

	@Override
	public UserBean getUserBeanFromUsername(String username) {
		return (UserBean) getSqlMapClientTemplate().queryForObject("User.getUserBeanFromUsername",username);
	}
}
