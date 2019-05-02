const fs = require('fs')
const path = require('path')

const seedDataDir = path.resolve(__dirname, 'data');
const nextFileName = getNextFileName()

let data = []
const prettyData = JSON.stringify(data, null, 2)

fs.writeFileSync(`${seedDataDir}/${nextFileName}`, prettyData, 'utf8');

function getNextFileName() {
  const items = fs.readdirSync(seedDataDir)
  let nextIdx = 0
  if (items.length > 0) {
    for(let i in items) {
      const fileName = items[i]
      if (fileName.indexOf('data_') >= 0 && fileName.indexOf('.json') >=0) {
        let idx = parseInt(fileName.replace('data_', '').replace('.json', ''))
        if (idx > nextIdx) nextIdx = idx
      }
    }
    nextIdx = nextIdx + 1
  }
  return `data_${nextIdx}.json`
}
