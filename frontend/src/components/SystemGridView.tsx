import { useState, useEffect } from 'react';
import type { System, Machine, SystemCreate, MachineCreate } from '../types/host';
import { systemsApi, machinesApi } from '../services/api';
import { CreateSystemModal } from './CreateSystemModal';

interface SystemGridViewProps {
  onNodeClick: (machine: Machine) => void;
}

export function SystemGridView({ onNodeClick }: SystemGridViewProps) {
  const [systems, setSystems] = useState<System[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadSystems();
  }, []);

  const loadSystems = async () => {
    try {
      setLoading(true);
      const data = await systemsApi.list();
      setSystems(data);
      
      if (data.length > 0) {
        setSelectedSystemId(data[0].id);
      } else {
        // Create placeholder system and node if none exist
        await createPlaceholderSystem();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load systems');
    } finally {
      setLoading(false);
    }
  };

  const createPlaceholderSystem = async () => {
    try {
      // Create placeholder system
      const newSystem: SystemCreate = {
        name: "UntitledSystem",
        description: "Placeholder system created automatically"
      };
      
      const createdSystem = await systemsApi.create(newSystem);
      
      // Create placeholder machine without IP
      const newMachine: MachineCreate = {
        name: "UntitledNode",
        ip_address: "", // No IP assigned
        system_id: createdSystem.id,
        ssh_port: 22,
        operating_system: "Unknown",
        notes: "Placeholder node created automatically - assign an IP address to enable monitoring"
      };
      
      await machinesApi.create(newMachine);
      
      // Reload systems to get the updated data
      const updatedSystems = await systemsApi.list();
      setSystems(updatedSystems);
      setSelectedSystemId(createdSystem.id);
    } catch (err) {
      console.error('Failed to create placeholder system:', err);
      setError('Failed to create placeholder system');
    }
  };

  const handleSystemCreated = () => {
    loadSystems();
  };

  const getNodeStatusColor = (machine: Machine) => {
    if (!machine.ip_address || machine.ip_address.trim() === '') {
      return 'gray';
    }
    return machine.is_alive ? 'green' : 'red';
  };

  const getNodeStatusDot = (machine: Machine) => {
    if (!machine.ip_address || machine.ip_address.trim() === '') {
      return 'bg-gray-400';
    }
    return machine.is_alive ? 'bg-green-500' : 'bg-red-500';
  };

  const selectedSystem = systems.find(s => s.id === selectedSystemId);

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-lg text-gray-600">Loading systems...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <div className="text-red-600 text-lg mb-2">Error loading systems</div>
        <div className="text-gray-600">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm m-4" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      margin: '1rem'
    }}>
      {/* System Tabs */}
      <div className="system-tabs border-b border-gray-200 bg-white rounded-t-lg" style={{
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white',
        borderTopLeftRadius: '0.5rem',
        borderTopRightRadius: '0.5rem'
      }}>
        <div className="flex px-6 py-0">
          {systems.map((system, index) => (
            <button
              key={system.id}
              onClick={() => setSelectedSystemId(system.id)}
              className={`tab-button ${selectedSystemId === system.id ? 'active' : ''} px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                selectedSystemId === system.id
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
              style={{
                borderBottom: selectedSystemId === system.id ? '2px solid #2563eb' : '2px solid transparent',
                backgroundColor: selectedSystemId === system.id ? 'white' : 'transparent',
                color: selectedSystemId === system.id ? '#2563eb' : '#6b7280',
                marginRight: '0',
                borderRadius: '0',
                borderTopLeftRadius: index === 0 ? '0.5rem' : '0',
                borderTopRightRadius: index === systems.length - 1 ? '0.5rem' : '0'
              }}
            >
              <div className="flex items-center space-x-2">
                <span>{system.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  selectedSystemId === system.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {system.machines.length}
                </span>
              </div>
            </button>
          ))}
          
          {/* Plus Tab */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="tab-button px-6 py-3 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all duration-200"
            style={{
              borderBottom: '2px solid transparent',
              backgroundColor: 'transparent',
              color: '#6b7280',
              marginRight: '0',
              borderRadius: '0',
              borderTopRightRadius: '0.5rem'
            }}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add System</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content - Sidebar + Grid */}
      <div className="flex-1 flex bg-gray-50" style={{
        flex: 1,
        display: 'flex',
        backgroundColor: '#f9fafb'
      }}>
        {selectedSystem && (
          <>
            {/* Sidebar */}
            <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200" style={{
              width: '320px',
              flexShrink: 0,
              backgroundColor: 'white',
              borderRight: '1px solid #e5e7eb'
            }}>
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">System Nodes</h3>
                      <p className="text-sm text-gray-500">
                        {selectedSystem.machines.length} nodes in this system
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {selectedSystem.machines.length === 0 ? (
                    <div className="p-6 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="text-gray-500 text-sm">No nodes in this system</div>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {selectedSystem.machines.map((machine) => (
                        <div
                          key={machine.id}
                          onClick={() => onNodeClick(machine)}
                          className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`
                              w-3 h-3 rounded-full flex-shrink-0 shadow-sm
                              ${getNodeStatusDot(machine)}
                            `} />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {machine.hostname || machine.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Grid View */}
            <div className="flex-1 p-6 overflow-auto" style={{
              flex: 1,
              padding: '1.5rem',
              overflow: 'auto'
            }}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedSystem.name}</h2>
                {selectedSystem.description && (
                  <p className="text-gray-600">{selectedSystem.description}</p>
                )}
              </div>

              {selectedSystem.machines.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="text-lg font-medium text-gray-900 mb-2">No machines in this system</div>
                  <div className="text-gray-600">Add some machines to get started</div>
                </div>
              ) : (
                <div className="node-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                  {selectedSystem.machines.map((machine) => (
                    <div
                      key={machine.id}
                      onClick={() => onNodeClick(machine)}
                      className={`node-card node-card-${getNodeStatusColor(machine)} aspect-square rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 transform`}
                    >
                      <div className="h-full flex flex-col justify-center items-center p-4 text-center">
                        <div className={`status-dot status-dot-${getNodeStatusDot(machine)} w-4 h-4 rounded-full mb-3 shadow-sm`} />
                        <div className="node-name font-semibold text-gray-900 truncate w-full mb-1">
                          {machine.name}
                        </div>
                        <div className="node-ip text-sm text-gray-600 truncate w-full mb-2">
                          {machine.ip_address || 'No IP assigned'}
                        </div>
                        {machine.hostname && (
                          <div className="text-xs text-gray-500 truncate w-full">
                            {machine.hostname}
                          </div>
                        )}
                        <div className="mt-auto pt-2">
                          <div className={`status-badge status-badge-${machine.passing_unit_tests ? 'green' : 'red'} inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}>
                            {machine.passing_unit_tests ? '✓ Tests Pass' : '✗ Tests Fail'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create System Modal */}
      <CreateSystemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSystemCreated={handleSystemCreated}
      />
    </div>
  );
} 