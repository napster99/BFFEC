package com.bqcloud.serivce;

import com.bqcloud.entity.Person;

public interface PersonService {

	/**
	 * 登陆验证
	 * @param account
	 * @param password
	 * @return
	 */
	Person login(String account, String password);
	/**
	 * 用户注册
	 * @param account
	 * @param pwd
	 * @param nickname
	 */
	void register(String account, String pwd, String nickname);
}
