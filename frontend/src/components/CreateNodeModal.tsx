import { useState } from 'react';
import type { NodeCreate } from '../types/host';
import { nodesApi } from '../services/api';
import { Modal } from './Modal';

interface CreateNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNodeCreated: () => void;
  clusterId: number;
  clusterName: string;
}

export function CreateNodeModal({ isOpen, onClose, onNodeCreated, clusterId, clusterName }: CreateNodeModalProps) {
  const [formData, setFormData] = useState<Partial<NodeCreate>>({
    name: '',
    ip_address: '',
    hostname: '',
    ssh_port: 22,
    ssh_username: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ip_address) {
      setError('Name and IP address are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const nodeData: NodeCreate = {
        name: formData.name,
        ip_address: formData.ip_address,
        hostname: formData.hostname || undefined,
        ssh_port: formData.ssh_port || 22,
        ssh_username: formData.ssh_username || undefined,
        notes: formData.notes || undefined,
        cluster_id: clusterId
      };

      await nodesApi.create(nodeData);
      
      // Reset form
      setFormData({
        name: '',
        ip_address: '',
        hostname: '',
        ssh_port: 22,
        ssh_username: '',
        notes: ''
      });
      
      onNodeCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create node');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof NodeCreate, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Node to ${clusterName}`}>
      <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-md">
              <div className="text-sm text-red-400">{error}</div>
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Node Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none modal-input"
                placeholder="e.g., Web Server 1"
                required
              />
            </div>

            {/* IP Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                IP Address *
              </label>
              <input
                type="text"
                value={formData.ip_address}
                onChange={(e) => handleInputChange('ip_address', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none modal-input"
                placeholder="e.g., 192.168.1.100"
                required
              />
            </div>

            {/* Hostname */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Hostname
              </label>
              <input
                type="text"
                value={formData.hostname}
                onChange={(e) => handleInputChange('hostname', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none modal-input"
                placeholder="e.g., web-server-1.local"
              />
            </div>

            {/* SSH Port */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                SSH Port
              </label>
              <input
                type="number"
                value={formData.ssh_port}
                onChange={(e) => handleInputChange('ssh_port', parseInt(e.target.value) || 22)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none modal-input"
                placeholder="22"
                min="1"
                max="65535"
              />
            </div>

            {/* SSH Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                SSH Username
              </label>
              <input
                type="text"
                value={formData.ssh_username}
                onChange={(e) => handleInputChange('ssh_username', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none modal-input"
                placeholder="e.g., root"
              />
            </div>



            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none modal-input"
                placeholder="Optional notes about this node..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Add Node'}
            </button>
          </div>
        </form>
    </Modal>
  );
} 