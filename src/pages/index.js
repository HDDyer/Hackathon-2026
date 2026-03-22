import * as React from "react"
import { useState, useEffect } from "react"
import { parseCSVtoJSON } from "../utils/csvParser.js"
import scoreCharacter from "../utils/matching.js"
import "./index.css"

import questions from "../constants/questions.js"
import defaultCharacterPreferences from "../constants/defaultCharacterPreferences.js"
import Quiz from "../components/Quiz.js"
import Navbar from "../components/Navbar.js"

const IndexPage = () => {
  const [heroes, setHeroes] = useState([])
  const [filteredHeroes, setFilteredHeroes] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [userPreferences, setUserPreferences] = useState(defaultCharacterPreferences)

 // const [personalityOptions, setPersonalityOptions] = useState([])

  useEffect(() => {
    parseCSVtoJSON().then(data => {
      setHeroes(data);
      // const personalities = [...new Set(data.map(h => h.personality).filter(Boolean))];
      // setPersonalityOptions(personalities.sort());
    }).catch(err => console.error("Error loading CSV:", err));
  }, [])

  const [answers, setAnswers] = useState({})

  const handleAnswerChange = (questionId, value, updatePreferences = {}) => {
    const previousSelection = answers[questionId]
    const isDeselect = previousSelection === value

    setAnswers(prev => {
      const nextAnswers = { ...prev }

      if (isDeselect) {
        delete nextAnswers[questionId]
      } else {
        nextAnswers[questionId] = value
      }

      return nextAnswers
    })

    setUserPreferences(prev => {
      const nextBoolPreferences = { ...(prev.boolPreferences ?? {}) }
      const nextStatPreferences = { ...(prev.statPreferences ?? {}) }
      const nextPenalties = { ...(prev.penalties ?? {}) }

      const testOutsideBounds = (num) => (num < 0 ? 0 : num > 10 ? 10 : num)

      const applyPreferences = (prefs, direction = 1) => {
        if (!prefs) return

        if (prefs.boolPreferences) {
          for (const [flag, newValue] of Object.entries(prefs.boolPreferences)) {
            nextBoolPreferences[flag] = direction === 1 ? newValue : false
          }
        }

        if (prefs.statPreferences) {
          for (const [stat, delta] of Object.entries(prefs.statPreferences)) {
            const candidate = (nextStatPreferences[stat] ?? 0) + direction * Number(delta)
            nextStatPreferences[stat] = testOutsideBounds(candidate)
          }
        }

        if (prefs.penalties) {
          for (const [stat, delta] of Object.entries(prefs.penalties)) {
            const candidate = (nextPenalties[stat] ?? 0) + direction * Number(delta)
            nextPenalties[stat] = candidate
          }
        }
      }

      const prevQuestion = questions.find(q => q.id === questionId)
      const prevOption = prevQuestion?.options?.find(opt => opt.value === previousSelection)

      if (isDeselect && prevOption?.updatePreferences) {
        applyPreferences(prevOption.updatePreferences, -1)
      } else {
        if (prevOption?.updatePreferences) {
          applyPreferences(prevOption.updatePreferences, -1)
        }
        applyPreferences(updatePreferences, 1)
      }

      return {
        ...prev,
        boolPreferences: nextBoolPreferences,
        statPreferences: nextStatPreferences,
        penalties: nextPenalties,
      }
    })
  }

  const runScoring = () => {
    console.log("User Preferences on Submit:", userPreferences)

    const scoredHeroes = heroes
      .map((hero) => ({
        ...hero,
        score: scoreCharacter(hero, userPreferences),
      }))
      .sort((a, b) => b.score - a.score)

    setFilteredHeroes(scoredHeroes)
    setSubmitted(true)
  }

  const handleQuizComplete = () => {
    runScoring()
  }

  const resetQuiz = () => {
    setAnswers({})
    setUserPreferences(defaultCharacterPreferences)
    setFilteredHeroes([])
    setSubmitted(false)
  }

  const perfectHero = filteredHeroes.length > 0 ? filteredHeroes[0] : null

  const leastPerfectHero = filteredHeroes.length > 0 ? filteredHeroes[filteredHeroes.length - 1] : null

  return (
    <div className="container">
    <main className="page">
      <Navbar />
      {!submitted && (
        <Quiz
          questions={questions}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          onComplete={handleQuizComplete}
        />
      )}

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
                <p><strong>Intelligence:</strong> {perfectHero.intelligence}</p>
                <p><strong>Speed:</strong>       {perfectHero.speed}</p>
                <p><strong>Strength:</strong>    {perfectHero.strength}</p>
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
                      <th>Strength</th>
                      <th>Magic</th>
                      <th>Intelligence</th>
                      <th>Speed</th>
                      <th>Defense</th>
                      <th>Poison</th>
                      <th>Rage</th>
                      <th>Evilness</th>
                      <th>Weakness</th>
                      <th>Score</th>
                      <th>Personality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHeroes.map((hero, i) => (
                      <tr key={i}>
                        <td>{hero.name}</td>
                        <td>{hero.power}</td>
                        <td>{hero.strength}</td>
                        <td>{hero.magic}</td>
                        <td>{hero.intelligence}</td>
                        <td>{hero.speed}</td>
                        <td>{hero.defense}</td>
                        <td>{hero.poison}</td>
                        <td>{hero.rage}</td>
                        <td>{hero.evilness}</td>
                        <td>{hero.weakness}</td>
                        <td>{hero.score.toFixed(2)}</td>
                        <td>{hero.personality}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
              <div style={{ marginTop: "1rem" }}>
                <button type="button" onClick={resetQuiz}>
                  Start Over
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </main>
    </div>
  )
}

export default IndexPage

export const Head = () => <title>Superhero Search Engine</title>