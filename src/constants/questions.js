export default [
  {
    id: "characterType",
    prompt: "Hero or Villain?",
    type: "radio",
    options: [
      { 
        value: false, 
        label: "Hero", 
        updatePreferences: { boolPreferences: { isVillain: false }, statPreferences: { evilness: 0, corrupted: 0 } }
        },
      { 
        value: true, 
        label: "Villain",
        updatePreferences: {
             boolPreferences: { isVillain: true }, 
             statPreferences: { evilness: 5, corrupted: 5 } 
        }
    }
    ]
  },
  {
    id: "isHuman",
    prompt: "Do you want them to be human?",
    type: "radio",
    options: [
        { value: true, label: "Yes", updatePreferences: { statPreferences: { evilness: 0, corrupted: 0 } } },
        { value: false, label: "No", updatePreferences: { statPreferences: { evilness: 0, corrupted: 0 } } }
    ]
  }
]

