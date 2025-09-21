function mkid() { return Math.random().toString(36).slice(2, 10) }

exports.createCheckout = function({ profile_id, plan_id }) {
  if (!profile_id || !plan_id) throw new Error('profile_id and plan_id required')
  return { checkoutId: mkid(), subscription: { id: mkid(), profile_id, plan_id, status: 'pending' } }
}
