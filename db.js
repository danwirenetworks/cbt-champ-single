// db.js
const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "cbt.db");
const db = new Database(DB_PATH);

// -------------------- Helper: Safe Migration --------------------
function ensureColumnExists(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  const exists = columns.some((col) => col.name === column);
  if (!exists) {
    db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`).run();
    console.log(`🧱 Added missing column '${column}' to '${table}'`);
  }
}

// -------------------- Initialize Schema --------------------
try {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      duration INTEGER DEFAULT 0,         -- ✅ session-level duration
      timingMode TEXT DEFAULT 'per-subject' -- ✅ session vs per-subject
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      examId INTEGER NOT NULL,
      name TEXT NOT NULL,
      duration INTEGER DEFAULT 30,        -- ✅ subject-level duration
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
      startTime TEXT,                     -- ✅ optional: track when answering started
      endTime TEXT,                       -- ✅ optional: track when answering ended
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE,
      FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE,
      UNIQUE(studentId, examId, questionId)
    );
  `);
} catch (err) {
  console.error("❌ Error initializing database schema:", err.message);
  process.exit(1);
}

// -------------------- Run Migrations --------------------
try {
  ensureColumnExists("exams", "duration", "INTEGER DEFAULT 0");
  ensureColumnExists("exams", "timingMode", "TEXT DEFAULT 'per-subject'");
  ensureColumnExists("subjects", "duration", "INTEGER DEFAULT 30");
  ensureColumnExists("answers", "startTime", "TEXT");
  ensureColumnExists("answers", "endTime", "TEXT");
} catch (err) {
  console.error("❌ Migration error:", err.message);
}

// -------------------- Log Success --------------------
console.log(`✅ Database initialized successfully at: ${DB_PATH}`);

module.exports = db;