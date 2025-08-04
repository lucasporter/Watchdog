import { useState, useEffect } from 'react';
import type { Node } from '../types/host';
import { nodesApi } from '../services/api';

interface NodeDetailsProps {
  nodeId: number;
  onBack: () => void;
}

export function NodeDetails({ nodeId, onBack }: NodeDetailsProps) {
  const [node, setNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNode();
  }, [nodeId]);

  const loadNode = async () => {
    try {
      setLoading(true);
      const data = await nodesApi.get(nodeId);
      setNode(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load node details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-300">Loading node details...</div>;
  if (error) return <div className="text-red-400 text-center">Error: {error}</div>;
  if (!node) return <div className="text-center text-gray-400">Node not found</div>;

  return (
    <div className="h-full bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{node.name}</h1>
            <p className="text-gray-400">{node.ip_address}</p>
          </div>
          <div className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${node.is_alive 
              ? 'bg-green-900 text-green-400 border border-green-700' 
              : 'bg-red-900 text-red-400 border border-red-700'
            }
          `}>
            {node.is_alive ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-400">Name</label>
              <p className="text-gray-100">{node.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">IP Address</label>
              <p className="text-gray-100">{node.ip_address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Hostname</label>
              <p className="text-gray-100">{node.hostname || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Operating System</label>
              <p className="text-gray-100">{node.operating_system || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Health Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-400">Connection Status</label>
                            <div className="flex items-center space-x-2 mt-1">
                <div className={`
                  w-3 h-3 rounded-full
                  ${node.is_alive ? 'bg-green-500' : 'bg-red-500'}
                `} />
                <span className={node.is_alive ? 'text-green-400' : 'text-red-400'}>
                  {node.is_alive ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Unit Tests</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`
                  w-3 h-3 rounded-full
                  ${node.passing_unit_tests ? 'bg-green-500' : 'bg-red-500'}
                `} />
                <span className={node.passing_unit_tests ? 'text-green-400' : 'text-red-400'}>
                  {node.passing_unit_tests ? 'Passing' : 'Failing'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Last Health Check</label>
              <p className="text-gray-100">
                {node.last_health_check
                  ? new Date(node.last_health_check).toLocaleString()
                  : 'Never'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">SSH Reachable</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`
                  w-3 h-3 rounded-full
                  ${node.ssh_reachable ? 'bg-green-500' : 'bg-red-500'}
                `} />
                <span className={node.ssh_reachable ? 'text-green-700' : 'text-red-700'}>
                  {node.ssh_reachable ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>

                 {/* SSH Configuration */}
         <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
           <h3 className="text-lg font-semibold text-gray-100 mb-4">SSH Configuration</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="text-sm font-medium text-gray-400">SSH Port</label>
               <p className="text-gray-100">{node.ssh_port}</p>
             </div>
             <div>
               <label className="text-sm font-medium text-gray-400">SSH Username</label>
               <p className="text-gray-100">{node.ssh_username || 'Not set'}</p>
             </div>
             <div className="md:col-span-2">
               <label className="text-sm font-medium text-gray-400">SSH Key Path</label>
               <p className="text-gray-100">{node.ssh_key_path || 'Not set'}</p>
             </div>
           </div>
         </div>

                 {/* System Information */}
                  {(node.cpu_info || node.memory_info || node.disk_info) && (
           <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
             <h3 className="text-lg font-semibold text-gray-100 mb-4">System Information</h3>
             <div className="space-y-4">
               {node.cpu_info && (
                 <div>
                   <label className="text-sm font-medium text-gray-400">CPU</label>
                   <p className="text-gray-100">{node.cpu_info}</p>
                 </div>
               )}
               {node.memory_info && (
                 <div>
                   <label className="text-sm font-medium text-gray-400">Memory</label>
                   <p className="text-gray-100">{node.memory_info}</p>
                 </div>
               )}
               {node.disk_info && (
                 <div>
                   <label className="text-sm font-medium text-gray-400">Disk</label>
                   <p className="text-gray-100">{node.disk_info}</p>
                 </div>
               )}
             </div>
           </div>
         )}

         {/* Notes */}
         {node.notes && (
           <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
             <h3 className="text-lg font-semibold text-gray-100 mb-4">Notes</h3>
             <p className="text-gray-100 whitespace-pre-wrap">{node.notes}</p>
           </div>
         )}

         {/* Timestamps */}
         <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
           <h3 className="text-lg font-semibold text-gray-100 mb-4">Timestamps</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="text-sm font-medium text-gray-400">Created</label>
               <p className="text-gray-100">{new Date(node.created_at).toLocaleString()}</p>
             </div>
             <div>
               <label className="text-sm font-medium text-gray-400">Last Updated</label>
               <p className="text-gray-100">{new Date(node.updated_at).toLocaleString()}</p>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
} 