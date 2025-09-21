exports.validateProfile = function(p) {
  if (!p || !p.id) throw new Error('id required')
  if (!p.full_name) throw new Error('full_name required')
}
