// main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./db");

let mainWindow;

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

  // ✅ Load Next.js dev server during development
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(path.join(__dirname, "out/index.html")); // built version
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// -------------------- Helper --------------------
function runQuerySafe(stmt, params = []) {
  try {
    return stmt.run(params);
  } catch (err) {
    console.error("DB Error:", err.message);
    return { error: err.message };
  }
}

// -------------------- Exams --------------------
ipcMain.handle("get_exams", () =>
  db.prepare("SELECT * FROM exams").all()
);
ipcMain.handle("add_exam", (e, name) =>
  runQuerySafe(db.prepare("INSERT INTO exams (name) VALUES (?)"), [name])
);
ipcMain.handle("edit_exam", (e, data) =>
  runQuerySafe(db.prepare("UPDATE exams SET name=? WHERE id=?"), [data.name, data.id])
);
ipcMain.handle("delete_exam", (e, id) =>
  runQuerySafe(db.prepare("DELETE FROM exams WHERE id=?"), [id])
);

// -------------------- Subjects --------------------
ipcMain.handle("get_subjects", (e, exam_id) => {
  try {
    return db.prepare("SELECT * FROM subjects WHERE examId=?").all(exam_id);
  } catch (err) {
    console.error("Error fetching subjects:", err.message);
    return [];
  }
});

ipcMain.handle("add_subject", (e, data) => {
  const { exam_id, name } = data; // ✅ aligned to snake_case
  return runQuerySafe(
    db.prepare("INSERT INTO subjects (examId, name) VALUES (?, ?)"),
    [exam_id, name]
  );
});

ipcMain.handle("edit_subject", (e, data) =>
  runQuerySafe(db.prepare("UPDATE subjects SET name=? WHERE id=?"), [data.name, data.id])
);

ipcMain.handle("delete_subject", (e, id) =>
  runQuerySafe(db.prepare("DELETE FROM subjects WHERE id=?"), [id])
);

// -------------------- Questions --------------------
ipcMain.handle("get_questions", (e, subject_id) =>
  db.prepare("SELECT * FROM questions WHERE subjectId=?").all(subject_id)
);

ipcMain.handle("add_question", (e, data) => {
  const { subject_id, question, option_a, option_b, option_c, option_d, correct_option } = data;
  return runQuerySafe(
    db.prepare(
      "INSERT INTO questions (subjectId, question, optionA, optionB, optionC, optionD, correctOption) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ),
    [subject_id, question, option_a, option_b, option_c, option_d, correct_option]
  );
});

ipcMain.handle("edit_question", (e, data) => {
  const { id, question, option_a, option_b, option_c, option_d, correct_option } = data;
  return runQuerySafe(
    db.prepare(
      "UPDATE questions SET question=?, optionA=?, optionB=?, optionC=?, optionD=?, correctOption=? WHERE id=?"
    ),
    [question, option_a, option_b, option_c, option_d, correct_option, id]
  );
});

ipcMain.handle("delete_question", (e, id) =>
  runQuerySafe(db.prepare("DELETE FROM questions WHERE id=?"), [id])
);

// -------------------- Answers --------------------
ipcMain.handle("save_answer", (e, { student_id, exam_id, question_id, selected_option }) => {
  if (!student_id || !exam_id || !question_id || !selected_option) {
    return { error: "Missing required fields" };
  }
  try {
    return db
      .prepare(
        `
      INSERT INTO answers (studentId, examId, questionId, selectedOption)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(studentId, examId, questionId) DO UPDATE SET selectedOption=excluded.selectedOption
    `
      )
      .run([student_id, exam_id, question_id, selected_option]);
  } catch (err) {
    console.error("Error saving answer:", err.message);
    return { error: err.message };
  }
});
