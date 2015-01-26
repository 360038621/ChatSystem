package com.yunfei.action;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;

import com.yunfei.core.BaseAction;
import com.yunfei.pojo.TreeNode;
import com.yunfei.pojo.User;
import com.yunfei.pojo.UserList;

@SuppressWarnings("serial")
public class TreeProAction extends BaseAction {

	public String getJsonString() {
		ArrayList<TreeNode> treeNodeArray = new ArrayList<TreeNode>();

		UserList userList = UserList.getInstance();
		List list = userList.getList();
		HttpSession session = getSession();
		User currUser = (User) session.getAttribute("UserSession");

		for (int i = 0; i < list.size(); i++) {
			User u = (User) list.get(i);

			if (u.equals(currUser)) {
				//System.out.println("当前用户不显示");
			} else {
				TreeNode treeNode = new TreeNode();
				treeNode.setId(u.getSessionid());
				treeNode.setText(u.getUsername());
				treeNode.setDescription(u.getUsername());
				// 子节点
				treeNode.setCls("file");
				treeNode.setLeaf(true);
				treeNode.setExpandable(false);
				treeNodeArray.add(treeNode);
			}

		}
		// 得到JSON数组
		JSONArray jsonArr = JSONArray.fromObject(treeNodeArray);
		// 把JSON数组转化为String类型并返回
		//System.out.println(jsonArr.toString());
		return jsonArr.toString();
	}

	public String execute() {
		//System.out.println("执行了TreeProAction");
		String jsonArr = getJsonString();
		try {
			getResponse().setCharacterEncoding("UTF-8");
			getResponse().getWriter().write(jsonArr);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
}