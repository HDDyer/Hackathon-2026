import React, { useEffect, useMemo, useState } from "react";
import "./Quiz.css";

const Quiz = ({
  questions,
  answers,
  onAnswerChange,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const question = questions?.[currentIndex];

  const [localValue, setLocalValue] = useState(answers?.[question?.id] ?? "");

  useEffect(() => {
    setLocalValue(answers?.[question?.id] ?? "");
  }, [question, answers]);

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
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          Question {currentIndex + 1} / {questions.length}
        </div>
        <h2 className="quiz-prompt">{question.prompt}</h2>
      </div>

      {question.type === "radio" && (
        <div className="quiz-options">
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

      {/* 
      // CURRENTLY NOT USED - we only have radio questions, but this is a framework for future question types
      
      {(question.type === "number" || question.type === "text") && (
        <div className="quiz-input">
          <input
            type={question.type}
            min={question.min}
            max={question.max}
            step={question.step}
            placeholder={question.placeholder || "Enter value"}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
          />
          <button
            type="button"
            disabled={localValue === "" || localValue === null}
            onClick={() => handleAdvance(localValue, question.updatePreferences)}
          >
            {isLastQuestion ? "Finish Quiz" : "Next"}
          </button>
        </div>
      )} */}

      {!question.type && (
        <p>Unsupported question type: {question.type}</p>
      )}
    </div>
  );
};

export default Quiz;
