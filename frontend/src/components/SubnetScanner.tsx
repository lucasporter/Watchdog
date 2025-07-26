// frontend/src/components/SubnetScanner.tsx
import { useState } from 'react';
import { scanApi } from '../services/api';

interface SubnetScannerProps {
  onAdd: () => void;
}

export function SubnetScanner({ onAdd }: SubnetScannerProps) {
  const [prefix, setPrefix] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[] | null>(null);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scanApi.scanSubnet(prefix);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHost = async (address: string, hostname: string) => {
    // TODO: Implement host creation when needed
    console.log("Host creation not implemented yet", { address, hostname });
    onAdd();
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">Scan Subnet</h2>
      <div className="flex space-x-2 mb-2">
        <input
          className="border px-2 py-1 flex-1"
          placeholder="e.g. 192.168.1"
          value={prefix}
          onChange={e => setPrefix(e.target.value)}
        />
        <button
          onClick={handleScan}
          disabled={loading || !prefix}
          className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
        >
          {loading ? "Scanning…" : "Scan"}
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}

      {results && (
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">IP</th>
              <th className="px-4 py-2 text-left">Hostname</th>
              <th className="px-4 py-2">Add</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r: any) => (
              <tr key={r.address} className="hover:bg-gray-50">
                <td className="border-t px-4 py-2">{r.address}</td>
                <td className="border-t px-4 py-2">
                  {r.hostname || <span className="italic text-gray-500">—</span>}
                </td>
                <td className="border-t px-4 py-2 text-center">
                  <button
                    onClick={() => handleAddHost(r.address, r.hostname)}
                    className="text-green-600 hover:underline"
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                  No reachable hosts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

