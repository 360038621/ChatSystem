package com.yunfei.filter;

import java.io.IOException;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.yunfei.pojo.User;
import com.yunfei.pojo.UserList;

public class UserSessionFilter implements Filter {

	@Override
	public void destroy() {
		// TODO Auto-generated method stub

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		String currentURL = req.getRequestURI(); // 取得根目录所对应的绝对路径:

		String targetURL = currentURL.substring(currentURL.indexOf("/", 1),
				currentURL.length()); // 截取到当前文件名用于比较

		//System.out.println(targetURL);
		HttpSession session = req.getSession();
		User u = (User) session.getAttribute("UserSession");
		//System.out.println("u1111111111111111111==" + session.getId());
		if (u != null) {
			boolean flag = false;
			UserList ul = UserList.getInstance();
			List l = ul.getList();
			for (int i = 0; i < l.size(); i++) {
				User u1 = (User) l.get(i);
				//System.out.println("u12222222==" + u1.getSessionid());
				if (u1.getUsername().equals(u.getUsername()) && !u1.getSessionid().equals(session.getId())) {
					flag = true;
					break;
				}
			}
			if (flag) {
				req.getRequestDispatcher("/login.html").forward(req, res);
				return;
			} else {
				chain.doFilter(request, response);
			}

		} else {
			//System.out.println("----");
			req.getRequestDispatcher("/login.html").forward(req, res);
			return;
		}
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
		// TODO Auto-generated method stub

	}

}
