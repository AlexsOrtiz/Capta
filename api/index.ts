// Vercel serverless function handler
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/index';

export default async (req: VercelRequest, res: VercelResponse) => {
  return app(req, res);
};
