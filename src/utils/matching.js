
/// Scores a character based on user preferences. Higher score = better match.
export default function scoreCharacter(char, prefs) {
  const weightMap = {
    isVillain:   7,
    isLiving:    9,
    isHuman:     5,
    isEmployed:  3,
  };

  let score = 0;

  for (const [stat, weight] of Object.entries(prefs.statPreferences ?? {})) {
    // Multiply the character's stat by the user's weight for that stat
    score += (char[stat] ?? 0) * weight;
  }

  for (const [flag, desired] of Object.entries(prefs.boolPreferences ?? {})) {
    const w = weightMap[flag] ?? 5;
    if (char[flag] === desired) {
      score += 20 * w;
    }
  }

  // Jitter: prevents ties from always resolving the same way
  const maxPossible =
    Object.values(prefs.statPreferences ?? {}).reduce((sum, w) => sum + 100 * w, 0) +
    Object.keys(prefs.boolPreferences ?? {}).length * 100 * 9;

  const jitterRange = maxPossible * (prefs.randomness ?? 0.1);
  score += (Math.random() - 0.5) * jitterRange;

  return score;
}