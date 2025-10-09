module.exports = (ipcMain, db) => {
  ipcMain.handle("save_answer", (e, { student_id, exam_id, question_id, selected_option }) => {
    if (!student_id || !exam_id || !question_id || !selected_option) {
      return { error: "Missing required fields" };
    }
    try {
      return db.prepare(`
        INSERT INTO answers (studentId, examId, questionId, selectedOption)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(studentId, examId, questionId) 
        DO UPDATE SET selectedOption=excluded.selectedOption
      `).run([student_id, exam_id, question_id, selected_option]);
    } catch (err) {
      console.error("Error saving answer:", err.message);
      return { error: err.message };
    }
  });

  ipcMain.handle("save_answers_bulk", (e, { student_id, exam_id, answers }) => {
    const stmt = db.prepare(`
      INSERT INTO answers (studentId, examId, questionId, selectedOption)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(studentId, examId, questionId) 
      DO UPDATE SET selectedOption=excluded.selectedOption
    `);
    const transaction = db.transaction(() => {
      answers.forEach(({ question_id, selected_option }) => {
        stmt.run([student_id, exam_id, question_id, selected_option]);
      });
    });
    try {
      transaction();
      return { success: true };
    } catch (err) {
      console.error("Bulk save error:", err.message);
      return { error: err.message };
    }
  });
};
