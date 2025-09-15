import React, { useCallback, useState } from 'react';
import { APData } from '../types';
import { UploadIcon } from './icons';
import { sampleData } from '../sample-data';
import HelpModal from './HelpModal';

interface FileUploadProps {
  onDataLoaded: (data: APData[], error?: string) => void;
  error: string | null;
}

// --- Dynamic Script Loader ---
let papaPromise: Promise<void> | null = null;
// Use the official PapaParse CDN URL as requested
const PAPA_URL = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js';

const loadPapaParse = (): Promise<void> => {
  if (papaPromise) {
    return papaPromise;
  }
  papaPromise = new Promise((resolve, reject) => {
    if ((window as any).Papa) {
      return resolve();
    }

    const script = document.createElement('script');
    script.src = PAPA_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
        papaPromise = null; // Allow retrying
        reject(new Error('Failed to load PapaParse script.'));
    }
    document.head.appendChild(script);
  });
  return papaPromise;
};
// ----------------------------

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (!file || !file.type.includes('csv')) {
      onDataLoaded([], 'Invalid file type. Please upload a CSV file.');
      return;
    }

    setIsParsing(true);

    try {
      await loadPapaParse();

      (window as any).Papa.parse(file, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
        complete: (results: { data: any[], errors: any[] }) => {
          setIsParsing(false);
          if (results.errors.length > 0) {
              console.error('Parsing errors:', results.errors);
              onDataLoaded([], `Error parsing CSV: ${results.errors[0].message}`);
              return;
          }

          if (results.data.length === 0) {
              onDataLoaded([], 'CSV file is empty or contains no data rows.');
              return;
          }

          const requiredHeaders = ["BSSID", "ESSID", "Latitude", "Longitude"];
          const actualHeaders = Object.keys(results.data[0] || {});
          const missingHeaders = requiredHeaders.filter(h => !actualHeaders.includes(h));

          if (missingHeaders.length > 0) {
              onDataLoaded([], `CSV is missing required columns: ${missingHeaders.join(', ')}`);
              return;
          }

          const parsedData = results.data.map((row: any) => ({
            ...row,
            Latitude: parseFloat(row.Latitude),
            Longitude: parseFloat(row.Longitude),
          })).filter((row: any) => row.BSSID && !isNaN(row.Latitude) && !isNaN(row.Longitude));
          
          if (parsedData.length === 0) {
              onDataLoaded([], 'No valid data found. Check that BSSID, Latitude, and Longitude columns are present and correctly formatted.');
              return;
          }
          
          onDataLoaded(parsedData);
        },
        error: (err: Error) => {
          setIsParsing(false);
          onDataLoaded([], `Failed to parse file: ${err.message}`);
        }
      });
    } catch (err) {
      setIsParsing(false);
      console.error(err);
      onDataLoaded([], 'CSV parsing library failed to load. Please check your connection and try again.');
    }

  }, [onDataLoaded]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isParsing) setIsDragging(true);
  }, [isParsing]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      if (isParsing) return;
      const file = event.dataTransfer.files?.[0];
      if (file) {
          processFile(file);
      }
  }, [processFile, isParsing]);
  
  const handleLoadSampleData = useCallback(() => {
    const processedSampleData = sampleData.map(row => ({
      ...row,
      Latitude: parseFloat(row.Latitude as any),
      Longitude: parseFloat(row.Longitude as any),
    })).filter(row => row.BSSID && !isNaN(row.Latitude) && !isNaN(row.Longitude));

    setTimeout(() => {
      onDataLoaded(processedSampleData);
    }, 0);
    
  }, [onDataLoaded]);

  return (
    <div className="w-full max-w-lg">
      <div className="bg-card dark:bg-dark-card p-8 rounded-lg border border-border dark:border-dark-border shadow-lg text-center">
        <label
          htmlFor="csv-upload"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative block w-full border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isParsing ? 'cursor-not-allowed bg-secondary dark:bg-dark-secondary' : isDragging ? 'border-primary dark:border-dark-primary bg-accent dark:bg-dark-accent' : 'border-border dark:border-dark-border hover:border-primary dark:hover:border-dark-primary cursor-pointer'}`}
        >
          {isParsing ? (
              <>
                <div className="flex justify-center items-center h-12 w-12 mx-auto">
                    <svg className="animate-spin h-10 w-10 text-primary dark:text-dark-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <span className="mt-2 block text-sm font-semibold text-foreground dark:text-dark-foreground">
                  Parsing File...
                </span>
                <span className="mt-1 block text-xs text-muted-foreground dark:text-dark-muted-foreground">
                  Please wait
                </span>
              </>
          ) : (
            <>
              <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground dark:text-dark-muted-foreground" />
              <span className="mt-2 block text-sm font-semibold text-foreground dark:text-dark-foreground">
                Drag & Drop or Click to Upload
              </span>
              <span className="mt-1 block text-xs text-muted-foreground dark:text-dark-muted-foreground">
                CSV file with AP data
              </span>
            </>
          )}

          <input
            id="csv-upload"
            type="file"
            className="sr-only"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            disabled={isParsing}
          />
        </label>
        {error && <p className="mt-4 text-sm text-destructive dark:text-dark-destructive">{error}</p>}
         <div className="mt-4">
            <button 
                onClick={() => setIsHelpModalOpen(true)}
                className="text-xs text-muted-foreground dark:text-dark-muted-foreground hover:text-primary dark:hover:text-dark-primary underline transition-colors"
            >
                What's the required file format?
            </button>
        </div>
        <div className="mt-6 border-t border-border dark:border-dark-border pt-6 text-center">
            <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground mb-2">Don't have a file?</p>
            <button
                onClick={handleLoadSampleData}
                disabled={isParsing}
                className="px-4 py-2 text-sm bg-secondary dark:bg-dark-secondary text-secondary-foreground dark:text-dark-secondary-foreground rounded-md hover:bg-accent dark:hover:bg-dark-accent transition-colors disabled:opacity-50"
            >
                Load Sample Data
            </button>
        </div>
      </div>
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
};

export default FileUpload;