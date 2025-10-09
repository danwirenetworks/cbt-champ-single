module.exports = (ipcMain, db) => {
  ipcMain.handle("get_reports", () => {
    try {
      return db.prepare(`
        SELECT e.name AS exam, COUNT(a.id) AS answers_count
        FROM answers a 
        JOIN exams e ON a.examId = e.id
        GROUP BY a.examId
      `).all();
    } catch (err) {
      console.error("Error fetching reports:", err.message);
      return [];
    }
  });

  ipcMain.handle("export_results", (e, examId) => {
    try {
      return db.prepare(`
        SELECT c.name AS student, s.name AS subject, q.question, a.selectedOption
        FROM answers a
        JOIN candidates c ON a.studentId = c.id
        JOIN questions q ON a.questionId = q.id
        JOIN subjects s ON q.subjectId = s.id
        WHERE a.examId = ?
      `).all(examId);
    } catch (err) {
      console.error("Error exporting results:", err.message);
      return [];
    }
  });
};
