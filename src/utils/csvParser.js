import Papa from 'papaparse'

/// Returns a json array of the csv file
export async function parseCSVtoJSON() {
  const response = await fetch('/data.csv')
  const text = await response.text()
  const results = Papa.parse(text)
  return results.data
}
