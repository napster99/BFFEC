package com.bqcloud.dao.impl;

import java.util.HashMap;
import java.util.List;

import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.bqcloud.dao.NoteDao;
import com.bqcloud.entity.Note;

public class NoteDaoImpl extends SqlMapClientDaoSupport implements NoteDao {

	public void putNoteToDB(String account, String noteHtml) {
		Note n = new Note();
		n.setNoteHtml(noteHtml);
		n.setAccount(account);
		System.out.println(account+"   "+noteHtml);
		getSqlMapClientTemplate().insert("insertNote", n);
	}
	
	@SuppressWarnings("unchecked")
	public List<Note> getNote(String account,int startCount, int count) {
		System.out.println("account>>"+account+"   startCount>>>"+startCount+"  count>>"+count);
		HashMap hash = new HashMap();
		hash.put("startCount", startCount);
		hash.put("count",count);
		
		return getSqlMapClientTemplate().queryForList("selectNote",hash);
	}

	
}
