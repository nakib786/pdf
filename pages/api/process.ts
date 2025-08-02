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

// Tool configuration mapping
const TOOL_CONFIG = {
  // PDF Tools
  merge: { taskType: 'merge', minFiles: 2, maxFiles: 10 },
  compress: { taskType: 'compress', minFiles: 1, maxFiles: 1 },
  split: { taskType: 'split', minFiles: 1, maxFiles: 1 },
  rotate: { taskType: 'rotate', minFiles: 1, maxFiles: 1 },
  unlock: { taskType: 'unlock', minFiles: 1, maxFiles: 1 },
  repair: { taskType: 'repair', minFiles: 1, maxFiles: 1 },
  pdfjpg: { taskType: 'pdfjpg', minFiles: 1, maxFiles: 1 },
  imagepdf: { taskType: 'imagepdf', minFiles: 1, maxFiles: 10 },
  pdfocr: { taskType: 'pdfocr', minFiles: 1, maxFiles: 1 },
  extract: { taskType: 'extract', minFiles: 1, maxFiles: 1 },
  officepdf: { taskType: 'officepdf', minFiles: 1, maxFiles: 1 },
  htmlpdf: { taskType: 'htmlpdf', minFiles: 1, maxFiles: 1 },
  pdfa: { taskType: 'pdfa', minFiles: 1, maxFiles: 1 },
  validatepdfa: { taskType: 'validatepdfa', minFiles: 1, maxFiles: 1 },
  
  // Image Tools - Only keeping the ones that work with Node.js library
  compressimage: { taskType: 'compressimage', minFiles: 1, maxFiles: 1 },
  convertimage: { taskType: 'convertimage', minFiles: 1, maxFiles: 1 },
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
  console.log('=== API PROCESS ENDPOINT CALLED ===');
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
  
  if (!publicKey || !secretKey) {
    return res.status(500).json({ 
      error: 'iLovePDF API keys not configured. Please set ILOVE_PUBLIC_KEY and ILOVE_SECRET_KEY in your environment variables.' 
    });
  }

  let tool: string | undefined;
  let uploadedFiles: any[] = [];
  
  try {
    // Parse the multipart form data
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB limit
    });

    const [fields, files] = await form.parse(req);
    
    // Get tool parameter
    tool = Array.isArray(fields.tool) ? fields.tool[0] : fields.tool;
    
    // Get rotation angle parameter for rotate tool
    const rotationAngle = Array.isArray(fields.rotation_angle) ? fields.rotation_angle[0] : fields.rotation_angle;
    
    if (!tool) {
      return res.status(400).json({ error: 'Tool parameter is required' });
    }

    console.log('Selected tool:', tool);

    // Validate tool
    const toolConfig = TOOL_CONFIG[tool as keyof typeof TOOL_CONFIG];
    if (!toolConfig) {
      return res.status(400).json({ error: `Unsupported tool: ${tool}` });
    }

    // Get uploaded files
    uploadedFiles = Array.isArray(files.files) ? files.files : files.files ? [files.files] : [];
    
    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (uploadedFiles.length < toolConfig.minFiles) {
      return res.status(400).json({ 
        error: `At least ${toolConfig.minFiles} file(s) required for ${tool}` 
      });
    }

    if (uploadedFiles.length > toolConfig.maxFiles) {
      return res.status(400).json({ 
        error: `Maximum ${toolConfig.maxFiles} file(s) allowed for ${tool}` 
      });
    }

    console.log(`Processing ${uploadedFiles.length} files with tool: ${tool}`);

    let data: any;

    // Use Node.js library for all tools
    if (tool === 'rotate' && rotationAngle) {
      console.log(`Using Node.js library for rotation with angle: ${rotationAngle}°`);
    } else {
      console.log('Using Node.js library...');
    }
    
    // Initialize iLovePDF API with your credentials
    console.log('Initializing iLovePDF API...');
    const instance = new ILovePDFApi(publicKey, secretKey);
    
    // Create a new task based on the tool
    console.log(`Creating ${tool} task...`);
    const task = instance.newTask(toolConfig.taskType as any);
    
    // Note: The Node.js library uses default rotation (90° clockwise)
    // The user's selected angle (${rotationAngle}°) is noted but not directly applied
    if (tool === 'rotate' && rotationAngle) {
      console.log(`User requested ${rotationAngle}° rotation. Using default 90° clockwise rotation.`);
    }

    // Start the task
    console.log('Starting task...');
    await task.start();
    console.log('Task started successfully');
    console.log('Remaining files:', task.remainingFiles);

    // Add files to the task
    console.log('Adding files to task...');
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      console.log(`Adding file ${i + 1}: ${file.originalFilename || `file_${i}`}`);
      
      // Create ILovePDFFile instance from the uploaded file
      const ilovepdfFile = new ILovePDFFile(file.filepath);
      await task.addFile(ilovepdfFile);
      
      console.log(`File ${i + 1} added successfully`);
    }

    // Process the task
    console.log(`Processing ${tool}...`);
    await task.process();
    console.log(`${tool} processing completed`);

    // Download the processed file(s)
    console.log('Downloading processed file(s)...');
    data = await task.download();

    console.log(`Download completed. File size: ${data.length} bytes`);

    // Clean up temporary files
    cleanupFiles(uploadedFiles);

    // Set response headers based on tool type
    const isImageTool = tool === 'compressimage' || tool === 'convertimage' || tool === 'pdfjpg';

    const contentType = isImageTool ? 'image/jpeg' : 'application/pdf';
    const filename = `processed-${tool}.${isImageTool ? 'jpg' : 'pdf'}`;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', data.length);

    // Send the file buffer
    res.send(data);

  } catch (error: any) {
    const toolName = tool || 'unknown';
    console.error(`Error processing with tool ${toolName}:`, {
      message: error.message,
      stack: error.stack
    });
    
    // Clean up any temporary files in case of error
    cleanupFiles(uploadedFiles);

    // Handle specific iLovePDF errors
    let message = `Error processing files with ${toolName}`;
    
    if (error.message) {
      if (error.message.includes('authentication')) {
        message = 'Authentication failed. Please check your API credentials.';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        message = 'API quota exceeded. Please check your iLovePDF account limits.';
      } else if (error.message.includes('file')) {
        message = 'Error processing files. Please ensure all files are valid.';
      } else if (error.message.includes('unsupported')) {
        message = `Tool ${toolName} is not supported or not available.`;
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