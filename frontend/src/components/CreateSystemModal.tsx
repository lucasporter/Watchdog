import { useState } from 'react';
import type { SystemCreate, MachineCreate } from '../types/host';
import { systemsApi, machinesApi } from '../services/api';

interface CreateSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSystemCreated: () => void;
}

interface NodeToAdd {
  name: string;
  ip_address: string;
  hostname: string;
}

export function CreateSystemModal({ isOpen, onClose, onSystemCreated }: CreateSystemModalProps) {
  const [systemName, setSystemName] = useState('');
  const [systemDescription, setSystemDescription] = useState('');
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
    console.log('Node added:', newNode);
    console.log('Total nodes:', nodes.length + 1);
  };

  const handleRemoveNode = (index: number) => {
    setNodes(nodes.filter((_, i) => i !== index));
  };

  const handleCreateSystem = async () => {
    console.log('Create System button clicked!');
    console.log('System name:', systemName);
    console.log('System description:', systemDescription);
    console.log('Nodes to create:', nodes);
    
    if (!systemName.trim()) {
      alert('System name is required');
      return;
    }

    if (nodes.length === 0) {
      alert('At least one node is required');
      return;
    }

    setIsCreating(true);
    try {
      console.log('Creating system...');
      
      // Create the system
      const newSystem: SystemCreate = {
        name: systemName.trim(),
        description: systemDescription.trim()
      };

      console.log('Creating system with data:', newSystem);
      const createdSystem = await systemsApi.create(newSystem);
      console.log('System created:', createdSystem);

      // Create all nodes for this system
      console.log('Creating nodes...');
      for (const node of nodes) {
        const newMachine: MachineCreate = {
          name: node.name,
          ip_address: node.ip_address || '',
          hostname: node.hostname || '',
          system_id: createdSystem.id,
          ssh_port: 22,
          operating_system: 'Unknown',
          notes: ''
        };

        console.log('Creating machine:', newMachine);
        await machinesApi.create(newMachine);
      }

      console.log('All nodes created successfully!');

      // Reset form and close modal
      setSystemName('');
      setSystemDescription('');
      setNodes([]);
      setCurrentNodeName('');
      setCurrentNodeIp('');
      setCurrentNodeHostname('');
      onSystemCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create system:', error);
      alert('Failed to create system. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setSystemName('');
    setSystemDescription('');
    setNodes([]);
    setCurrentNodeName('');
    setCurrentNodeIp('');
    setCurrentNodeHostname('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '64rem',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div className="modal-header" style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: 'white',
          flexShrink: 0
        }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create New System</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="modal-body" style={{
          padding: '1.5rem',
          overflowY: 'auto',
          flex: 1,
          backgroundColor: 'white'
        }}>
          {/* System Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Name *
                </label>
                <input
                  type="text"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter system name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={systemDescription}
                  onChange={(e) => setSystemDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter system description"
                />
              </div>
            </div>
          </div>

          {/* Add Node Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Nodes</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Node Name *
                  </label>
                  <input
                    type="text"
                    value={currentNodeName}
                    onChange={(e) => setCurrentNodeName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter node name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IP Address
                  </label>
                  <input
                    type="text"
                    value={currentNodeIp}
                    onChange={(e) => setCurrentNodeIp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter IP address (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hostname
                  </label>
                  <input
                    type="text"
                    value={currentNodeHostname}
                    onChange={(e) => setCurrentNodeHostname(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter hostname (optional)"
                  />
                </div>
              </div>
              <button
                onClick={handleAddNode}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Node
              </button>
            </div>
          </div>

          {/* Nodes Table */}
          {nodes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Nodes ({nodes.length})
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Node Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hostname
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {nodes.map((node, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {node.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {node.ip_address || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {node.hostname || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleRemoveNode(index)}
                            className="text-red-600 hover:text-red-900 transition-colors"
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
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{
          padding: '1.5rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          flexShrink: 0
        }}>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateSystem}
              disabled={isCreating || !systemName.trim() || nodes.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{
                backgroundColor: (!systemName.trim() || nodes.length === 0) ? '#9ca3af' : '#2563eb',
                cursor: (!systemName.trim() || nodes.length === 0) ? 'not-allowed' : 'pointer'
              }}
            >
              {isCreating ? 'Creating...' : 'Create System'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 