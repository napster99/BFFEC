package com.bqcloud.serivce;

import java.util.List;

import com.bqcloud.entity.Note;

public interface NoteService {

	public void putNote(String account, String noteHtml);
	
	public List<Note> getNote(String account,int startCount, int count);
}
