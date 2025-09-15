import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" 
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-card dark:bg-dark-card rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 relative border border-border dark:border-dark-border"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full text-muted-foreground hover:bg-accent dark:hover:bg-dark-accent"
            aria-label="Close modal"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h2 className="text-xl font-bold mb-4 text-foreground dark:text-dark-foreground">Required CSV File Format</h2>
        <div className="space-y-4 text-sm text-foreground dark:text-dark-foreground">
            <p>The CSV file must be semicolon-delimited (;) and include a header row. The following columns are required:</p>
            
            <div>
                <h3 className="font-semibold mb-2">Required Headers:</h3>
                <ul className="list-disc list-inside bg-secondary dark:bg-dark-secondary p-3 rounded-md space-y-1">
                    <li><code className="font-mono bg-muted dark:bg-dark-muted px-1 py-0.5 rounded">Date</code>: The date and time of the scan.</li>
                    <li><code className="font-mono bg-muted dark:bg-dark-muted px-1 py-0.5 rounded">BSSID</code>: The MAC address of the access point (must be unique).</li>
                    <li><code className="font-mono bg-muted dark:bg-dark-muted px-1 py-0.5 rounded">ESSID</code>: The public name of the WiFi network.</li>
                    <li><code className="font-mono bg-muted dark:bg-dark-muted px-1 py-0.5 rounded">WPS PIN</code>: The WPS PIN, if available.</li>
                    <li><code className="font-mono bg-muted dark:bg-dark-muted px-1 py-0.5 rounded">WPA PSK</code>: The WPA password, if available.</li>
                    <li><code className="font-mono bg-muted dark:bg-dark-muted px-1 py-0.5 rounded">Latitude</code>: The GPS latitude coordinate.</li>
                    <li><code className="font-mono bg-muted dark:bg-dark-muted px-1 py-0.5 rounded">Longitude</code>: The GPS longitude coordinate.</li>
                </ul>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Example:</h3>
                <pre className="bg-secondary dark:bg-dark-secondary p-3 rounded-md overflow-x-auto">
                    <code className="font-mono text-xs">
{`"Date";"BSSID";"ESSID";"WPS PIN";"WPA PSK";"Latitude";"Longitude"
"15.09.2025 22:48";"0A:1B:2C:3D:4E:F0";"PPPPPP 5G";"99999999";"AAAAAAA76";"37.7955";"-122.3934"
"15.09.2025 22:49";"0B:1B:2C:3D:4E:F0";"RRRRRR 5G";"88888888";"HIIHIHIHIHI12";"37.7955";"-122.3934"
"15.09.2025 22:49";"0C:1B:2C:3D:4E:F0";"SDJKL";"6566565665";"FFFFFAFAFAFAF";"37.7955";"-122.3934"`}
                    </code>
                </pre>
            </div>

            <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground pt-2">Note: Ensure your latitude and longitude values are valid decimal numbers. The file must use a semicolon (;) as the delimiter, not a comma.</p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;