# Vercel Deployment Guide

This guide will help you deploy your PDF processing application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **iLovePDF API Keys**: Get your API credentials from [developer.ilovepdf.com](https://developer.ilovepdf.com/)
3. **GitHub/GitLab/Bitbucket Repository**: Your code should be in a Git repository

## Environment Variables Setup

Before deploying, you need to set up your environment variables in Vercel:

### Required Environment Variables

1. **ILOVE_PUBLIC_KEY**: Your iLovePDF public key
2. **ILOVE_SECRET_KEY**: Your iLovePDF secret key

### How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:
   - `ILOVE_PUBLIC_KEY` = `your_public_key_here`
   - `ILOVE_SECRET_KEY` = `your_secret_key_here`

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your deployment

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click **New Project**
4. Import your GitHub repository
5. Configure environment variables
6. Deploy

## Vercel-Specific Configurations

The project includes the following Vercel-specific configurations:

### `vercel.json`
- Function timeout settings (60 seconds for processing, 30 seconds for balance check)
- Environment variable mappings
- Build configuration

### `next.config.js`
- Standalone output for better Vercel compatibility
- External packages configuration for iLovePDF library
- File size limits and response handling

## Important Notes

### File Size Limits
- **Vercel Function Payload**: 4.5MB (for free tier)
- **File Upload Limit**: 50MB per file (configured in the API)
- **Total Function Size**: 50MB (including dependencies)

### Timeout Limits
- **Free Tier**: 10 seconds (upgraded to 60 seconds in vercel.json)
- **Pro Tier**: 60 seconds
- **Enterprise Tier**: 900 seconds

### Memory Limits
- **Free Tier**: 1024MB
- **Pro Tier**: 3008MB
- **Enterprise Tier**: 3008MB

## Troubleshooting

### Common Issues

1. **Environment Variables Not Found**
   - Ensure variables are set in Vercel dashboard
   - Check variable names match exactly (case-sensitive)

2. **Function Timeout**
   - Large files may take longer to process
   - Consider upgrading to Pro tier for longer timeouts

3. **Memory Issues**
   - Large PDF files may exceed memory limits
   - Consider file size restrictions in your frontend

4. **API Quota Exceeded**
   - Check your iLovePDF account limits
   - Monitor usage in your iLovePDF dashboard

### Debugging

1. Check Vercel function logs in the dashboard
2. Monitor function execution times
3. Verify API credentials are working

## Performance Optimization

1. **File Compression**: Consider compressing files before upload
2. **Batch Processing**: Process multiple files in smaller batches
3. **Caching**: Implement caching for frequently processed files

## Security Considerations

1. **API Keys**: Never expose API keys in client-side code
2. **File Validation**: Validate file types and sizes on both client and server
3. **Rate Limiting**: Implement rate limiting to prevent abuse

## Support

If you encounter issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Check iLovePDF documentation: [developer.ilovepdf.com](https://developer.ilovepdf.com/)
3. Review function logs in Vercel dashboard 