import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

interface FileUploaderProps {
  className?: string;
}

interface ToolOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  minFiles: number;
  maxFiles: number;
  accepts: string[];
  category: 'pdf' | 'image';
}

const PDF_TOOLS: ToolOption[] = [
  {
    id: 'merge',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one document',
    icon: '📄',
    minFiles: 2,
    maxFiles: 10,
    accepts: ['application/pdf'],
    category: 'pdf'
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    icon: '🗜️',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['application/pdf'],
    category: 'pdf'
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Split PDF into multiple files by pages',
    icon: '✂️',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['application/pdf'],
    category: 'pdf'
  },
  {
    id: 'rotate',
    name: 'Rotate PDF',
    description: 'Rotate PDF pages by 90, 180, or 270 degrees',
    icon: '🔄',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['application/pdf'],
    category: 'pdf'
    },
  {
    id: 'unlock',
    name: 'Unlock PDF',
    description: 'Remove password protection from PDF',
    icon: '🔓',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['application/pdf'],
    category: 'pdf'
  },
  {
    id: 'repair',
    name: 'Repair PDF',
    description: 'Fix corrupted or damaged PDF files',
    icon: '🔧',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['application/pdf'],
    category: 'pdf'
  },
  {
    id: 'pdfjpg',
    name: 'PDF to JPG',
    description: 'Convert PDF pages to JPG images',
    icon: '🖼️',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['application/pdf'],
    category: 'pdf'
  },
  {
    id: 'imagepdf',
    name: 'JPG to PDF',
    description: 'Convert JPG images to PDF',
    icon: '📷',
    minFiles: 1,
    maxFiles: 10,
    accepts: ['image/jpeg', 'image/jpg', 'image/png'],
    category: 'pdf'
  },
  {
    id: 'pdfocr',
    name: 'PDF OCR',
    description: 'Extract text from scanned PDF documents',
    icon: '🔍',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['application/pdf'],
    category: 'pdf'
  },
  {
    id: 'extract',
    name: 'Extract PDF',
    description: 'Extract text and images from PDF',
    icon: '📤',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['application/pdf'],
    category: 'pdf'
    },
  {
    id: 'officepdf',
    name: 'Office to PDF',
    description: 'Convert Word, Excel, PowerPoint to PDF',
    icon: '📊',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    category: 'pdf'
  },
  {
    id: 'htmlpdf',
    name: 'HTML to PDF',
    description: 'Convert HTML files to PDF',
    icon: '🌐',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['text/html'],
    category: 'pdf'
  },
  {
    id: 'pdfa',
    name: 'Convert to PDF/A',
    description: 'Convert PDF to PDF/A format for archiving',
    icon: '📋',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['application/pdf'],
    category: 'pdf'
  },
  {
    id: 'validatepdfa',
    name: 'Validate PDF/A',
    description: 'Check if PDF is PDF/A compliant',
    icon: '✅',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['application/pdf'],
    category: 'pdf'
  }
];

const IMAGE_TOOLS: ToolOption[] = [
  {
    id: 'compressimage',
    name: 'Compress Image',
    description: 'Reduce image file size while maintaining quality',
    icon: '🗜️',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    category: 'image'
  },
  {
    id: 'convertimage',
    name: 'Convert Image',
    description: 'Convert between different image formats',
    icon: '🔄',
    minFiles: 1,
    maxFiles: 1,
    accepts: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    category: 'image'
  }
];

const ALL_TOOLS = [...PDF_TOOLS, ...IMAGE_TOOLS];

