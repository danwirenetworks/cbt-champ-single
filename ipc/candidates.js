module.exports = (ipcMain, db) => {
  ipcMain.handle("get_candidates", () => {
    try {
      return db.prepare("SELECT * FROM candidates").all();
    } catch (err) {
      console.error("Error fetching candidates:", err.message);
      return [];
    }
  });

  ipcMain.handle("add_candidate", (e, { name, schoolNo }) =>
    db.prepare("INSERT INTO candidates (name, schoolNo) VALUES (?, ?)").run(name, schoolNo)
  );

  ipcMain.handle("edit_candidate", (e, { id, name, schoolNo }) =>
    db.prepare("UPDATE candidates SET name=?, schoolNo=? WHERE id=?").run(name, schoolNo, id)
  );

  ipcMain.handle("delete_candidate", (e, id) =>
    db.prepare("DELETE FROM candidates WHERE id=?").run(id)
  );
};
