const { contextBridge, ipcRenderer } = require("electron");

/**
 * A helper to safely call IPC methods and log errors.
 */
function safeInvoke(channel, args) {
  return ipcRenderer.invoke(channel, args).catch((err) => {
    console.error(`❌ Error invoking ${channel}:`, err);
    return { error: err.message };
  });
}

contextBridge.exposeInMainWorld("electronAPI", {
  /* -------------------- Exams -------------------- */
  get_exams: () => safeInvoke("get_exams"),
  add_exam: (name) => safeInvoke("add_exam", name),
  edit_exam: ({ id, name }) => safeInvoke("edit_exam", { id, name }),
  delete_exam: (id) => safeInvoke("delete_exam", id),

  set_exam_duration: ({ id, duration }) =>
    safeInvoke("set_exam_duration", { id, duration }),
  get_exam_duration: (id) => safeInvoke("get_exam_duration", id),

  set_exam_timing_mode: ({ id, mode }) =>
    safeInvoke("set_exam_timing_mode", { id, mode }),

  // ✅ Added missing shuffle mode setter
  set_exam_shuffle_mode: ({ id, mode }) =>
    safeInvoke("set_exam_shuffle_mode", { id, mode }),

  /* -------------------- Subjects -------------------- */
  get_subjects: (exam_id) => safeInvoke("get_subjects", exam_id),
  add_subject: ({ exam_id, name, duration, questionCount, allowGroupShuffle }) =>
    safeInvoke("add_subject", { exam_id, name, duration, questionCount, allowGroupShuffle }),
  edit_subject: ({ id, name, duration }) =>
    safeInvoke("edit_subject", { id, name, duration }),
  set_subject_duration: ({ id, duration }) =>
    safeInvoke("set_subject_duration", { id, duration }),
  delete_subject: (id) => safeInvoke("delete_subject", id),

  /* -------------------- Questions -------------------- */
  get_questions: (subjectId) => safeInvoke("get_questions", subjectId),
  add_question: (data) => safeInvoke("add_question", data),
  edit_question: (data) => safeInvoke("edit_question", data),
  delete_question: (id) => safeInvoke("delete_question", id),

  /* -------------------- Answers (Student page) -------------------- */
  save_answer: (data) => safeInvoke("save_answer", data),
  save_answers_bulk: (data) => safeInvoke("save_answers_bulk", data),

  /* -------------------- Candidates -------------------- */
  get_candidates: () => safeInvoke("get_candidates"),
  add_candidate: (data) => safeInvoke("add_candidate", data),
  edit_candidate: (data) => safeInvoke("edit_candidate", data),
  delete_candidate: (id) => safeInvoke("delete_candidate", id),

  /* -------------------- Reports & Misc -------------------- */
  get_reports: () => safeInvoke("get_reports"),
  export_results: (examId) => safeInvoke("export_results", examId),
});
