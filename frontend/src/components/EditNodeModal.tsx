import { useState, useEffect } from 'react';
import type { Node, NodeUpdate } from '../types/host';
import { nodesApi } from '../services/api';
import { Modal } from './Modal';

interface EditNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNodeUpdated: () => void;
  node: Node | null;
}

export function EditNodeModal({ isOpen, onClose, onNodeUpdated, node }: EditNodeModalProps) {
  const [formData, setFormData] = useState<NodeUpdate>({
    name: '',
    ip_address: '',
    ssh_port: 22,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (node && isOpen) {
      setFormData({
        name: node.name,
        ip_address: node.ip_address || '',
        ssh_port: node.ssh_port || 22,
        notes: node.notes || ''
      });
      setError(null);
    }
  }, [node, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!node) return;

    setLoading(true);
    setError(null);

    try {
      await nodesApi.update(node.id, formData);
      onNodeUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update node');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof NodeUpdate, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen || !node) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Node">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h3 className="text-lg font-medium text-gray-100 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Node Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none modal-input"
                    placeholder="Enter node name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    IP Address
                  </label>
                  <input
                    type="text"
                    value={formData.ip_address}
                    onChange={(e) => handleInputChange('ip_address', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none modal-input"
                    placeholder="192.168.1.100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    SSH Port
                  </label>
                  <input
                    type="number"
                    value={formData.ssh_port}
                    onChange={(e) => handleInputChange('ssh_port', parseInt(e.target.value) || 22)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none modal-input"
                    placeholder="22"
                    min="1"
                    max="65535"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h3 className="text-lg font-medium text-gray-100 mb-4">Notes</h3>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none modal-input"
                placeholder="Add any additional notes about this node..."
              />
            </div>
          </form>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 hover:text-gray-100 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Node'}
            </button>
          </div>
        </Modal>
      );
    } 