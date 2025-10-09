module.exports = (ipcMain, db) => {
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  ipcMain.handle("get_shuffled_questions", (e, subject_id) => {
    const subject = db.prepare("SELECT * FROM subjects WHERE id=?").get(subject_id);
    const all = db.prepare("SELECT * FROM questions WHERE subjectId=?").all(subject_id);

    const blocks = {};
    const singles = [];

    for (const q of all) {
      if (q.groupId) {
        if (!blocks[q.groupId]) blocks[q.groupId] = [];
        blocks[q.groupId].push(q);
      } else {
        singles.push(q);
      }
    }

    const blockList = Object.values(blocks);
    if (subject.allowGroupShuffle) shuffle(blockList);
    shuffle(singles);

    const selected = [];
    let total = 0;

    for (const block of blockList) {
      if (total + block.length <= subject.questionCount) {
        selected.push(...block);
        total += block.length;
      }
    }

    for (const single of singles) {
      if (total < subject.questionCount) {
        selected.push(single);
        total += 1;
      } else break;
    }

    return selected;
  });

  ipcMain.handle("save_session_questions", (e, { student_id, exam_id, subject_id, questions }) => {
    const json = JSON.stringify(questions);
    return db.prepare(`
      INSERT OR REPLACE INTO sessionQuestions (studentId, examId, subjectId, questionData)
      VALUES (?, ?, ?, ?)
    `).run(student_id, exam_id, subject_id, json);
  });

  ipcMain.handle("get_session_questions", (e, { student_id, exam_id, subject_id }) => {
    const row = db.prepare(`
      SELECT questionData FROM sessionQuestions
      WHERE studentId=? AND examId=? AND subjectId=?
    `).get(student_id, exam_id, subject_id);
    return row ? JSON.parse(row.questionData) : [];
  });
};
