package com.bqcloud.server;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.bqcloud.entity.Note;
import com.bqcloud.serivce.NoteService;

@Controller
@RequestMapping("/Note.do")
public class NoteAction {

	private NoteService noteService;

	public NoteService getNoteService() {
		return noteService;
	}

	public void setNoteService(NoteService noteService) {
		this.noteService = noteService;
	}
	
	/**
	 * 单个接收便签
	 * @param account
	 * @param pwd
	 * @param request
	 * @return
	 */
	@RequestMapping(params="method=setNote")
	@ResponseBody
	public String setNote(@RequestParam("account") String account, @RequestParam("noteHtml") String noteHtml){
		
		noteService.putNote(account, noteHtml);
		
		return "success";
	}
	
	/**
	 * 获取便签
	 * @param account
	 * @param pwd
	 * @param request
	 * @return
	 */
	@RequestMapping(params="method=getNote")
	@ResponseBody
	public List<Note> getNote(@RequestParam("account") String account,@RequestParam("startCount") int startCount,  @RequestParam("count") int count){
		return noteService.getNote(account,startCount, count);

	}
}
