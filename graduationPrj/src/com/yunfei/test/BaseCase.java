package com.yunfei.test;

import junit.framework.TestCase;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class BaseCase extends TestCase{
	

	public Object getBean(String id){
		ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("applicationContext-*.xml");
		return  context.getBean(id);
	}

}
