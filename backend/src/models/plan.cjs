exports.validatePlan = function(p) {
  if (!p || !p.id) throw new Error('id required')
  if (!p.name) throw new Error('name required')
}
