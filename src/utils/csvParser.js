import Papa from 'papaparse'

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
  isVillain:     raw.isVillain  === " True",
  isLiving:      raw.isLiving   === " True",
  isEmployed:    raw.isEmployed === " True",
  isHuman:       raw.isHuman    === " True",
})


/// Returns a promise that resolves to a json array of the normalized csv data
export function parseCSVtoJSON() {
  return fetch("/data.csv")
    .then(response => response.text())
    .then(csvText => {
      return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),  
          complete: (result) => {
            const data = result.data.map(normalizeHero);
            resolve(data);
          },
          error: reject
        });
      });
    });
}
