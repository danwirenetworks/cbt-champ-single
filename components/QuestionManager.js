"use client";
import { useState, useEffect } from "react";

export default function QuestionManager({ selectedExam, selectedSubject }) {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
  });

  useEffect(() => {
    if (!selectedSubject) return;
    (async () => {
      const data = await window.electronAPI.get_questions(selectedSubject.id);
      setQuestions(data);
    })();
  }, [selectedSubject]);

  const handleAdd = async () => {
    const payload = {
      subject_id: selectedSubject.id,
      question: newQuestion.question,
      option_a: newQuestion.optionA,
      option_b: newQuestion.optionB,
      option_c: newQuestion.optionC,
      option_d: newQuestion.optionD,
      correct_option: newQuestion.correctOption,
    };
    const res = await window.electronAPI.add_question(payload);
    if (!res.error) {
      const updated = await window.electronAPI.get_questions(selectedSubject.id);
      setQuestions(updated);
      setNewQuestion({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctOption: "A",
      });
    }
  };

  if (!selectedSubject) return null;

  return (
    <div className="border rounded p-4 bg-white shadow mt-6">
      <h2 className="font-bold text-lg mb-4">❓ Questions for {selectedSubject.name}</h2>

      {/* ➕ Add Question */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Question"
          value={newQuestion.question}
          onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
          className="border p-2 rounded col-span-2"
        />
        {["A", "B", "C", "D"].map((opt) => (
          <input
            key={opt}
            type="text"
            placeholder={`Option ${opt}`}
            value={newQuestion[`option${opt}`]}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, [`option${opt}`]: e.target.value })
            }
            className="border p-2 rounded"
          />
        ))}
        <select
          value={newQuestion.correctOption}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, correctOption: e.target.value })
          }
          className="border p-2 rounded col-span-2"
        >
          <option value="A">Correct Option: A</option>
          <option value="B">Correct Option: B</option>
          <option value="C">Correct Option: C</option>
          <option value="D">Correct Option: D</option>
        </select>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-2"
        >
          Add Question
        </button>
      </div>

      {/* 📋 Question List */}
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Question</th>
            <th className="py-2">Correct</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id} className="border-b">
              <td className="py-2">{q.question}</td>
              <td className="py-2">{q.correctOption}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}