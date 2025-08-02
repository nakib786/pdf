import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { DarkModeProvider } from '../components/DarkModeContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DarkModeProvider>
      <Head>
        <title>PDFCraft - PDF & Image Processing Suite</title>
        <meta name="description" content="Professional PDF and image processing tools. Merge, compress, split, rotate, and convert PDFs and images with ease." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="192x192" href="/favicon-192.png" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#3B82F6" />
        
        {/* Open Graph */}
        <meta property="og:title" content="PDFCraft - PDF & Image Processing Suite" />
        <meta property="og:description" content="Professional PDF and image processing tools. Merge, compress, split, rotate, and convert PDFs and images with ease." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/favicon.svg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="PDFCraft - PDF & Image Processing Suite" />
        <meta name="twitter:description" content="Professional PDF and image processing tools. Merge, compress, split, rotate, and convert PDFs and images with ease." />
        <meta name="twitter:image" content="/favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </DarkModeProvider>
  );
}