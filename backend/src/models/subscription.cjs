exports.validateSubscription = function(s) {
  if (!s || !s.id) throw new Error('id required')
  if (!s.profile_id) throw new Error('profile_id required')
}
