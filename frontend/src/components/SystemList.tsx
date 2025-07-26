import React, { useState, useEffect } from 'react';
import type { System, SystemCreate } from '../types/host';
import { systemsApi } from '../services/api';

export function SystemList() {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSystem, setNewSystem] = useState<SystemCreate>({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadSystems();
  }, []);

  const loadSystems = async () => {
    try {
      setLoading(true);
      const data = await systemsApi.list();
      setSystems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load systems');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSystem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await systemsApi.create(newSystem);
      setNewSystem({ name: '', description: '' });
      setShowCreateForm(false);
      loadSystems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create system');
    }
  };

  const handleDeleteSystem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this system? This will also delete all its machines.')) {
      return;
    }
    try {
      await systemsApi.delete(id);
      loadSystems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete system');
    }
  };

  if (loading) return <div>Loading systems...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Systems</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showCreateForm ? 'Cancel' : 'Add System'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateSystem} className="mb-4 p-4 border rounded">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">System Name:</label>
            <input
              type="text"
              value={newSystem.name}
              onChange={(e) => setNewSystem({ ...newSystem, name: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Description:</label>
            <textarea
              value={newSystem.description}
              onChange={(e) => setNewSystem({ ...newSystem, description: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create System
          </button>
        </form>
      )}

      <div className="space-y-4">
        {systems.map((system) => (
          <div key={system.id} className="border rounded p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{system.name}</h3>
                {system.description && (
                  <p className="text-gray-600 mt-1">{system.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Machines: {system.machines.length} | 
                  Created: {new Date(system.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteSystem(system.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
            
            {system.machines.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Machines:</h4>
                <div className="space-y-2">
                  {system.machines.map((machine) => (
                    <div key={machine.id} className="bg-gray-50 p-2 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{machine.name}</span>
                        <div className="flex space-x-2 text-sm">
                          <span className={`px-2 py-1 rounded ${
                            machine.is_alive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {machine.is_alive ? 'Online' : 'Offline'}
                          </span>
                          <span className={`px-2 py-1 rounded ${
                            machine.passing_unit_tests ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {machine.passing_unit_tests ? 'Tests Pass' : 'Tests Fail'}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {machine.ip_address} {machine.hostname && `(${machine.hostname})`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {systems.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No systems found. Create your first system to get started.
          </div>
        )}
      </div>
    </div>
  );
} 