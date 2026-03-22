{
  id: "prefSpeed",
  prompt: "Should they be extremely fast?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { speed: 5 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: { speed: 0 } } }
  ]
},
{
  id: "prefStrength",
  prompt: "Should they be physically powerful?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { strength: 5 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: { strength: 0 } } }
  ]
},
{
  id: "prefIntelligence",
  prompt: "Should they rely on intelligence?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { intelligence: 5 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: { intelligence: 0 } } }
  ]
},
{
  id: "prefDefense",
  prompt: "Should they be highly durable or defensive?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { defense: 5 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: { defense: 0 } } }
  ]
},
{
  id: "prefMagic",
  prompt: "Should they use magic or supernatural abilities?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { magic: 5 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: { magic: 0 } } }
  ]
},
{
  id: "prefEvilness",
  prompt: "Do you want them to lean toward being evil?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { evilness: 5 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: { evilness: 0 } } }
  ]
},
{
  id: "prefCorruption",
  prompt: "Should they be corrupted or morally conflicted?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { corrupted: 5 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: { corrupted: 0 } } }
  ]
},
{
  id: "isLiving",
  prompt: "Should the character be alive?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { boolPreferences: { isLiving: true } } },
    { value: false, label: "No", updatePreferences: { boolPreferences: { isLiving: false } } }
  ]
},
{
  id: "balancedStats",
  prompt: "Do you want a balanced character instead of a specialist?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { speed: 2, strength: 2, intelligence: 2, defense: 2, magic: 2 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: {} } }
  ]
},
{
  id: "glassCannon",
  prompt: "Should they deal high damage but have low defense?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { strength: 5, defense: 0 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: {} } }
  ]
},
{
  id: "tank",
  prompt: "Should they be more of a tank (high defense, lower speed)?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { defense: 5, speed: 0 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: {} } }
  ]
},
{
  id: "speedster",
  prompt: "Do you want a speed-focused character?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { speed: 5, strength: 1 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: {} } }
  ]
},
{
  id: "brute",
  prompt: "Do you want a brute-force fighter?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { strength: 5, intelligence: 0 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: {} } }
  ]
},
{
  id: "geniusType",
  prompt: "Do you prefer a genius-type character?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { intelligence: 5, strength: 0 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: {} } }
  ]
},
{
  id: "darkCharacter",
  prompt: "Should the character have a dark personality?",
  type: "radio",
  options: [
    { value: true, label: "Yes", updatePreferences: { statPreferences: { evilness: 4, corrupted: 4 } } },
    { value: false, label: "No", updatePreferences: { statPreferences: { evilness: 0, corrupted: 0 } } }
  ]
}