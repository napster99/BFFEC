package com.bqcloud.dao.impl;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.bqcloud.dao.PersonDao;
import com.bqcloud.entity.Person;

public class PersonDaoImpl  extends SqlMapClientDaoSupport implements PersonDao{

	public Person findPersonByAccountPassword(String account,String password) {
		Person p = new Person();
		p.setAccount(account);
		p.setPassword(password);
		return (Person)getSqlMapClientTemplate().queryForObject("selectPerson",p);
	}

	public void registerPerson(String account, String pwd, String nickname) {
		Person p = new Person();
		p.setAccount(account);
		p.setPassword(pwd);
		p.setNickname(nickname);
		
		getSqlMapClientTemplate().insert("register", p);
		
	}

}
