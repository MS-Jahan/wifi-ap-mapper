
import React, { useState, useCallback, useRef, useMemo } from 'react';
import { APData } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import DataTable from './components/DataTable';
import MapView from './components/MapView';

function App() {
  const [apData, setApData] = useState<APData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedAp, setSelectedAp] = useState<APData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handleDataLoaded = useCallback((data: APData[], error?: string) => {
    if (error) {
      setError(error);
      setApData([]);
      setSelectedAp(null);
    } else {
      setApData(data);
      setError(null);
      setSelectedAp(null);
      setSearchQuery(''); // Reset search on new data load
    }
  }, []);

  const handleApSelect = useCallback((ap: APData | null) => {
    setSelectedAp(ap);
  }, []);

  const filteredApData = useMemo(() => {
    if (!searchQuery) {
      return apData;
    }
    return apData.filter(ap =>
      ap.ESSID && ap.ESSID.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [apData, searchQuery]);

  return (
    <div className="min-h-screen bg-secondary dark:bg-dark-secondary flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {apData.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <FileUpload onDataLoaded={handleDataLoaded} error={error} />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-120px)]">
            <div className="lg:w-1/2 h-1/2 lg:h-full flex flex-col bg-card dark:bg-dark-card rounded-lg border border-border dark:border-dark-border shadow-sm">
               <div className="p-4 border-b border-border dark:border-dark-border">
                   <h2 className="text-xl font-semibold">Access Points Map</h2>
               </div>
               <div className="flex-grow">
                   <MapView data={filteredApData} selectedAp={selectedAp} onMarkerClick={handleApSelect} />
               </div>
            </div>
            <div className="lg:w-1/2 h-1/2 lg:h-full flex flex-col bg-card dark:bg-dark-card rounded-lg border border-border dark:border-dark-border shadow-sm">
                <div className="p-4 border-b border-border dark:border-dark-border flex justify-between items-center">
                   <h2 className="text-xl font-semibold">Access Points List</h2>
                   <button 
                    onClick={() => handleDataLoaded([], undefined)} 
                    className="px-3 py-1 text-sm bg-destructive dark:bg-dark-destructive text-destructive-foreground dark:text-dark-destructive-foreground rounded-md hover:opacity-90 transition-opacity"
                    >
                       Upload New File
                    </button>
               </div>
               <div className="p-4 border-b border-border dark:border-dark-border">
                    <input
                        type="text"
                        placeholder="Search by ESSID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 bg-secondary dark:bg-dark-secondary border border-border dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary text-sm"
                        aria-label="Search access points by ESSID"
                    />
               </div>
               <div className="flex-grow overflow-auto" ref={tableContainerRef}>
                   <DataTable data={filteredApData} selectedAp={selectedAp} onRowClick={handleApSelect} />
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
