// db.js
const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "cbt.db");
const db = new Database(DB_PATH);

// Always initialize tables to prevent missing-table errors
db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    examId INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subjectId INTEGER NOT NULL,
    question TEXT NOT NULL,
    optionA TEXT NOT NULL,
    optionB TEXT NOT NULL,
    optionC TEXT NOT NULL,
    optionD TEXT NOT NULL,
    correctOption TEXT NOT NULL,
    FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId INTEGER NOT NULL,
    examId INTEGER NOT NULL,
    questionId INTEGER NOT NULL,
    selectedOption TEXT NOT NULL,
    FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE,
    UNIQUE(studentId, examId, questionId)
  );
`);

console.log("Database initialized successfully.");
module.exports = db;
