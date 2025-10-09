module.exports = (ipcMain, db) => {
  // 📋 Get all exams
  ipcMain.handle("get_exams", () =>
    db.prepare("SELECT * FROM exams").all()
  );

  // ➕ Add new exam
  ipcMain.handle("add_exam", (e, name) =>
    db.prepare("INSERT INTO exams (name) VALUES (?)").run(name)
  );

  // ✏️ Edit exam name
  ipcMain.handle("edit_exam", (e, { id, name }) =>
    db.prepare("UPDATE exams SET name=? WHERE id=?").run(name, id)
  );

  // 🗑 Delete exam
  ipcMain.handle("delete_exam", (e, id) =>
    db.prepare("DELETE FROM exams WHERE id=?").run(id)
  );

  // ⏱ Set session duration
  ipcMain.handle("set_exam_duration", (e, { id, duration }) =>
    db.prepare("UPDATE exams SET duration=? WHERE id=?").run(duration, id)
  );

  // ⏱ Set timing mode
  ipcMain.handle("set_exam_timing_mode", (e, { id, mode }) =>
    db.prepare("UPDATE exams SET timingMode=? WHERE id=?").run(mode, id)
  );

  // 🔀 Set shuffle mode
  ipcMain.handle("set_exam_shuffle_mode", (e, { id, mode }) => {
    try {
      return db.prepare("UPDATE exams SET shuffleMode=? WHERE id=?").run(mode, id);
    } catch (err) {
      console.error("❌ Error setting shuffle mode:", err.message);
      return { success: false, error: err.message };
    }
  });

  // ⏱ Get session duration
  ipcMain.handle("get_exam_duration", (e, id) => {
    try {
      return db.prepare("SELECT duration FROM exams WHERE id=?").get(id);
    } catch (err) {
      console.error("❌ Error fetching exam duration:", err.message);
      return { duration: 0 };
    }
  });
};
