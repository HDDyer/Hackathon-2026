
/// User preferences with default values
///
/// statPreferences: weights for how important each stat is (higher = more important) (0-10)
/// boolPreferences: which boolean flags the user wants to match (e.g. isVillain: true)
/// randomness: how much to shuffle scores to prevent ties (0-1, higher = more random)
const defaultCharacterPreferences = {
  statPreferences: {
    power:        1,  // was 1
    speed:        1,  // was 1
    intelligence: 1,  // was 1
    defense:      1,  // was 1
    magic:        1,  // was 1
    strength:     1,  // was 1
    evilness:     0,
    corrupted:    0,
  },
  boolPreferences: {
    isVillain:   null,  // true = want villains, false = want heroes, null = don't care
    isLiving:    null,  // true = want living characters, false = want deceased, null = don't care
    isHuman:     null,  // true = want humans, false = want non-humans, null = don't care
  },
  randomness: 0,  // Small shuffle so close scores vary a bit
};

export default defaultCharacterPreferences;