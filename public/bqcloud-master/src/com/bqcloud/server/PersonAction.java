package com.bqcloud.server;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bqcloud.entity.Person;
import com.bqcloud.serivce.PersonService;

@Controller
@RequestMapping("/Person.do")
public class PersonAction {

	private PersonService personService;

	public PersonService getPersonService() {
		return personService;
	}

	public void setPersonService(PersonService personService) {
		this.personService = personService;
	}
	

	/**
	 * 用户登录验证
	 * @param account
	 * @param pwd
	 * @param request
	 * @return
	 */
	@RequestMapping(params="method=login")
	@ResponseBody
	public Person login(@RequestParam("account") String account, @RequestParam("pwd") String pwd, HttpServletRequest request){
		
		System.out.println(account+"  "+pwd);
		System.out.println(personService.login(account, pwd));
		Person p = new Person();
		
		if(personService.login(account, pwd) == null){
			return p; 
		}else{
			return personService.login(account, pwd);
		}
		
		/*
		Person p1 = new Person();
		p1.setAccount("111111111");
		p1.setNickname("张三");
		Person p2 = new Person();
		p2.setAccount("2222222222");
		p2.setNickname("李四");
		
		List<Person> list = new ArrayList<Person>();
		
		list.add(p1);
		list.add(p2);
		
		return list;*/
		
	}
	
	/**
	 * 用户注册
	 * @param account
	 * @param pwd
	 * @param nickname
	 * @return
	 */
	@RequestMapping(params="method=register")
	@ResponseBody
	public String login(@RequestParam("account") String account, @RequestParam("pwd") String pwd, @RequestParam("nickname") String nickname, HttpServletRequest request){
		
		personService.register(account, pwd, nickname);
		
		return "success";
	}
	
	
	
}
