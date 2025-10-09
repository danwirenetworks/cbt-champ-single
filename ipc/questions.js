module.exports = (ipcMain, db) => {
  ipcMain.handle("get_questions", (e, subject_id) =>
    db.prepare("SELECT * FROM questions WHERE subjectId=?").all(subject_id)
  );

  ipcMain.handle("add_question", (e, data) => {
    const {
      subject_id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      group_id,
      group_order,
    } = data;

    return db.prepare(`
      INSERT INTO questions 
      (subjectId, question, optionA, optionB, optionC, optionD, correctOption, groupId, groupOrder) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      subject_id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      group_id || null,
      group_order || null
    );
  });

  ipcMain.handle("edit_question", (e, data) => {
    const {
      id,
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      group_id,
      group_order,
    } = data;

    return db.prepare(`
      UPDATE questions 
      SET question=?, optionA=?, optionB=?, optionC=?, optionD=?, correctOption=?, groupId=?, groupOrder=? 
      WHERE id=?
    `).run(
      question,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      group_id || null,
      group_order || null,
      id
    );
  });

  ipcMain.handle("delete_question", (e, id) =>
    db.prepare("DELETE FROM questions WHERE id=?").run(id)
  );
};
