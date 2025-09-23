import { listActivePlans } from '../services/plansService.js';

// This is a placeholder for an Express-like API handler.
// The actual implementation will depend on the server framework used (e.g., Express, Fastify).
export async function getPlansHandler(req: any, res: any) {
  try {
    const plans = await listActivePlans();
    res.status(200).json(plans);
  } catch (error) {
    console.error('Error in getPlansHandler:', error);
    res.status(500).json({ message: 'An error occurred while fetching plans.' });
  }
}
