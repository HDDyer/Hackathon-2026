import * as React from "react"
import { useState } from "react"
import "./index.css"

const questions = [
  {
    prompt: "What is Gatsby?",
    answers: [
      "A React-based open source framework for creating websites and apps.",
      "A type of coffee.",
      "A character in a novel by F. Scott Fitzgerald.",
    ]
  },
  {
    prompt: "What is React?",
    answers: [
      "A JavaScript library for building user interfaces.",
      "A type of chemical reaction.",
    ]
  }
]

const IndexPage = () => {
  const [answers, setAnswers] = useState({})

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitted answers:", answers)
  }

  return (
    <main className="page">
      <h1 className="heading">
        Welcome!
      </h1>
      <form onSubmit={handleSubmit}>
        {
          questions.map((q, index) => (
            <div key={index} className="question">
              <h2>{q.prompt}</h2>
              {q.answers.map((a, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={a}
                    checked={answers[index] === a}
                    onChange={() => handleAnswerChange(index, a)}
                  />
                  {a}
                </label>
              ))}
            </div>
          ))
        }
        <button type="submit">Submit</button>
      </form>
    </main>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
