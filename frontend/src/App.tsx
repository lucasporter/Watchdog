// frontend/src/App.tsx
import { useState } from 'react';
import { SystemGridView } from './components/SystemGridView';
import { NodeDetails } from './components/NodeDetails';
import type { Machine } from './types/host';

type ViewMode = 'grid' | 'details';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedMachineId, setSelectedMachineId] = useState<number | null>(null);

  const handleNodeClick = (machine: Machine) => {
    setSelectedMachineId(machine.id);
    setViewMode('details');
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedMachineId(null);
  };

  return (
    <div className="app-container min-h-screen bg-gray-50" style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    }}>
      {/* Header */}
      <header className="header bg-white shadow-sm border-b border-gray-200" style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 1.5rem'
      }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Watchdog</h1>
                  <span className="text-sm text-gray-500">System Monitor</span>
                </div>
              </div>
            </div>
            {viewMode === 'details' && (
              <button
                onClick={handleBackToGrid}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Grid View
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content flex h-[calc(100vh-80px)]" style={{
        display: 'flex',
        height: 'calc(100vh - 80px)'
      }}>
        {viewMode === 'grid' ? (
          /* Grid View with integrated sidebar */
          <div className="flex-1 overflow-hidden bg-gray-50" style={{
            flex: 1,
            overflow: 'hidden',
            backgroundColor: '#f9fafb'
          }}>
            <SystemGridView onNodeClick={handleNodeClick} />
          </div>
        ) : (
          /* Details View */
          <div className="flex-1 overflow-auto bg-gray-50" style={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: '#f9fafb'
          }}>
            {selectedMachineId && (
              <NodeDetails 
                machineId={selectedMachineId} 
                onBack={handleBackToGrid} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

