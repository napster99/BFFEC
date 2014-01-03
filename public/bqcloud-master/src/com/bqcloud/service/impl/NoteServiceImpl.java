package com.bqcloud.service.impl;

import java.util.List;

import com.bqcloud.dao.NoteDao;
import com.bqcloud.entity.Note;
import com.bqcloud.serivce.NoteService;

public class NoteServiceImpl implements NoteService{
	
	private NoteDao noteDao;

	public NoteDao getNoteDao() {
		return noteDao;
	}

	public void setNoteDao(NoteDao noteDao) {
		this.noteDao = noteDao;
	}

	public void putNote(String account, String noteHtml) {
		noteDao.putNoteToDB(account, noteHtml);
		
	}

	public List<Note> getNote(String account, int startCount, int count) {
		return noteDao.getNote(account,startCount ,count);
	}

	
	
}
