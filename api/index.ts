// Vercel serverless function handler
import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import app from '../src/index';

// Convert Express app to Vercel serverless function
export default async (req: VercelRequest, res: VercelResponse) => {
  // Pass the request through Express
  await new Promise((resolve, reject) => {
    app(req as any, res as any, (err: any) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
};
