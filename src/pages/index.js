import * as React from "react"
import { useState, useEffect } from "react"
import { parseCSVtoJSON } from "../utils/csvParser.js"
import scoreCharacter from "../utils/matching.js"
import "./index.css"


/// User preferences with dynamic clamping for stat preferences
///
/// statPreferences: weights for how important each stat is (higher = more important) (0-10)
/// boolPreferences: which boolean flags the user wants to match (e.g. isVillain: true)
/// penalties: stats where lower is better (e.g. evilness, corruption)
/// randomness: how much to shuffle scores to prevent ties (0-1, higher = more random)
const userPreferences = {
  statPreferences: new Proxy({
    speed:        7, 
    intelligence:  10,  
    defense:       5,  
    magic:         3,  
    strength:      1,  
  }, {
    // Automatically handles situations where the value of a stat is set outside the 0-10 range
    set(target, prop, value) {
      target[prop] = value > 10 ? 10 : (value < 0 ? 0 : value);
      return true;
    }
  }),
  boolPreferences: {
    isVillain: true,   
    isLiving:  false, 
    isHuman:   false,
  },
  penalties: {
    evilness:  1,  // Penalise high evilness heavily
    corrupted: 1,  // Some corruption is okay but not a lot
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


const IndexPage = () => {
  const [heroes, setHeroes] = useState([])
  const [answers, setAnswers] = useState({})
  const [filteredHeroes, setFilteredHeroes] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [personalityOptions, setPersonalityOptions] = useState([])

  useEffect(() => {
    parseCSVtoJSON().then(data => {
      setHeroes(data);
      const personalities = [...new Set(data.map(h => h.personality).filter(Boolean))];
      setPersonalityOptions(personalities.sort());
    }).catch(err => console.error("Error loading CSV:", err));
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

    // Score the filtered heroes using the new algorithm
    const scoredHeroes = heroes.map(hero => ({
      ...hero,
      score: scoreCharacter(hero, userPreferences)
    })).sort((a, b) => b.score - a.score)

    setFilteredHeroes(scoredHeroes)
    setSubmitted(true)
  }

  const perfectHero = filteredHeroes.length > 0 ? filteredHeroes[0] : null

  const leastPerfectHero = filteredHeroes.length > 0 ? filteredHeroes[filteredHeroes.length - 1] : null

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
                <h3>🌟 Perfect Hero (Highest Score)</h3>
                <p><strong>Name:</strong>        {perfectHero.name}</p>
                <p><strong>Power:</strong>       {perfectHero.power}</p>
                <p><strong>Score:</strong>       {perfectHero.score.toFixed(2)}</p>
                <p><strong>Personality:</strong> {perfectHero.personality}</p>
                <p><strong>Hometown:</strong>    {perfectHero.hometown}</p>
                <p><strong>Weakness:</strong>    {perfectHero.weakness}</p>
              </div>
              <div className="hero-card">
                <h3>⚠️ Least Perfect Hero (Lowest Score)</h3>
                <p><strong>Name:</strong>        {leastPerfectHero.name}</p>
                <p><strong>Power:</strong>       {leastPerfectHero.power}</p>
                <p><strong>Score:</strong>       {leastPerfectHero.score.toFixed(2)}</p>
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
                      <th>Score</th>
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
                        <td>{hero.score.toFixed(2)}</td>
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