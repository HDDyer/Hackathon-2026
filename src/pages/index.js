import * as React from "react"
import { useState, useEffect } from "react"
import Papa from "papaparse"
import "./index.css"

const questions = [
  {
    id: "isVillain",
    prompt: "Do you want a hero or a villain?",
    type: "radio",
    options: [
      { value: false, label: "Hero" },
      { value: true, label: "Villain" }
    ]
  },
  {
    id: "isHuman",
    prompt: "Should the character be human?",
    type: "radio",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" }
    ]
  },
  {
    id: "minPower",
    prompt: "Minimum Power level (0-100)",
    type: "number",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0
  },
  {
    id: "minIntelligence",
    prompt: "Minimum Intelligence (0-100)",
    type: "number",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0
  },
  {
    id: "personality",
    prompt: "Preferred Personality (optional)",
    type: "select",
    options: []
  },
  {
    id: "minSpeed",
    prompt: "Minimum Speed (0-100)",
    type: "number",
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0
  },
  {
    id: "favoriteColor",
    prompt: "Favorite Color (hex code, e.g. 0x09251b)",
    type: "text",
    placeholder: "Leave blank for any"
  }
]

const IndexPage = () => {
  const [heroes, setHeroes] = useState([])
  const [answers, setAnswers] = useState({})
  const [filteredHeroes, setFilteredHeroes] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [personalityOptions, setPersonalityOptions] = useState([])

  useEffect(() => {
    fetch("/data.csv")
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (result) => {
            const data = result.data
            setHeroes(data)
            const personalities = [...new Set(data.map(h => h.Personality).filter(p => p))]
            setPersonalityOptions(personalities.sort())
          }
        })
      })
      .catch(err => console.error("Error loading CSV:", err))
  }, [])

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let filtered = [...heroes]
    if (answers.isVillain !== undefined) {
      filtered = filtered.filter(h => h.isVillain === answers.isVillain)
    }
    if (answers.isHuman !== undefined) {
      filtered = filtered.filter(h => h.isHuman === answers.isHuman)
    }
    if (answers.minPower !== undefined && answers.minPower !== "") {
      filtered = filtered.filter(h => h.Power >= Number(answers.minPower))
    }
    if (answers.minIntelligence !== undefined && answers.minIntelligence !== "") {
      filtered = filtered.filter(h => h.Intelligence >= Number(answers.minIntelligence))
    }
    if (answers.personality && answers.personality !== "") {
      filtered = filtered.filter(h => h.Personality === answers.personality)
    }
    if (answers.minSpeed !== undefined && answers.minSpeed !== "") {
      filtered = filtered.filter(h => h.Speed >= Number(answers.minSpeed))
    }
    if (answers.favoriteColor && answers.favoriteColor !== "") {
      filtered = filtered.filter(h => h.Favorite_Color === answers.favoriteColor)
    }
    setFilteredHeroes(filtered)
    setSubmitted(true)
  }

  const perfectHero = filteredHeroes.length > 0
    ? filteredHeroes.reduce((best, current) => current.Power > best.Power ? current : best)
    : null

  const leastPerfectHero = filteredHeroes.length > 0
    ? filteredHeroes.reduce((worst, current) => current.Power < worst.Power ? current : worst)
    : null

  return (
    <main className="page">
      <h1 className="heading">Superhero Matchmaker</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((q, idx) => (
          <div key={idx} className="question">
            <h2>{q.prompt}</h2>
            {q.type === "radio" && (
              <div>
                {q.options.map(opt => (
                  <label key={opt.label} style={{ marginRight: "1rem" }}>
                    <input
                      type="radio"
                      name={q.id}
                      value={opt.value}
                      checked={answers[q.id] === opt.value}
                      onChange={() => handleAnswerChange(q.id, opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            )}
            {q.type === "number" && (
              <input
                type="number"
                min={q.min}
                max={q.max}
                step={q.step}
                defaultValue={q.defaultValue}
                onChange={(e) => handleAnswerChange(q.id, e.target.valueAsNumber)}
              />
            )}
            {q.type === "select" && (
              <select
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                defaultValue=""
              >
                <option value="">-- Any --</option>
                {personalityOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
            {q.type === "text" && (
              <input
                type="text"
                placeholder={q.placeholder}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              />
            )}
          </div>
        ))}
        <button type="submit">Find My Hero</button>
      </form>
      {submitted && (
        <div className="results">
          <h2>Results</h2>
          {filteredHeroes.length === 0 ? (
            <p>No heroes match your criteria. Try loosening some filters.</p>
          ) : (
            <>
              <div className="hero-card">
                <h3>🌟 Perfect Hero (Highest Power)</h3>
                <p><strong>Name:</strong> {perfectHero.Name}</p>
                <p><strong>Power:</strong> {perfectHero.Power}</p>
                <p><strong>Personality:</strong> {perfectHero.Personality}</p>
                <p><strong>Hometown:</strong> {perfectHero.Hometown}</p>
                <p><strong>Weakness:</strong> {perfectHero.Weakness}</p>
              </div>
              <div className="hero-card">
                <h3>⚠️ Least Perfect Hero (Lowest Power)</h3>
                <p><strong>Name:</strong> {leastPerfectHero.Name}</p>
                <p><strong>Power:</strong> {leastPerfectHero.Power}</p>
                <p><strong>Personality:</strong> {leastPerfectHero.Personality}</p>
                <p><strong>Hometown:</strong> {leastPerfectHero.Hometown}</p>
                <p><strong>Weakness:</strong> {leastPerfectHero.Weakness}</p>
              </div>
              <details>
                <summary>Show all matching heroes ({filteredHeroes.length})</summary>
                <table className="hero-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Power</th>
                      <th>Intelligence</th>
                      <th>Speed</th>
                      <th>Personality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHeroes.map((hero, i) => (
                      <tr key={i}>
                        <td>{hero.Name}</td>
                        <td>{hero.Power}</td>
                        <td>{hero.Intelligence}</td>
                        <td>{hero.Speed}</td>
                        <td>{hero.Personality}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </>
          )}
        </div>
      )}
    </main>
  )
}

export default IndexPage

export const Head = () => <title>Superhero Search Engine</title>