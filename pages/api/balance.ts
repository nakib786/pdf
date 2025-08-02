import { NextApiRequest, NextApiResponse } from 'next';
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const publicKey = process.env.ILOVE_PUBLIC_KEY;
  const secretKey = process.env.ILOVE_SECRET_KEY;
  
  if (!publicKey || !secretKey) {
    return res.status(500).json({ 
      error: 'iLovePDF API keys not configured' 
    });
  }

  try {
    // Initialize iLovePDF API
    const instance = new ILovePDFApi(publicKey, secretKey);
    
    // Create a dummy task to get remaining files info
    // The remainingFiles property is available on task objects
    const task = instance.newTask('compress');
    await task.start();
    
    // Get remaining files from the task
    const remainingFiles = task.remainingFiles || 0;
    
    // Calculate used credits based on remaining files
    // Assuming free tier has 2500 total credits
    const totalCredits = 2500; // Free tier limit
    const usedCredits = totalCredits - remainingFiles;
    
    const subscriptionInfo = {
      usedCredits: Math.max(0, usedCredits),
      totalCredits: totalCredits,
      plan: 'Free Tier',
      price: '$0'
    };
    
    return res.status(200).json({
      remainingFiles,
      usedCredits: subscriptionInfo.usedCredits,
      totalCredits: subscriptionInfo.totalCredits,
      plan: subscriptionInfo.plan,
      price: subscriptionInfo.price,
      success: true
    });
    
  } catch (error: any) {
    console.error('Error fetching balance:', error);
    
    let message = 'Failed to fetch API balance';
    
    if (error.message) {
      if (error.message.includes('authentication')) {
        message = 'Authentication failed. Please check your API credentials.';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        message = 'Unable to check API quota. Please check your iLovePDF account.';
      } else {
        message = error.message;
      }
    }

    return res.status(500).json({ 
      error: message,
      details: error.message 
    });
  }
} 