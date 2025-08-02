import Head from 'next/head';
import { useState, useEffect } from 'react';
import FileUploader from '../components/FileUploader';
import DarkModeToggle from '../components/DarkModeToggle';

export default function Home() {
  const [balance, setBalance] = useState<number | null>(null);
  const [usedCredits, setUsedCredits] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(2500);
  const [plan, setPlan] = useState<string>('Free Tier');
  const [price, setPrice] = useState<string>('$0');
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('/api/balance');
        const data = await response.json();
        
        if (data.success) {
          setBalance(data.remainingFiles);
          setUsedCredits(data.usedCredits || 0);
          setTotalCredits(data.totalCredits || 2500);
          setPlan(data.plan || 'Free Tier');
          setPrice(data.price || '$0');
        } else {
          setBalanceError(data.error || 'Failed to fetch balance');
        }
      } catch (error) {
        setBalanceError('Failed to fetch API balance');
      } finally {
        setBalanceLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <>
      <Head>
        <title>PDFCraft - Complete PDF & Image Tools</title>
        <meta name="description" content="Complete PDF and image processing tools - merge, compress, split, rotate, protect, watermark, convert and more" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-slate-800">
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          {/* Dark Mode Toggle */}
          <div className="flex justify-end mb-4">
            <DarkModeToggle />
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="text-primary-600">PDF</span>Craft
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-2">
              Complete PDF & Image Processing Suite
            </p>
            <p className="text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              Professional PDF and image tools powered by iLovePDF API. Merge, compress, split, rotate, 
              protect, watermark, convert and more. No registration required, and your files are processed 
              securely without being stored on our servers.
            </p>
            
            {/* API Balance and Subscription Display */}
            <div className="mt-6 flex justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md px-4 py-4 border border-gray-200 dark:border-gray-700 w-full max-w-4xl">
                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between space-x-4 lg:space-x-6">
                  {/* Balance */}
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">API Balance:</span>
                      {balanceLoading ? (
                        <div className="flex items-center space-x-1">
                          <svg className="animate-spin w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
                        </div>
                      ) : balanceError ? (
                        <span className="text-sm text-red-600 dark:text-red-400">{balanceError}</span>
                      ) : (
                        <span className="text-sm font-semibold text-primary-600">
                          {balance?.toLocaleString() || 0} files remaining
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>

                  {/* Subscription Info */}
                  <div className="flex items-center space-x-2 flex-1">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current subscription & credits:</span>
                      {balanceLoading ? (
                        <div className="flex items-center space-x-1">
                          <svg className="animate-spin w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
                        </div>
                      ) : balanceError ? (
                        <span className="text-sm text-red-600 dark:text-red-400">Error loading</span>
                      ) : (
                        <div className="text-sm">
                          <span className="font-semibold text-green-600">
                            {usedCredits.toLocaleString()}/{totalCredits.toLocaleString()}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400"> used credits this month. </span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{plan}</span>
                        </div>
                      )}
                    </div>
                  </div>


                </div>

                {/* Mobile Layout */}
                <div className="md:hidden space-y-4">
                  {/* Balance */}
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">API Balance:</span>
                      {balanceLoading ? (
                        <div className="flex items-center space-x-1 mt-1">
                          <svg className="animate-spin w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
                        </div>
                      ) : balanceError ? (
                        <span className="text-sm text-red-600 dark:text-red-400 block mt-1">{balanceError}</span>
                      ) : (
                        <span className="text-sm font-semibold text-primary-600 block mt-1">
                          {balance?.toLocaleString() || 0} files remaining
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-gray-300 dark:bg-gray-600"></div>

                  {/* Subscription Info */}
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current subscription & credits:</span>
                      {balanceLoading ? (
                        <div className="flex items-center space-x-1 mt-1">
                          <svg className="animate-spin w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
                        </div>
                      ) : balanceError ? (
                        <span className="text-sm text-red-600 dark:text-red-400 block mt-1">Error loading</span>
                      ) : (
                        <div className="text-sm mt-1">
                          <span className="font-semibold text-green-600">
                            {usedCredits.toLocaleString()}/{totalCredits.toLocaleString()}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400"> used credits this month. </span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{plan}</span>
                        </div>
                      )}
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700">
              <FileUploader />
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-400">Your files are processed securely and never stored on our servers.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">25+ Tools</h3>
              <p className="text-gray-600 dark:text-gray-400">Complete suite of PDF and image processing tools for all your needs.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">Process files in seconds with our optimized cloud processing.</p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Easy to Use</h3>
              <p className="text-gray-600 dark:text-gray-400">Simple drag-and-drop interface. No technical knowledge required.</p>
            </div>
          </div>

          {/* Tool Categories */}
          <div className="mt-16 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Available Tools</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* PDF Tools */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-3">📄</span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">PDF Tools</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>📄</span>
                    <span className="text-gray-900 dark:text-white">Merge PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🗜️</span>
                    <span className="text-gray-900 dark:text-white">Compress PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✂️</span>
                    <span className="text-gray-900 dark:text-white">Split PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔄</span>
                    <span className="text-gray-900 dark:text-white">Rotate PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔒</span>
                    <span className="text-gray-900 dark:text-white">Protect PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>💧</span>
                    <span className="text-gray-900 dark:text-white">Add Watermark</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔓</span>
                    <span className="text-gray-900 dark:text-white">Unlock PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔧</span>
                    <span className="text-gray-900 dark:text-white">Repair PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🖼️</span>
                    <span className="text-gray-900 dark:text-white">PDF to JPG</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📷</span>
                    <span className="text-gray-900 dark:text-white">JPG to PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔍</span>
                    <span className="text-gray-900 dark:text-white">PDF OCR</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📤</span>
                    <span className="text-gray-900 dark:text-white">Extract PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔢</span>
                    <span className="text-gray-900 dark:text-white">Add Page Numbers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📊</span>
                    <span className="text-gray-900 dark:text-white">Office to PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🌐</span>
                    <span className="text-gray-900 dark:text-white">HTML to PDF</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📋</span>
                    <span className="text-gray-900 dark:text-white">Convert to PDF/A</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span className="text-gray-900 dark:text-white">Validate PDF/A</span>
                  </div>
                </div>
              </div>

              {/* Image Tools */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-3">🖼️</span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Image Tools</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>🗜️</span>
                    <span className="text-gray-900 dark:text-white">Compress Image</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✂️</span>
                    <span className="text-gray-900 dark:text-white">Crop Image</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📏</span>
                    <span className="text-gray-900 dark:text-white">Resize Image</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔄</span>
                    <span className="text-gray-900 dark:text-white">Rotate Image</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔄</span>
                    <span className="text-gray-900 dark:text-white">Convert Image</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>💧</span>
                    <span className="text-gray-900 dark:text-white">Watermark Image</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🎨</span>
                    <span className="text-gray-900 dark:text-white">Remove Background</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔍</span>
                    <span className="text-gray-900 dark:text-white">Upscale Image</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔧</span>
                    <span className="text-gray-900 dark:text-white">Repair Image</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Aurora N&N Business Solution Inc
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Professional PDF & Image Processing Solutions
              </p>
              <a 
                href="https://aurorabusiness.ca" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                aurorabusiness.ca
              </a>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}