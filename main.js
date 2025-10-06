const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./db");

let mainWindow;

/* -------------------- Create Window -------------------- */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const dev = process.env.NODE_ENV === "development";
  dev
    ? mainWindow.loadURL("http://localhost:3000")
    : mainWindow.loadFile(path.join(__dirname, "out/index.html"));

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

/* -------------------- DB Helper -------------------- */
function runQuerySafe(stmt, params = []) {
  try {
    return stmt.run(params);
  } catch (err) {
    console.error("DB Error:", err.message);
    return { error: err.message };
  }
}

/* ============================================================
   📌 EXAMS
============================================================ */
ipcMain.handle("get_exams", () =>
  db.prepare("SELECT * FROM exams").all()
);

ipcMain.handle("add_exam", (e, name) =>
  runQuerySafe(db.prepare("INSERT INTO exams (name) VALUES (?)"), [name])
);

ipcMain.handle("edit_exam", (e, { id, name }) =>
  runQuerySafe(db.prepare("UPDATE exams SET name=? WHERE id=?"), [name, id])
);

ipcMain.handle("delete_exam", (e, id) =>
  runQuerySafe(db.prepare("DELETE FROM exams WHERE id=?"), [id])
);

ipcMain.handle("set_exam_duration", (e, { id, duration }) =>
  runQuerySafe(db.prepare("UPDATE exams SET duration=? WHERE id=?"), [duration, id])
);

ipcMain.handle("set_exam_timing_mode", (e, { id, mode }) =>
  runQuerySafe(db.prepare("UPDATE exams SET timingMode=? WHERE id=?"), [mode, id])
);

ipcMain.handle("get_exam_duration", (e, id) => {
  try {
    return db.prepare("SELECT duration FROM exams WHERE id=?").get(id);
  } catch (err) {
    console.error("Error fetching exam duration:", err.message);
    return { duration: 0 };
  }
});

/* ============================================================
   📌 SUBJECTS
============================================================ */
ipcMain.handle("get_subjects", (e, exam_id) => {
  try {
    return db.prepare("SELECT * FROM subjects WHERE examId=?").all(exam_id);
  } catch (err) {
    console.error("Error fetching subjects:", err.message);
    return [];
  }
});

ipcMain.handle("add_subject", (e, { exam_id, name, duration }) =>
  runQuerySafe(
    db.prepare("INSERT INTO subjects (examId, name, duration) VALUES (?, ?, ?)"),
    [exam_id, name, duration || 30]
  )
);

ipcMain.handle("edit_subject", (e, { id, name, duration }) =>
  runQuerySafe(
    db.prepare("UPDATE subjects SET name=?, duration=? WHERE id=?"),
    [name, duration || 30, id]
  )
);

ipcMain.handle("set_subject_duration", (e, { id, duration }) =>
  runQuerySafe(
    db.prepare("UPDATE subjects SET duration=? WHERE id=?"),
    [duration, id]
  )
);

ipcMain.handle("delete_subject", (e, id) =>
  runQuerySafe(db.prepare("DELETE FROM subjects WHERE id=?"), [id])
);

/* ============================================================
   📌 QUESTIONS
============================================================ */
ipcMain.handle("get_questions", (e, subject_id) =>
  db.prepare("SELECT * FROM questions WHERE subjectId=?").all(subject_id)
);

ipcMain.handle("add_question", (e, data) => {
  const { subject_id, question, option_a, option_b, option_c, option_d, correct_option } = data;
  return runQuerySafe(
    db.prepare(
      `INSERT INTO questions 
       (subjectId, question, optionA, optionB, optionC, optionD, correctOption) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ),
    [subject_id, question, option_a, option_b, option_c, option_d, correct_option]
  );
});

ipcMain.handle("edit_question", (e, data) => {
  const { id, question, option_a, option_b, option_c, option_d, correct_option } = data;
  return runQuerySafe(
    db.prepare(
      `UPDATE questions 
       SET question=?, optionA=?, optionB=?, optionC=?, optionD=?, correctOption=? 
       WHERE id=?`
    ),
    [question, option_a, option_b, option_c, option_d, correct_option, id]
  );
});

ipcMain.handle("delete_question", (e, id) =>
  runQuerySafe(db.prepare("DELETE FROM questions WHERE id=?"), [id])
);

/* ============================================================
   📌 ANSWERS (Student Page)
============================================================ */
ipcMain.handle("save_answer", (e, { student_id, exam_id, question_id, selected_option }) => {
  if (!student_id || !exam_id || !question_id || !selected_option) {
    return { error: "Missing required fields" };
  }
  try {
    return db
      .prepare(
        `INSERT INTO answers (studentId, examId, questionId, selectedOption)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(studentId, examId, questionId) 
         DO UPDATE SET selectedOption=excluded.selectedOption`
      )
      .run([student_id, exam_id, question_id, selected_option]);
  } catch (err) {
    console.error("Error saving answer:", err.message);
    return { error: err.message };
  }
});

ipcMain.handle("save_answers_bulk", (e, { student_id, exam_id, answers }) => {
  const stmt = db.prepare(
    `INSERT INTO answers (studentId, examId, questionId, selectedOption)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(studentId, examId, questionId) 
     DO UPDATE SET selectedOption=excluded.selectedOption`
  );
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

/* ============================================================
   🧑‍🎓 CANDIDATES
============================================================ */
ipcMain.handle("get_candidates", () => {
  try {
    return db.prepare("SELECT * FROM candidates").all();
  } catch (err) {
    console.error("Error fetching candidates:", err.message);
    return [];
  }
});

ipcMain.handle("add_candidate", (e, data) => {
  const { name, schoolNo } = data;
  return runQuerySafe(
    db.prepare("INSERT INTO candidates (name, schoolNo) VALUES (?, ?)"),
    [name, schoolNo]
  );
});

ipcMain.handle("edit_candidate", (e, data) => {
  const { id, name, schoolNo } = data;
  return runQuerySafe(
    db.prepare("UPDATE candidates SET name=?, schoolNo=? WHERE id=?"),
    [name, schoolNo, id]
  );
});

ipcMain.handle("delete_candidate", (e, id) =>
  runQuerySafe(db.prepare("DELETE FROM candidates WHERE id=?"), [id])
);

/* ============================================================
   📊 REPORTS & EXPORT
============================================================ */
ipcMain.handle("get_reports", () => {
  try {
    return db.prepare(`
      SELECT e.name as exam, COUNT(a.id) as answers_count
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
      SELECT c.name as student, s.name as subject, q.question, a.selectedOption
      FROM answers a
      JOIN candidates c ON a.studentId = c.id
      JOIN questions q ON a.questionId = q.id
      JOIN subjects s ON q.subjectId = s.id
      WHERE a.examId=?
    `).all(examId);
  } catch (err) {
    console.error("Error exporting results:", err.message);
    return [];
  }
});