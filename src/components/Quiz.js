import React, {useMemo, useState } from "react";
import "../styles/index.css";

const Quiz = ({
  questions,
  answers,
  onAnswerChange,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const question = questions?.[currentIndex];

  const isLastQuestion = useMemo(
    () => currentIndex >= questions.length - 1,
    [currentIndex, questions.length]
  );

  const handleAdvance = (selectedValue, updatePreferences) => {
    onAnswerChange(question.id, selectedValue, updatePreferences);

    if (isLastQuestion) {
      onComplete?.();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (!question) {
    return (
      <div className="quiz-empty">
        <p>No questions available.</p>
      </div>
    );
  }

  return (
    <div className="quiz-container fade-in">
      <div className="quiz-header">
        <div className="quiz-progress">
          Question {currentIndex + 1} / {questions.length}
        </div>

        {/* PROGRESS BAR */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <h2 className="quiz-prompt fade-slide">
          {question.prompt}
        </h2>
      </div>

      {question.type === "radio" && (
        <div className="quiz-options fade-slide">
          {question.options.map((opt) => (
            <button
              key={`${question.id}-${opt.value}`}
              type="button"
              className={`quiz-option ${answers[question.id] === opt.value ? "selected" : ""}`}
              onClick={() => handleAdvance(opt.value, opt.updatePreferences)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {!question.type && (
        <p>Unsupported question type: {question.type}</p>
      )}
    </div>
  );
};

export default Quiz;
