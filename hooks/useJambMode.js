import { useState, useMemo } from "react";

export function useJambMode(subjects) {
  const englishSubject = useMemo(
    () => subjects.find((s) => s.name.toLowerCase().includes("english")),
    [subjects]
  );

  const otherSubjects = useMemo(
    () => subjects.filter((s) => !s.name.toLowerCase().includes("english")),
    [subjects]
  );

  const [selectedSingle, setSelectedSingle] = useState(null);
  const [selectedSession, setSelectedSession] = useState([]);

  const hasValidDuration = (subject) => {
    const duration = parseInt(subject.duration, 10);
    return !isNaN(duration) && duration > 0;
  };

  const toggleSessionSubject = (id) => {
    setSelectedSession((prev) =>
      prev.includes(id)
        ? prev.filter((sid) => sid !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  return {
    englishSubject,
    otherSubjects,
    selectedSingle,
    setSelectedSingle,
    selectedSession,
    toggleSessionSubject,
    hasValidDuration,
  };
}
