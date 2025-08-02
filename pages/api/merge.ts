import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';
import ILovePDFFile from '@ilovepdf/ilovepdf-nodejs/ILovePDFFile';

// Disable default body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

// Helper function to clean up files
const cleanupFiles = (files: any[]) => {
  files.forEach((file) => {
    try {
      if (fs.existsSync(file.filepath)) {
        fs.unlinkSync(file.filepath);
      }
    } catch (error) {
      console.error('Error cleaning up file:', error);
    }
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('=== API MERGE ENDPOINT CALLED ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const publicKey = process.env.ILOVE_PUBLIC_KEY;
  const secretKey = process.env.ILOVE_SECRET_KEY;
  
  console.log('Environment variables check:');
  console.log('ILOVE_PUBLIC_KEY exists:', !!publicKey);
  console.log('ILOVE_SECRET_KEY exists:', !!secretKey);
  console.log('Public key length:', publicKey?.length || 0);
  console.log('Secret key length:', secretKey?.length || 0);
  
  if (!publicKey || !secretKey) {
    return res.status(500).json({ 
      error: 'iLovePDF API keys not configured. Please set ILOVE_PUBLIC_KEY and ILOVE_SECRET_KEY in your environment variables.' 
    });
  }

  let uploadedFiles: any[] = [];

  try {
    // Initialize iLovePDF API with your credentials
    console.log('Initializing iLovePDF API...');
    const instance = new ILovePDFApi(publicKey, secretKey);
    
    // Create a new merge task
    console.log('Creating merge task...');
    const task = instance.newTask('merge');

    // Parse the multipart form data
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB limit
    });

    const [fields, files] = await form.parse(req);
    
    // Get uploaded files
    uploadedFiles = Array.isArray(files.files) ? files.files : files.files ? [files.files] : [];
    
    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (uploadedFiles.length < 2) {
      return res.status(400).json({ error: 'At least 2 PDF files are required for merging' });
    }

    console.log(`Processing ${uploadedFiles.length} files...`);

    // Start the task
    console.log('Starting merge task...');
    await task.start();
    console.log('Task started successfully');
    console.log('Remaining files:', task.remainingFiles);

    // Add files to the task
    console.log('Adding files to task...');
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      console.log(`Adding file ${i + 1}: ${file.originalFilename || `file_${i}.pdf`}`);
      
      // Create ILovePDFFile instance from the uploaded file
      const ilovepdfFile = new ILovePDFFile(file.filepath);
      await task.addFile(ilovepdfFile);
      
      console.log(`File ${i + 1} added successfully`);
    }

    // Process the merge
    console.log('Processing merge...');
    await task.process();
    console.log('Merge processing completed');

    // Download the merged PDF
    console.log('Downloading merged PDF...');
    const data = await task.download();
    console.log(`Download completed. File size: ${data.length} bytes`);

    // Clean up temporary files
    cleanupFiles(uploadedFiles);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"');
    res.setHeader('Content-Length', data.length);

    // Send the PDF buffer
    res.send(data);

  } catch (error: any) {
    console.error('Error merging PDFs:', {
      message: error.message,
      stack: error.stack
    });
    
    // Clean up any temporary files in case of error
    cleanupFiles(uploadedFiles);

    // Handle specific iLovePDF errors
    let message = 'Error merging PDFs';
    
    if (error.message) {
      if (error.message.includes('authentication')) {
        message = 'Authentication failed. Please check your API credentials.';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        message = 'API quota exceeded. Please check your iLovePDF account limits.';
      } else if (error.message.includes('file')) {
        message = 'Error processing files. Please ensure all files are valid PDFs.';
      } else if (error.message.includes('timeout')) {
        message = 'Request timed out. Please try with smaller files or try again later.';
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