export default function FileUploader({ className = '' }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTool, setSelectedTool] = useState<ToolOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [showRotationPreview, setShowRotationPreview] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!selectedTool) {
      setError('Please select a tool first');
      return;
    }

    // Check file sizes (100MB limit per file)
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    const oversizedFiles = acceptedFiles.filter(file => file.size > MAX_FILE_SIZE);
    
    if (oversizedFiles.length > 0) {
      setError(`Files too large: ${oversizedFiles.map(f => f.name).join(', ')}. Maximum file size is 100MB.`);
      return;
    }

    // Check total size (500MB limit for all files)
    const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB
    const currentTotalSize = files.reduce((sum, file) => sum + file.size, 0);
    const newTotalSize = currentTotalSize + acceptedFiles.reduce((sum, file) => sum + file.size, 0);
    
    if (newTotalSize > MAX_TOTAL_SIZE) {
      setError(`Total file size too large. Maximum total size is 500MB. Current: ${formatFileSize(currentTotalSize)}, Adding: ${formatFileSize(acceptedFiles.reduce((sum, file) => sum + file.size, 0))}`);
      return;
    }

    // Filter files based on selected tool's accepted types
    const validFiles = acceptedFiles.filter(file => 
      selectedTool.accepts.includes(file.type)
    );
    
    if (validFiles.length !== acceptedFiles.length) {
      setError(`Only ${selectedTool.accepts.map(type => type.split('/')[1]).join(', ')} files are allowed for ${selectedTool.name}`);
      return;
    }

    if (validFiles.length + files.length > selectedTool.maxFiles) {
      setError(`Maximum ${selectedTool.maxFiles} file(s) allowed for ${selectedTool.name}`);
      return;
    }

    setFiles(prev => [...prev, ...validFiles]);
    setError(null);
    setSuccess(false);
  }, [selectedTool, files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: selectedTool ? Object.fromEntries(
      selectedTool.accepts.map(type => [type, [type.split('/')[1] === 'jpeg' ? '.jpg' : `.${type.split('/')[1]}`]])
    ) : {},
    multiple: (selectedTool?.maxFiles || 1) > 1
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setError(null);
    setSuccess(false);
  };

  const clearFiles = () => {
    setFiles([]);
    setError(null);
    setSuccess(false);
  };

  const selectTool = (tool: ToolOption) => {
    setSelectedTool(tool);
    setFiles([]);
    setError(null);
    setSuccess(false);
    setShowToolSelector(false);
  };

  const processFiles = async () => {
    if (!selectedTool) {
      setError('Please select a tool first');
      return;
    }

    if (files.length < selectedTool.minFiles) {
      setError(`Please select at least ${selectedTool.minFiles} file(s) for ${selectedTool.name}`);
      return;
    }

    if (files.length > selectedTool.maxFiles) {
      setError(`Maximum ${selectedTool.maxFiles} file(s) allowed for ${selectedTool.name}`);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setUploadProgress(0);

    try {
      console.log(`Frontend: Starting ${selectedTool.id} process...`);
      console.log('Frontend: Number of files:', files.length);
      
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
        console.log('Frontend: Added file:', file.name, 'Size:', file.size);
      });

             // Add tool-specific parameters
       formData.append('tool', selectedTool.id);
       
       // Add rotation angle for rotate tool
       if (selectedTool.id === 'rotate') {
         formData.append('rotation_angle', rotationAngle.toString());
       }

      console.log(`Frontend: Making API call to /api/process...`);
      const response = await axios.post('/api/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
        timeout: 300000, // 5 minutes timeout for large file uploads
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });
      console.log('Frontend: API call successful');

      // Create download link
      const contentType = selectedTool.category === 'pdf' ? 'application/pdf' : 'image/jpeg';
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `processed-${selectedTool.id}.${selectedTool.category === 'pdf' ? 'pdf' : 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess(true);
      setFiles([]);
    } catch (error: any) {
      console.error('Frontend: Error processing files:', error);
      console.error('Frontend: Error response status:', error.response?.status);
      console.error('Frontend: Error response data:', error.response?.data);
      
      // Handle specific HTTP errors
      if (error.response?.status === 413) {
        setError('Files too large. Please reduce file sizes or try processing fewer files at once. Maximum total size is 500MB.');
        return;
      }
      
      if (error.response?.data) {
        try {
          const errorText = await error.response.data.text();
          console.error('Frontend: Error text:', errorText);
          const errorData = JSON.parse(errorText);
          setError(errorData.error || `Failed to process files with ${selectedTool.name}`);
        } catch {
          console.error('Frontend: Could not parse error response');
          setError(`Failed to process files with ${selectedTool.name}. Please try again.`);
        }
      } else {
        console.error('Frontend: No response data in error');
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* Tool Selector */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose a Tool</h2>
          <button
            onClick={() => setShowToolSelector(!showToolSelector)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {showToolSelector ? 'Hide Tools' : 'Show All Tools'}
          </button>
        </div>

        {showToolSelector && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {ALL_TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => selectTool(tool)}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  selectedTool?.id === tool.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-gray-900 dark:text-white'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{tool.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {tool.minFiles}-{tool.maxFiles} file(s)
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedTool && (
          <div className="bg-primary-50 dark:bg-gray-800 border border-primary-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{selectedTool.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{selectedTool.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTool.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Accepts: {selectedTool.accepts.map(type => type.split('/')[1]).join(', ')} | 
                  Files: {selectedTool.minFiles}-{selectedTool.maxFiles}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drop Zone */}
      {selectedTool && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' 
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <span className="text-4xl">{selectedTool.icon}</span>
            <div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {isDragActive ? 'Drop your files here' : `Drag & drop files for ${selectedTool.name}`}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                or <span className="text-primary-600 font-medium">browse files</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {selectedTool.accepts.map(type => type.split('/')[1]).join(', ')} files accepted
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Max 100MB per file, 500MB total
              </p>
            </div>
          </div>
          
          {/* File size warning */}
          {files.reduce((sum, file) => sum + file.size, 0) > 400 * 1024 * 1024 && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Warning: Total file size is approaching the 500MB limit. Consider processing fewer files at once.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Selected Files ({files.length}/{selectedTool?.maxFiles})
              </h3>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total size: {formatFileSize(files.reduce((sum, file) => sum + file.size, 0))} / 500MB
                </p>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      files.reduce((sum, file) => sum + file.size, 0) > 400 * 1024 * 1024 
                        ? 'bg-red-500' 
                        : files.reduce((sum, file) => sum + file.size, 0) > 300 * 1024 * 1024 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min(100, (files.reduce((sum, file) => sum + file.size, 0) / (500 * 1024 * 1024)) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
            <button
              onClick={clearFiles}
              className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {file.type.startsWith('image/') ? '🖼️' : '📄'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

             {/* Rotation Preview for Rotate Tool */}
       {selectedTool?.id === 'rotate' && files.length > 0 && (
         <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
           <h3 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-white">Choose Rotation Angle</h3>
           <div className="flex justify-center space-x-4 mb-4">
             {[90, 180, 270].map((angle) => (
               <button
                 key={angle}
                 onClick={() => setRotationAngle(angle)}
                 className={`px-4 py-2 rounded-lg border-2 transition-all ${
                   rotationAngle === angle
                     ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                     : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                 }`}
               >
                 <div className="flex flex-col items-center">
                   <div className="text-2xl mb-1">
                     {angle === 90 && '↻'}
                     {angle === 180 && '↑↓'}
                     {angle === 270 && '↺'}
                   </div>
                   <span className="text-sm">{angle}°</span>
                 </div>
               </button>
             ))}
           </div>
           <div className="text-center text-sm text-gray-600 dark:text-gray-400">
             <p>Selected: <strong>{rotationAngle}° clockwise</strong></p>
             <p className="mt-1 text-amber-600 dark:text-amber-400">
               <strong>Note:</strong> Currently using default 90° rotation. Custom angles coming soon!
             </p>
           </div>
         </div>
       )}

       {/* Action Buttons */}
       {selectedTool && files.length > 0 && (
          <div className="mt-6">
            <button
            onClick={processFiles}
            disabled={isProcessing || files.length < selectedTool.minFiles}
            className={`
              w-full px-8 py-3 rounded-lg font-medium text-white transition-colors
              ${isProcessing || files.length < selectedTool.minFiles
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 active:bg-primary-800'
              }
            `}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              `Process with ${selectedTool.name}`
            )}
          </button>
          
          {/* Upload Progress */}
          {isProcessing && uploadProgress > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="ml-3 text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="ml-3 text-sm text-green-800 dark:text-green-200">
              Files processed successfully! Your download should start automatically.
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedTool && (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">How to use:</h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>1. Click "Show All Tools" to see available PDF and image processing tools</li>
            <li>2. Select the tool you want to use</li>
            <li>3. Upload your files by dragging them or clicking to browse</li>
            <li>4. Review your selected files and remove any unwanted ones</li>
            <li>5. Click "Process" to apply the selected tool to your files</li>
            <li>6. Your processed file will download automatically</li>
          </ul>
        </div>
      )}
    </div>
  );
}