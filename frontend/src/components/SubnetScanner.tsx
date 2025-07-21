// frontend/src/components/SubnetScanner.tsx
import { useState } from "react";
import type { ScanResult } from "../types/scan";
import { scanSubnet, createHost } from "../services/api";

interface SubnetScannerProps {
  onAdd: () => void;
}

export function SubnetScanner({ onAdd }: SubnetScannerProps) {
  const [prefix, setPrefix] = useState("");
  const [results, setResults] = useState<ScanResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scanSubnet(prefix);
      // only keep GREEN results
      setResults(data.filter(r => r.status !== "RED"));
    } catch (e) {
      console.error(e);
      setError("Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddHost = async (ip: string, hostname: string) => {
    let nameToUse = hostname;
    if (!hostname) {
      // ask user for a name if none found
      const entered = window.prompt(`No hostname for ${ip}. Enter a name to use:`);
      if (!entered) {
        return; // user cancelled
      }
      nameToUse = entered;
    }
    try {
      await createHost({ name: nameToUse, address: ip });
      // remove from the scan list
      setResults(prev => prev?.filter(r => r.address !== ip) ?? null);
      onAdd();
    } catch {
      alert("Failed to add host");
    }
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
            {results.map(r => (
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

