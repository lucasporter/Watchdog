import { useState, useEffect } from 'react';
import type { Machine } from '../types/host';
import { machinesApi } from '../services/api';

interface NodeDetailsProps {
  machineId: number;
  onBack: () => void;
}

export function NodeDetails({ machineId, onBack }: NodeDetailsProps) {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMachine();
  }, [machineId]);

  const loadMachine = async () => {
    try {
      setLoading(true);
      const data = await machinesApi.get(machineId);
      setMachine(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load machine details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading machine details...</div>;
  if (error) return <div className="text-red-600 text-center">Error: {error}</div>;
  if (!machine) return <div className="text-center text-gray-500">Machine not found</div>;

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{machine.name}</h1>
            <p className="text-gray-600">{machine.ip_address}</p>
          </div>
          <div className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${machine.is_alive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
            }
          `}>
            {machine.is_alive ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900">{machine.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">IP Address</label>
              <p className="text-gray-900">{machine.ip_address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Hostname</label>
              <p className="text-gray-900">{machine.hostname || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Operating System</label>
              <p className="text-gray-900">{machine.operating_system || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Connection Status</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`
                  w-3 h-3 rounded-full
                  ${machine.is_alive ? 'bg-green-500' : 'bg-red-500'}
                `} />
                <span className={machine.is_alive ? 'text-green-700' : 'text-red-700'}>
                  {machine.is_alive ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Unit Tests</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`
                  w-3 h-3 rounded-full
                  ${machine.passing_unit_tests ? 'bg-green-500' : 'bg-red-500'}
                `} />
                <span className={machine.passing_unit_tests ? 'text-green-700' : 'text-red-700'}>
                  {machine.passing_unit_tests ? 'Passing' : 'Failing'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Health Check</label>
              <p className="text-gray-900">
                {machine.last_health_check 
                  ? new Date(machine.last_health_check).toLocaleString()
                  : 'Never'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">SSH Reachable</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`
                  w-3 h-3 rounded-full
                  ${machine.ssh_reachable ? 'bg-green-500' : 'bg-red-500'}
                `} />
                <span className={machine.ssh_reachable ? 'text-green-700' : 'text-red-700'}>
                  {machine.ssh_reachable ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SSH Configuration */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">SSH Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">SSH Port</label>
              <p className="text-gray-900">{machine.ssh_port}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">SSH Username</label>
              <p className="text-gray-900">{machine.ssh_username || 'Not set'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-500">SSH Key Path</label>
              <p className="text-gray-900">{machine.ssh_key_path || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* System Information */}
        {(machine.cpu_info || machine.memory_info || machine.disk_info) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
            <div className="space-y-4">
              {machine.cpu_info && (
                <div>
                  <label className="text-sm font-medium text-gray-500">CPU</label>
                  <p className="text-gray-900">{machine.cpu_info}</p>
                </div>
              )}
              {machine.memory_info && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Memory</label>
                  <p className="text-gray-900">{machine.memory_info}</p>
                </div>
              )}
              {machine.disk_info && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Disk</label>
                  <p className="text-gray-900">{machine.disk_info}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {machine.notes && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
            <p className="text-gray-900 whitespace-pre-wrap">{machine.notes}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Timestamps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Created</label>
              <p className="text-gray-900">{new Date(machine.created_at).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-gray-900">{new Date(machine.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 