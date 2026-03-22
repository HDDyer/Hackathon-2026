
/// User preferences with default values
///
/// statPreferences: weights for how important each stat is (higher = more important) (0-10)
/// boolPreferences: which boolean flags the user wants to match (e.g. isVillain: true)
/// randomness: how much to shuffle scores to prevent ties (0-1, higher = more random)
export default {
  statPreferences: {
    power:        1, // keep low 
    speed:        1, 
    intelligence:  1,  
    defense:       1,  
    magic:         1,  
    strength:      1,  
    evilness:  0, // the higher the number, the more evil they want 
    corrupted: 0, 
  },
  boolPreferences: {
    isVillain: false,   
    isLiving:  false, 
    isHuman:   false,
  },
  randomness: 0,  // Small shuffle so close scores vary a bit
};
