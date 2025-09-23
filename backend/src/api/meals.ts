import { supabase } from '../lib/supabase.js'

export async function getMealsHandler(req: any, res: any) {
  try {
    // Select all fields from meals table including the new ingredients column
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('status', 'active')
    
    if (error) {
      console.error('Error fetching meals from Supabase:', error)
      return res.status(500).json({ message: 'Failed to fetch meals from database' })
    }
    
    console.log('✅ Fetched', data?.length, 'active meals from database')
    return res.status(200).json(data)
  } catch (err) {
    console.error('Unexpected error in getMealsHandler:', err)
    return res.status(500).json({ message: 'Unexpected error' })
  }
}

export default getMealsHandler
