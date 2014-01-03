package com.bqcloud.dao;

import com.bqcloud.entity.Person;

public interface PersonDao {
	Person findPersonByAccountPassword(String account, String password);
	
	void registerPerson(String account, String pwd, String nickname);
}
