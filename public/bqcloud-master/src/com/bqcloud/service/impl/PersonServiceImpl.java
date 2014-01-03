package com.bqcloud.service.impl;

import com.bqcloud.dao.PersonDao;
import com.bqcloud.entity.Person;
import com.bqcloud.serivce.PersonService;

public class PersonServiceImpl implements PersonService{

	private PersonDao personDao;

	public PersonDao getPersonDao() {
		return personDao;
	}

	public void setPersonDao(PersonDao personDao) {
		this.personDao = personDao;
	}

	/**
	 * 登录验证
	 */
	public Person login(String account, String password) {
		System.out.println(">>>"+password);
		Person user = personDao.findPersonByAccountPassword(account,password);
		System.out.println("user>>>"+user);
		return user;
	}
	/**
	 * 用户注册
	 */
	public void register(String account, String pwd, String nickname){
		personDao.registerPerson(account, pwd, nickname);
	}

}
