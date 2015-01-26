package com.yunfei.core;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public class ConnectionUtil {
	public Connection getConnection() {
		Properties prop = new Properties();
		
		try {
			prop.load(this.getClass().getClassLoader().getResourceAsStream(
					"DB.properties"));
			String username = prop.getProperty("username");
			String password = prop.getProperty("password");
			String url = prop.getProperty("url");
			String driver = prop.getProperty("driver");
			Class.forName(driver);
			return DriverManager.getConnection(url, username, password);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

}
