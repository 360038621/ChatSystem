package com.yunfei.action;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.yunfei.core.BaseAction;
import com.yunfei.pojo.User;
import com.yunfei.pojo.UserBean;
import com.yunfei.pojo.UserList;
import com.yunfei.service.UserService;

/**
 * 
 * @author �����
 * @version 1.0
 */
@SuppressWarnings("serial")
public class UserAction extends BaseAction {

	private UserService userService;

	private User user;

	private UserBean ub;
	private Integer userId;
	private String username;
	private String password;
	private String sex;
	private String email;
	private String realName;
	private String nickName;
	private Integer age;
	private String website;
	private String phone;
	private String qq;
	private String description;

	public String login() {
		HttpServletRequest request = getRequest();
		System.out.println(username);
		// String username = request.getParameter("username");
		// String password = request.getParameter("password");

		User user = new User();
		user.setUsername(username);
		user.setPassword(password);
		User _user = userService.login(user);
		if (_user != null) {
			HttpSession session = getSession();
			String sessionid = session.getId();
			_user.setSessionid(sessionid);
			System.out.println(sessionid + "----------------login");
			_user.setU(_user);
			session.setAttribute("UserSession", _user);
			return null;
		} else {
			HttpServletResponse response = getResponse();
			try {
				response.getWriter().write("{success:false,message:'Failure'}");
			} catch (IOException e) {
				e.printStackTrace();
			}
			return null;
		}
	}

	public String checkLogin() {
		HttpServletRequest request = getRequest();
		boolean flag = false;
		String username = request.getParameter("username");

		System.out.println(username);
		UserList ul = UserList.getInstance();
		List l = ul.getList();
		for (int i = 0; i < l.size(); i++) {
			User u = (User) l.get(i);
			if (u.getUsername().equals(username)) {
				System.out.println("check......................");
				flag = true;
				break;
			}
		}
		if (flag) {
			System.out.println("该用户已经登陆");
			return null;
		} else {
			System.out.println("该用户未登录");
			HttpServletResponse response = getResponse();
			try {
				response.getWriter().write("{success:false,message:'failure'}");
			} catch (IOException e) {
				e.printStackTrace();
			}
			return null;
		}

	}

	public String logout() {

		HttpSession session = getSession();

		System.out.println(session.getId() + "--======================logout");
		if (session != null) {
			session.invalidate();
		}
		return null;
	}

	public String register() {
		System.out.println(ub.getUsername());
		Integer id = (Integer) userService.register(ub);
		if (id != 0) {
			System.out.println("新注册用户的ID：" + id);
			HttpServletResponse response = getResponse();
			try {
				response.getWriter().write("{success:true,msg:'notExist'}");
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else {
			HttpServletResponse response = getResponse();
			try {
				response.getWriter().write("{success:true,msg:'exist'}");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return null;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public UserBean getUb() {
		return ub;
	}

	public void setUb(UserBean ub) {
		this.ub = ub;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public String getWebsite() {
		return website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public UserService getUserService() {
		return userService;
	}

}
