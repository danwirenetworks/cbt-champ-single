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
      duration INTEGER DEFAULT 0,
      timingMode TEXT DEFAULT 'per-subject'
      -- shuffleMode will be added via migration below
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      examId INTEGER NOT NULL,
      name TEXT NOT NULL,
      duration INTEGER DEFAULT 30,
      questionCount INTEGER DEFAULT 50,
      allowGroupShuffle INTEGER DEFAULT 1,
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
      groupId TEXT,
      groupOrder INTEGER,
      FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId INTEGER NOT NULL,
      examId INTEGER NOT NULL,
      questionId INTEGER NOT NULL,
      selectedOption TEXT NOT NULL,
      startTime TEXT,
      endTime TEXT,
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE,
      FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE,
      UNIQUE(studentId, examId, questionId)
    );

    CREATE TABLE IF NOT EXISTS sessionQuestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId INTEGER NOT NULL,
      examId INTEGER NOT NULL,
      subjectId INTEGER NOT NULL,
      questionData TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE,
      FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE,
      UNIQUE(studentId, examId, subjectId)
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
  ensureColumnExists("exams", "shuffleMode", "TEXT DEFAULT 'none'"); // ✅ Added shuffleMode
  ensureColumnExists("subjects", "duration", "INTEGER DEFAULT 30");
  ensureColumnExists("subjects", "questionCount", "INTEGER DEFAULT 50");
  ensureColumnExists("subjects", "allowGroupShuffle", "INTEGER DEFAULT 1");
  ensureColumnExists("questions", "groupId", "TEXT");
  ensureColumnExists("questions", "groupOrder", "INTEGER");
  ensureColumnExists("answers", "startTime", "TEXT");
  ensureColumnExists("answers", "endTime", "TEXT");
} catch (err) {
  console.error("❌ Migration error:", err.message);
}

// -------------------- Log Success --------------------
console.log(`✅ Database initialized successfully at: ${DB_PATH}`);

module.exports = db;
