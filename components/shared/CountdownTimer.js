"use client";
import { useEffect, useState } from "react";

export default function CountdownTimer({ durationMinutes, onTimeout }) {
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  const [alertedHalfway, setAlertedHalfway] = useState(false);
  const [alertedFiveMin, setAlertedFiveMin] = useState(false);
  const [alertedOneMin, setAlertedOneMin] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeout?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onTimeout]);

  useEffect(() => {
    if (!alertedHalfway && secondsLeft === Math.floor(totalSeconds / 2)) {
      alert("⏳ You’re halfway through your time.");
      setAlertedHalfway(true);
    }
    if (!alertedFiveMin && secondsLeft === 5 * 60) {
      alert("⚠️ Only 5 minutes remaining!");
      setAlertedFiveMin(true);
    }
    if (!alertedOneMin && secondsLeft === 60) {
      alert("🚨 Final minute! Wrap up your answers.");
      setAlertedOneMin(true);
    }
  }, [secondsLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const isBlinking = secondsLeft <= 60;

  return (
    <div className="bg-white p-4 shadow sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <div
          className={`text-lg font-bold ${
            isBlinking ? "text-red-600 animate-pulse" : "text-gray-800"
          }`}
        >
          ⏳ Time Left: {formatTime(secondsLeft)}
        </div>
      </div>
      <div className="h-2 w-full bg-gray-300 mt-2 rounded">
        <div
          className="h-full bg-red-500 rounded transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}