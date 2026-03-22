import React from "react";
import HeroAvatar from "./HeroAvatar";

export default function HeroCard({ hero, title, highlight }) {
  if (!hero) return null;

  const getScoreColor = (score = 0) => {
    if (score > 800) return "#22c55e";
    if (score > 400) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className={`hero-card fade-in ${highlight ? "highlight" : ""}`} style={{ position: "relative" }}>
      {/* HEADER */}
      <div className="hero-header">
        <h3>{title}</h3>
        <span
          className="hero-score"
          style={{ color: getScoreColor(hero.score) }}
        >
          {hero.score?.toFixed(0)} pts
        </span>
      </div>

      {/* NAME */}
      <h2 className="hero-name glow">{hero.name}</h2>


      {/* AVATAR */}
      <div className="hero-image">
        <HeroAvatar hero={hero} size={110} />
      </div>

      {/* STATS */}
      <div className="hero-stats">
        <Stat label="⚡ Speed" value={hero.speed} />
        <Stat label="💪 Strength" value={hero.strength} />
        <Stat label="🧠 Intelligence" value={hero.intelligence} />
        <Stat label="🛡 Defense" value={hero.defense} />
        <Stat label="✨ Magic" value={hero.magic} />
        <Stat label="😈 Evilness" value={hero.evilness} />
      </div>

      {/* GRID INFO */}
      <div className="hero-grid">
        <Info label="Power" value={hero.power} />
        <Info label="Personality" value={hero.personality} />
        <Info label="Hometown" value={hero.hometown} />
        <Info label="Age" value={hero.age.toFixed(0)} />
        <Info label="Height" value={hero.height} />
        <Info label="Weight" value={hero.weight.toFixed(0)} />
        <Info label="Favorite Color" value={hero.favoriteColor} />
      </div>

      {/* TAGS */}
      <div className="hero-tags">
        {!hero.isVillain && <span className="tag hero">🦸 Hero</span>}
        {hero.isHero && <span className="tag">🦸 Hero</span>}
        {hero.isVillain && <span className="tag villain">😈 Villain</span>}
        {hero.isHuman && <span className="tag">👤 Human</span>}
        {hero.isLiving && <span className="tag">❤️ Living</span>}
      </div>

      {/* EXPLANATION */}
      {hero.explanation && (
        <div className="hero-explanation">
          <strong> Match Explanation:</strong>
          <p>{hero.explanation}</p>
        </div>
      )}

      {/* WEAKNESS */}
      <div className="hero-weakness">
        <strong>Weakness:</strong>
        <p>{hero.weakness}</p>
      </div>
    </div>
  );
}

function Stat({ label, value = 0 }) {
  const raw = Number(value || 0);
  const percent = raw > 100 ? 100 : raw <= 10 ? raw * 10 : raw;

  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-bar">
        <div
          className="stat-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function Info({ label, value }) {
  if (!value) return null;

  return (
    <div className="hero-info">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}