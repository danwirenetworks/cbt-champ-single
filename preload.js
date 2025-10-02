const { contextBridge, ipcRenderer } = require("electron");

function safeInvoke(channel, args) {
  return ipcRenderer.invoke(channel, args).catch((err) => {
    console.error(`Error invoking ${channel}:`, err);
    return { error: err.message };
  });
}

contextBridge.exposeInMainWorld("electronAPI", {
  /* Exams */
  get_exams: () => safeInvoke("get_exams"),
  add_exam: (name) => safeInvoke("add_exam", name),
  edit_exam: ({ id, name }) => safeInvoke("edit_exam", { id, name }),
  delete_exam: (id) => safeInvoke("delete_exam", id),

  /* Subjects */
  get_subjects: (examId) => safeInvoke("get_subjects", examId),
  add_subject: ({ exam_id, name }) => safeInvoke("add_subject", { exam_id, name }),
  edit_subject: ({ id, name }) => safeInvoke("edit_subject", { id, name }),
  delete_subject: (id) => safeInvoke("delete_subject", id),

  /* Questions */
  get_questions: (subjectId) => safeInvoke("get_questions", subjectId),
  add_question: (data) => safeInvoke("add_question", data),
  edit_question: (data) => safeInvoke("edit_question", data),
  delete_question: (id) => safeInvoke("delete_question", id),

  /* Answers (Student page) */
  save_answer: (data) => safeInvoke("save_answer", data),
});
