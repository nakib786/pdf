# PDF Merger Setup Guide

## Environment Variables Setup

To use this PDF merger application, you need to set up your iLovePDF API credentials:

1. **Get API Keys:**
   - Go to [iLovePDF Developer Console](https://developer.ilovepdf.com/)
   - Sign up or log in to your account
   - Create a new project or use an existing one
   - Copy your **Public Key** and **Secret Key**

2. **Set Environment Variables:**
   Create a `.env.local` file in your project root with:
   ```
   ILOVE_PUBLIC_KEY=your_public_key_here
   ILOVE_SECRET_KEY=your_secret_key_here
   ```

3. **Install Dependencies:**
   Make sure you have the required dependencies:
   ```bash
   npm install jsonwebtoken @types/jsonwebtoken
   ```

4. **Restart Development Server:**
   After adding the environment variables, restart your Next.js development server:
   ```bash
   npm run dev
   ```

## Common Issues & Solutions

### 1. "iLovePDF API keys not configured" Error
- **Solution:** Make sure you've created a `.env.local` file with your API keys
- **Check:** Verify the variable names are exactly `ILOVE_PUBLIC_KEY` and `ILOVE_SECRET_KEY`

### 2. "Failed to authenticate with iLovePDF API" Error
- **Solution:** Verify your API keys are correct
- **Check:** Ensure you're using the keys from your active iLovePDF project

### 3. "No files uploaded" Error
- **Solution:** Make sure you're uploading PDF files
- **Check:** The application only accepts `.pdf` files

### 4. "At least 2 PDF files are required" Error
- **Solution:** Upload 2 or more PDF files to merge them

### 5. Network/API Errors
- **Solution:** Check your internet connection
- **Check:** Verify your iLovePDF account has available credits
- **Check:** Ensure you're not hitting rate limits

## API Workflow

The application follows the iLovePDF API workflow:
1. **Authentication:** Create self-signed JWT token using your API keys
2. **Start Task:** Initialize a merge task
3. **Upload Files:** Upload PDF files to the task
4. **Process:** Execute the merge operation
5. **Download:** Retrieve the merged PDF

## Testing

To test if your setup is working:
1. Upload 2 small PDF files
2. Click "Merge PDFs"
3. The merged file should download automatically

If you encounter any issues, check the browser console and server logs for detailed error messages. 