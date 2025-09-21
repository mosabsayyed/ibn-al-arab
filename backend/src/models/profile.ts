export type Profile = {
  id: string
  full_name: string
  phone: string
  email?: string
}

export function validateProfile(p: Partial<Profile>) {
  if (!p.id) throw new Error('id required')
  if (!p.full_name) throw new Error('full_name required')
}
