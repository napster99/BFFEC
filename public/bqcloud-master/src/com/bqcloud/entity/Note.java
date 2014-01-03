package com.bqcloud.entity;

import java.util.Date;

public class Note {
	
	private int id;
	private String account;
	private String noteHtml;
	private Date time;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	public String getAccount() {
		return account;
	}
	public void setAccount(String account) {
		this.account = account;
	}
	
	public String getNoteHtml() {
		return noteHtml;
	}
	public void setNoteHtml(String noteHtml) {
		this.noteHtml = noteHtml;
	}
	public Date getTime() {
		return time;
	}
	public void setTime(Date time) {
		this.time = time;
	}
	
	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return super.hashCode();
	}
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return super.toString();
	}

	
}

