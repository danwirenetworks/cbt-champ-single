import SubjectManager from "../SubjectManager";

export default function SubjectPanel({
  selectedExam,
  subjects,
  subjectInput,
  setSubjectInput,
  subjectDuration,
  setSubjectDuration,
  questionCount,
  setQuestionCount,
  allowGroupShuffle,
  setAllowGroupShuffle,
  addSubject,
  deleteSubject,
  selectedSubject,
  setSelectedSubject,
  loadQuestions,       // ✅ make sure this is passed from ExamPanel
  setSubTab,           // ✅ needed to switch to "questions" tab
}) {
  return (
    <div className="space-y-4">
      <SubjectManager
        selectedExam={selectedExam}
        subjects={subjects}
        subjectInput={subjectInput}
        setSubjectInput={setSubjectInput}
        subjectDuration={subjectDuration}
        setSubjectDuration={setSubjectDuration}
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        allowGroupShuffle={allowGroupShuffle}
        setAllowGroupShuffle={setAllowGroupShuffle}
        addSubject={addSubject}
        deleteSubject={deleteSubject}
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
        loadQuestions={loadQuestions}     // ✅ forward to SubjectManager
        setSubTab={setSubTab}             // ✅ forward to SubjectManager
      />
    </div>
  );
}
