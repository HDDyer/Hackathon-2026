import * as React from "react"
import { useState, useEffect } from "react"
import { parseCSVtoJSON } from "../utils/csvParser.js"
import scoreCharacter from "../utils/matching.js"
import "../styles/index.css"
import HeroCard from "../components/HeroCard"

import questions from "../constants/questions.js"
import defaultCharacterPreferences from "../constants/defaultCharacterPreferences.js"
import Quiz from "../components/Quiz.js"
import Navbar from "../components/Navbar.js"

const IndexPage = () => {
  const [heroes, setHeroes] = useState([])
  const [filteredHeroes, setFilteredHeroes] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userPreferences, setUserPreferences] = useState(defaultCharacterPreferences)

  useEffect(() => {
    parseCSVtoJSON()
      .then(data => setHeroes(data))
      .catch(err => console.error("Error loading CSV:", err))
  }, [])

  const [answers, setAnswers] = useState({})

  const handleAnswerChange = (questionId, value, updatePreferences = {}) => {
    const previousSelection = answers[questionId]
    const isDeselect = previousSelection === value

    setAnswers(prev => {
      const next = { ...prev }
      if (isDeselect) delete next[questionId]
      else next[questionId] = value
      return next
    })

    setUserPreferences(prev => {
      const nextBool = { ...(prev.boolPreferences ?? {}) }
      const nextStat = { ...(prev.statPreferences ?? {}) }

      const apply = (prefs, dir = 1) => {
        if (!prefs) return

        if (prefs.boolPreferences) {
          for (const [k, v] of Object.entries(prefs.boolPreferences)) {
            nextBool[k] = dir === 1 ? v : false
          }
        }

        if (prefs.statPreferences) {
          for (const [k, v] of Object.entries(prefs.statPreferences)) {
            const val = (nextStat[k] ?? 0) + dir * Number(v)
            nextStat[k] = Math.max(-10, Math.min(10, val))
          }
        }
      }

      const prevQ = questions.find(q => q.id === questionId)
      const prevOpt = prevQ?.options?.find(o => o.value === previousSelection)

      if (isDeselect && prevOpt?.updatePreferences) {
        apply(prevOpt.updatePreferences, -1)
      } else {
        if (prevOpt?.updatePreferences) apply(prevOpt.updatePreferences, -1)
        apply(updatePreferences, 1)
      }

      return {
        ...prev,
        boolPreferences: nextBool,
        statPreferences: nextStat,
      }
    })
  }

  const runScoring = () => {
    const scored = heroes
      .map(h => ({
        ...h,
        score: scoreCharacter(h, userPreferences),
      }))
      .sort((a, b) => b.score - a.score)

    setFilteredHeroes(scored)
    setSubmitted(true)
  }

  const handleQuizComplete = () => {
    setLoading(true)
    setTimeout(() => {
      runScoring()
      setLoading(false)
    }, 1200)
  }

  const resetQuiz = () => {
    setAnswers({})
    setUserPreferences(defaultCharacterPreferences)
    setFilteredHeroes([])
    setSubmitted(false)
  }

  // ===== NEW FEATURES =====

  const getTopHeroes = () => filteredHeroes.slice(0, 3)

  const getPersonalityType = () => {
    const stats = userPreferences.statPreferences || {}

    if (stats.intelligence > 4) return "🧠 Strategic Genius"
    if (stats.strength > 4) return "💪 Power Fighter"
    if (stats.speed > 4) return "⚡ Speedster"
    if (stats.magic > 4) return "✨ Mystic User"
    return "⚖️ Balanced Hero"
  }

  const getExplanation = (hero) => {
    const prefs = userPreferences.statPreferences || {}

    let reasons = []

    if (prefs.speed > 3) reasons.push("high speed")
    if (prefs.strength > 3) reasons.push("strong power")
    if (prefs.intelligence > 3) reasons.push("high intelligence")
    if (prefs.magic > 3) reasons.push("magical ability")

    return `This hero matches your preference for ${reasons.join(", ")}.`
  }

  const topHeroes = getTopHeroes()
  const leastPerfectHero = filteredHeroes[filteredHeroes.length - 1]

  return (
    <div className="container">
      <main className="page">
        <Navbar />

        <section className="hero-section">
          <h1 className="heading">🦸 Superhero Matchmaker</h1>
          <p className="subheading">
            Answer a few questions and discover your perfect hero match
          </p>
        </section>

        {!submitted && !loading && (
          <Quiz
            questions={questions}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onComplete={handleQuizComplete}
          />
        )}

        {loading && (
          <div className="loading">
            🤖 Analyzing your personality...
          </div>
        )}

        {submitted && (
          <section className="results">
            <div className="personality">
              Your Type: {getPersonalityType()}
            </div>
            <div className="top-heroes">
              {topHeroes.map((hero, index) => (
                <HeroCard
                  key={index}
                  hero={{ ...hero, explanation: getExplanation(hero) }}
                  title={`#${index + 1} Match`}
                  highlight={index === 0}
                />
              ))}
            </div>

            {leastPerfectHero && (
              <HeroCard hero={leastPerfectHero} title="⚠️ Least Match" />
            )}

            <div className="actions">
              <button className="primary-btn" onClick={resetQuiz}>
                🔄 Try Again
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default IndexPage
export const Head = () => <title>Superhero Search Engine</title>