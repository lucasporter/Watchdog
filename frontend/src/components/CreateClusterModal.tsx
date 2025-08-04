import { useState } from 'react';
import type { ClusterCreate, NodeCreate } from '../types/host';
import { clustersApi, nodesApi } from '../services/api';
import { Modal } from './Modal';

interface CreateClusterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClusterCreated: () => void;
}

interface NodeToAdd {
  name: string;
  ip_address: string;
  hostname: string;
}

export function CreateClusterModal({ isOpen, onClose, onClusterCreated }: CreateClusterModalProps) {
  const [clusterName, setClusterName] = useState('');
  const [clusterDescription, setClusterDescription] = useState('');
  const [nodes, setNodes] = useState<NodeToAdd[]>([]);
  const [currentNodeName, setCurrentNodeName] = useState('');
  const [currentNodeIp, setCurrentNodeIp] = useState('');
  const [currentNodeHostname, setCurrentNodeHostname] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleAddNode = () => {
    if (!currentNodeName.trim()) {
      alert('Node name is required');
      return;
    }

    const newNode: NodeToAdd = {
      name: currentNodeName.trim(),
      ip_address: currentNodeIp.trim(),
      hostname: currentNodeHostname.trim()
    };

    setNodes([...nodes, newNode]);
    setCurrentNodeName('');
    setCurrentNodeIp('');
    setCurrentNodeHostname('');
  };

  const handleRemoveNode = (index: number) => {
    setNodes(nodes.filter((_, i) => i !== index));
  };

  const handleCreateCluster = async () => {
    if (!clusterName.trim()) {
      alert('Cluster name is required');
      return;
    }

    if (nodes.length === 0) {
      alert('At least one node is required');
      return;
    }

    setIsCreating(true);
    try {
      // Create the cluster
      const newCluster: ClusterCreate = {
        name: clusterName.trim(),
        description: clusterDescription.trim()
      };

      const createdCluster = await clustersApi.create(newCluster);

      // Create all nodes for this cluster
      for (const node of nodes) {
        const newNode: NodeCreate = {
          name: node.name,
          ip_address: node.ip_address || '',
          hostname: node.hostname || '',
          cluster_id: createdCluster.id,
          ssh_port: 22,
          operating_system: 'Unknown',
          notes: ''
        };

        await nodesApi.create(newNode);
      }

      // Reset form and close modal
      setClusterName('');
      setClusterDescription('');
      setNodes([]);
      setCurrentNodeName('');
      setCurrentNodeIp('');
      setCurrentNodeHostname('');
      onClusterCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create cluster:', error);
      alert('Failed to create cluster. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setClusterName('');
    setClusterDescription('');
    setNodes([]);
    setCurrentNodeName('');
    setCurrentNodeIp('');
    setCurrentNodeHostname('');
    onClose();
  };

    return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Create New Cluster" maxWidth="max-w-4xl">
      {/* Cluster Information */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-100 mb-4">Cluster Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cluster Name *
            </label>
            <input
              type="text"
              value={clusterName}
              onChange={(e) => setClusterName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none modal-input"
              placeholder="Enter cluster name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={clusterDescription}
              onChange={(e) => setClusterDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none modal-input"
              placeholder="Enter cluster description"
            />
          </div>
        </div>
      </div>

                     {/* Add Node Section */}
           <div className="mb-6">
             <h3 className="text-lg font-medium text-gray-100 mb-4">Add Nodes</h3>
             <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Node Name *
                   </label>
                                       <input
                      type="text"
                      value={currentNodeName}
                      onChange={(e) => setCurrentNodeName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none modal-input"
                      placeholder="Enter node name"
                    />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     IP Address
                   </label>
                                       <input
                      type="text"
                      value={currentNodeIp}
                      onChange={(e) => setCurrentNodeIp(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none modal-input"
                      placeholder="Enter IP address (optional)"
                    />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Hostname
                   </label>
                                       <input
                      type="text"
                      value={currentNodeHostname}
                      onChange={(e) => setCurrentNodeHostname(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none modal-input"
                      placeholder="Enter hostname (optional)"
                    />
                 </div>
               </div>
               <button
                 onClick={handleAddNode}
                 className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
               >
                 Add Node
               </button>
             </div>
           </div>

          {/* Nodes Table */}
          {nodes.length > 0 && (
            <div className="mb-6">
                             <h3 className="text-lg font-medium text-gray-100 mb-4">
                 Nodes ({nodes.length})
               </h3>
              <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Node Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Hostname
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {nodes.map((node, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                          {node.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {node.ip_address || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {node.hostname || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          <button
                            onClick={() => handleRemoveNode(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
                      <button
              onClick={handleCreateCluster}
              disabled={isCreating || !clusterName.trim() || nodes.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Creating...' : 'Create Cluster'}
            </button>
        </div>
    </Modal>
  );
} 