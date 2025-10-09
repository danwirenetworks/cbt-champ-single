module.exports = (ipcMain, db) => {
  ipcMain.handle("get_subjects", (e, exam_id) => {
    try {
      return db.prepare("SELECT * FROM subjects WHERE examId=?").all(exam_id);
    } catch (err) {
      console.error("Error fetching subjects:", err.message);
      return [];
    }
  });

  ipcMain.handle("add_subject", (e, { exam_id, name, duration, questionCount, allowGroupShuffle }) =>
    db.prepare(`
      INSERT INTO subjects (examId, name, duration, questionCount, allowGroupShuffle)
      VALUES (?, ?, ?, ?, ?)
    `).run(exam_id, name, duration || 30, questionCount || 50, allowGroupShuffle ? 1 : 0)
  );

  ipcMain.handle("edit_subject", (e, { id, name, duration, questionCount, allowGroupShuffle }) =>
    db.prepare(`
      UPDATE subjects SET name=?, duration=?, questionCount=?, allowGroupShuffle=?
      WHERE id=?
    `).run(name, duration || 30, questionCount || 50, allowGroupShuffle ? 1 : 0, id)
  );

  ipcMain.handle("set_subject_duration", (e, { id, duration }) =>
    db.prepare("UPDATE subjects SET duration=? WHERE id=?").run(duration, id)
  );

  ipcMain.handle("delete_subject", (e, id) =>
    db.prepare("DELETE FROM subjects WHERE id=?").run(id)
  );
};
