package com.bqcloud.dao;

import java.util.List;

import com.bqcloud.entity.Note;

public interface NoteDao {
	
	void putNoteToDB(String account, String noteHtml);
	
	List<Note> getNote(String account, int startCount,int count);
}
