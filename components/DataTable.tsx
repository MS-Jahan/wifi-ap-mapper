import React, { useEffect, useRef } from 'react';
import { APData } from '../types';

interface DataTableProps {
  data: APData[];
  selectedAp: APData | null;
  onRowClick: (ap: APData) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, selectedAp, onRowClick }) => {
  const rowRefs = useRef<Map<string, HTMLTableRowElement | null>>(new Map());

  useEffect(() => {
    if (selectedAp) {
      const rowElement = rowRefs.current.get(selectedAp.BSSID);
      rowElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedAp]);

  const headers: (keyof APData)[] = ["ESSID", "BSSID", "WPA PSK", "WPS PIN", "Date"];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left text-foreground dark:text-dark-foreground">
        <thead className="text-xs uppercase bg-secondary dark:bg-dark-secondary sticky top-0">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((ap) => {
            const isSelected = selectedAp?.BSSID === ap.BSSID;
            return (
              <tr
                key={ap.BSSID}
                // FIX: The ref callback was implicitly returning a `Map` instance because `Map.set()` returns `this`.
                // A ref callback must return `void`. Wrapping the statement in curly braces fixes this by creating
                // a block statement which correctly returns `undefined`.
                ref={(el) => { rowRefs.current.set(ap.BSSID, el); }}
                onClick={() => onRowClick(ap)}
                className={`border-b border-border dark:border-dark-border cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-accent dark:bg-dark-accent'
                    : 'hover:bg-secondary dark:hover:bg-dark-secondary'
                }`}
              >
                {headers.map((header) => (
                    <td key={`${ap.BSSID}-${header}`} className="px-6 py-4 whitespace-nowrap">
                        {ap[header]}
                    </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
