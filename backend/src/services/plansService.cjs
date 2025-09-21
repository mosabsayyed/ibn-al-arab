const fs = require('fs')
const path = require('path')

exports.listPlans = function() {
  // __dirname: backend/src/services -> want backend/data/plans.json
  const file = path.join(__dirname, '..', '..', 'data', 'plans.json')
  const raw = fs.readFileSync(file, 'utf-8')
  return JSON.parse(raw)
}
