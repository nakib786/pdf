# PDFCraft - Complete PDF & Image Processing Suite

A comprehensive web application for PDF and image processing, built with Next.js and powered by the iLovePDF API. This application provides access to 25+ professional tools for manipulating PDFs and images.

## 🚀 Features

### File Size Limits
- **Individual files**: Maximum 100MB per file
- **Total upload size**: Maximum 500MB for all files combined
- **Supported formats**: PDF, JPG, PNG, GIF, and other common image formats
- **Real-time validation**: File size and format validation with visual progress indicators

### PDF Tools (17 tools)
- **Merge PDF** - Combine multiple PDF files into one document
- **Compress PDF** - Reduce PDF file size while maintaining quality
- **Split PDF** - Split PDF into multiple files by pages
- **Rotate PDF** - Rotate PDF pages by 90, 180, or 270 degrees
- **Protect PDF** - Add password protection to your PDF
- **Add Watermark** - Add text or image watermark to PDF
- **Unlock PDF** - Remove password protection from PDF
- **Repair PDF** - Fix corrupted or damaged PDF files
- **PDF to JPG** - Convert PDF pages to JPG images
- **JPG to PDF** - Convert JPG images to PDF
- **PDF OCR** - Extract text from scanned PDF documents
- **Extract PDF** - Extract text and images from PDF
- **Add Page Numbers** - Add page numbers to PDF documents
- **Office to PDF** - Convert Word, Excel, PowerPoint to PDF
- **HTML to PDF** - Convert HTML files to PDF
- **Convert to PDF/A** - Convert PDF to PDF/A format for archiving
- **Validate PDF/A** - Check if PDF is PDF/A compliant

### Image Tools (9 tools)
- **Compress Image** - Reduce image file size while maintaining quality
- **Crop Image** - Crop images to remove unwanted areas
- **Resize Image** - Resize images to different dimensions
- **Rotate Image** - Rotate images by 90, 180, or 270 degrees
- **Convert Image** - Convert between different image formats
- **Watermark Image** - Add text or image watermark to images
- **Remove Background** - Remove background from images
- **Upscale Image** - Increase image resolution and quality
- **Repair Image** - Fix corrupted or damaged image files

## 🛠️ Technology Stack

- **Frontend**: Next.js 13+ with TypeScript
- **Styling**: Tailwind CSS
- **File Upload**: React Dropzone
- **PDF Processing**: iLovePDF API
- **HTTP Client**: Axios
- **Form Handling**: Formidable
- **Deployment**: Vercel (optimized)

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- iLovePDF API account and credentials

## 🚀 Getting Started

### Local Development

#### 1. Clone the repository

```bash
git clone <repository-url>
cd pdf
```

#### 2. Install dependencies

```bash
npm install
# or
yarn install
```

#### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
ILOVE_PUBLIC_KEY=your_ilovepdf_public_key
ILOVE_SECRET_KEY=your_ilovepdf_secret_key
```

#### 4. Get iLovePDF API credentials

1. Visit [iLovePDF Developers](https://www.iloveapi.com/)
2. Create an account and register as a developer
3. Create a new project to get your API keys
4. Copy your Public Key and Secret Key to the `.env.local` file

#### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Vercel Deployment

This application is optimized for Vercel deployment. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

#### Quick Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **New Project** and import your repository
4. Set environment variables in Vercel dashboard:
   - `ILOVE_PUBLIC_KEY` = your iLovePDF public key
   - `ILOVE_SECRET_KEY` = your iLovePDF secret key
5. Deploy!

## 🎯 Usage

1. **Select a Tool**: Click "Show All Tools" to see the available PDF and image processing tools
2. **Choose Your Tool**: Click on any tool to select it (e.g., Compress PDF, Merge PDF, etc.)
3. **Upload Files**: Drag and drop your files or click to browse
4. **Process**: Click "Process" to apply the selected tool to your files
5. **Download**: Your processed file will download automatically

## 📁 Project Structure

```
pdf/
├── components/
│   └── FileUploader.tsx      # Main file upload and tool selection component
├── pages/
│   ├── api/
│   │   ├── merge.ts          # Legacy merge endpoint (kept for compatibility)
│   │   ├── process.ts        # New comprehensive processing endpoint
│   │   └── balance.ts        # API balance check endpoint
│   ├── _app.tsx              # App wrapper
│   └── index.tsx             # Main page
├── styles/
│   └── globals.css           # Global styles
├── package.json              # Dependencies and scripts
├── next.config.js            # Next.js configuration (Vercel optimized)
├── vercel.json               # Vercel deployment configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── VERCEL_DEPLOYMENT.md      # Detailed Vercel deployment guide
└── README.md                 # This file
```

## 🚀 Vercel Optimizations

This application is specifically optimized for Vercel deployment:

- **Function Timeouts**: Extended to 60 seconds for file processing
- **Memory Management**: Optimized for Vercel's serverless environment
- **File Handling**: Improved cleanup and error handling
- **Environment Variables**: Properly configured for Vercel
- **Build Optimization**: Standalone output for better performance

## 🔧 API Endpoints

### `/api/process` (POST)
Main endpoint for processing files with any supported tool.

**Parameters:**
- `tool` (string): The tool to use (e.g., 'compress', 'merge', 'split', etc.)
- `files` (multipart): The files to process

**Supported Tools:**
- PDF: merge, compress, split, rotate, protect, watermark, unlock, repair, pdfjpg, imagepdf, pdfocr, extract, pagenumber, officepdf, htmlpdf, pdfa, validatepdfa
- Image: compressimage, cropimage, resizeimage, rotateimage, convertimage, watermarkimage, removebackgroundimage, upscaleimage, repairimage

### `/api/merge` (POST)
Legacy endpoint for merging PDFs (kept for backward compatibility).

## 🎨 Customization

### Adding New Tools

To add a new tool, update the following files:

1. **FileUploader.tsx**: Add the tool to the `PDF_TOOLS` or `IMAGE_TOOLS` array
2. **process.ts**: Add the tool configuration to `TOOL_CONFIG` and implement any specific parameters

### Styling

The application uses Tailwind CSS for styling. You can customize the appearance by modifying:
- `tailwind.config.js` for theme configuration
- `styles/globals.css` for global styles
- Component-specific classes in the React components

## 🔒 Security & Privacy

- **No File Storage**: Files are processed in memory and never stored on the server
- **Secure API**: All communication with iLovePDF API is encrypted
- **Environment Variables**: API keys are stored securely in environment variables
- **Input Validation**: All file uploads are validated for type and size

## 📊 API Limits

The application respects iLovePDF API limits:
- Free tier: 250 files per month
- File size limits vary by tool
- Rate limiting is handled automatically

## 🐛 Troubleshooting

### Common Issues

1. **API Authentication Error**
   - Verify your API keys are correct in `.env.local`
   - Ensure you have an active iLovePDF account

2. **File Upload Issues**
   - Check file type compatibility with the selected tool
   - Verify file size is within limits
   - Ensure you have sufficient API credits

3. **Processing Errors**
   - Check the browser console for detailed error messages
   - Verify the selected tool supports your file type
   - Try with a smaller file to test

4. **413 Request Entity Too Large Error**
   - This error occurs when the total file size exceeds 500MB
   - Solution: Reduce the number of files or use smaller files
   - The application now includes real-time file size validation
   - Visual progress indicators show upload progress and file size limits

### Debug Mode

Enable debug logging by checking the browser console and server logs for detailed information about the processing steps.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [iLovePDF API](https://www.iloveapi.com/) for providing the PDF and image processing capabilities
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework

## 📞 Support

For support and questions:
- Check the [iLovePDF API Documentation](https://www.iloveapi.com/docs/api-reference)
- Review the troubleshooting section above
- Open an issue in this repository

---

**Note**: This application requires an active iLovePDF API account. The free tier includes 250 files per month. For higher usage, consider upgrading your iLovePDF plan.