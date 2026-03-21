import * as React from "react"
import { parseCSVtoJSON } from "../utils/csvParser.js"

function CSVLoader() {
  parseCSVtoJSON().then(data => {
    console.log(data)
  })

  return <div><p>CSV Data:</p></div>
}

export default CSVLoader

export const Head = () => <title>TEST PAGE</title>

