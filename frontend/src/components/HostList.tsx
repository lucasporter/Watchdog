// frontend/src/components/HostList.tsx
import React from 'react';
import type { Host } from '../types/host';

interface HostListProps {
  hosts: Host[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number) => void;
}

export const HostList: React.FC<HostListProps> = ({
  hosts,
  loading,
  error,
  onDelete,
}) => {
  if (loading) return <p>Loading hosts…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;
  if (!hosts.length) return <p>No hosts found.</p>;

  return (
    <table className="min-w-full bg-white border">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
          <th className="px-4 py-2 text-left text-sm font-medium">Address</th>
          <th className="px-4 py-2 text-left text-sm font-medium">Alive</th>
          <th className="px-4 py-2 text-left text-sm font-medium">Tests</th>
          <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {hosts.map(host => {
          // only false = failing; undefined or true => passing
          const testsPass = host.passingTests !== false;
          return (
            <tr key={host.id} className="hover:bg-gray-50">
              <td className="border-t px-4 py-2 text-sm">{host.name}</td>
              <td className="border-t px-4 py-2 text-sm">{host.address}</td>
              <td className="border-t px-4 py-2 text-sm">
                {host.alive
                  ? <span className="text-green-600">🟢</span>
                  : <span className="text-red-600">🔴</span>}
              </td>
              <td className="border-t px-4 py-2 text-sm">
                {testsPass
                  ? <span className="text-green-600">✅</span>
                  : <span className="text-red-600">❌</span>}
              </td>
              <td className="border-t px-4 py-2 text-sm">
                <button
                  onClick={() => onDelete(host.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

