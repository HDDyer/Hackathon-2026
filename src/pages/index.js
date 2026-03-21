import * as React from "react"
import { useState, useEffect } from "react"
import Papa from "papaparse"
import "./index.css"

const USER_PREFERENCES = {
  stat_preferences: {
    Speed:        0,  // 0-10
    Intelligence:  0,  
    Defense:       0,  
    Magic:         0,  
    Strength:      0,  
  },
  bool_preferences: {
    isVillain: true,   
    isLiving:  false, 
    isHuman:   false,
  },
  penalties: {
    Evilness:  0,  // Penalise high evilness heavily
    Corrupted: 0,  // Some corruption is okay but not a lot
  },
  randomness: 0.05,  // Small shuffle so close scores vary a bit
};

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
  }
]

const normalizeHero = (raw) => (
  {
  name:          raw.Name,
  power:         raw.Power,
  strength:      raw.Strength,
  magic:         raw.Magic,
  intelligence:  raw.Intelligence,
  speed:         raw.Speed,
  defense:       raw.Defense,
  poison:        raw.Poison,
  rage:          raw.Rage,
  corrupted:     raw.Corrupted,
  evilness:      raw.Evilness,
  age:           raw.Age,
  personality:   raw.Personality.trim(),
  hometown:      raw.Hometown.trim(),
  favoriteColor: raw.Favorite_Color.trim(),
  weakness:      raw.Weakness.trim(),
  height:        raw.Height.trim(),
  weight:        raw.Weight,
  isVillain:     raw.isVillain  === "True",
  isLiving:      raw.isLiving   === "True",
  isEmployed:    raw.isEmployed === "True",
  isHuman:       raw.isHuman    === "True",
})

const matchHero = (hero, userQuery) => {
  if (userQuery.wantsVillain !== null && hero.isVillain !== userQuery.wantsVillain) return false
  if (userQuery.wantsHuman   !== null && hero.isHuman   !== userQuery.wantsHuman)   return false
  if (hero.power        < userQuery.minPower)       return false
  if (hero.intelligence < userQuery.minIntelligence) return false
  if (hero.speed        < userQuery.minSpeed)        return false
  if (userQuery.personality && hero.personality !== userQuery.personality) return false
  return true
}

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
          transformHeader: (header) => header.trim(),  
          complete: (result) => {
            const data = result.data.map(normalizeHero)  // normalize on load\
            setHeroes(data)
            const personalities = [...new Set(data.map(h => h.personality).filter(Boolean))]
            setPersonalityOptions(personalities.sort())
          }
        })
      })
      .catch(err => console.error("Error loading CSV:", err))
  }, [])

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const userQuery = {
      wantsVillain:    answers.isVillain        ?? null,
      wantsHuman:      answers.isHuman          ?? null,
      minPower:        answers.minPower         ?? 0,
      minIntelligence: answers.minIntelligence  ?? 0,
      minSpeed:        answers.minSpeed         ?? 0,
      personality:     answers.personality      || null,
    }

    console.log("User query:", JSON.stringify(userQuery, null, 2))

    const filtered = heroes.filter(h => matchHero(h, userQuery))

    console.log("Matched heroes:", filtered)
    setFilteredHeroes(filtered)
    setSubmitted(true)
  }

  const perfectHero = filteredHeroes.length > 0
    ? filteredHeroes.reduce((best, cur) => cur.power > best.power ? cur : best)
    : null

  const leastPerfectHero = filteredHeroes.length > 0
    ? filteredHeroes.reduce((worst, cur) => cur.power < worst.power ? cur : worst)
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
                <p><strong>Name:</strong>        {perfectHero.name}</p>
                <p><strong>Power:</strong>       {perfectHero.power}</p>
                <p><strong>Personality:</strong> {perfectHero.personality}</p>
                <p><strong>Hometown:</strong>    {perfectHero.hometown}</p>
                <p><strong>Weakness:</strong>    {perfectHero.weakness}</p>
              </div>
              <div className="hero-card">
                <h3>⚠️ Least Perfect Hero (Lowest Power)</h3>
                <p><strong>Name:</strong>        {leastPerfectHero.name}</p>
                <p><strong>Power:</strong>       {leastPerfectHero.power}</p>
                <p><strong>Personality:</strong> {leastPerfectHero.personality}</p>
                <p><strong>Hometown:</strong>    {leastPerfectHero.hometown}</p>
                <p><strong>Weakness:</strong>    {leastPerfectHero.weakness}</p>
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
                        <td>{hero.name}</td>
                        <td>{hero.power}</td>
                        <td>{hero.intelligence}</td>
                        <td>{hero.speed}</td>
                        <td>{hero.personality}</td>
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