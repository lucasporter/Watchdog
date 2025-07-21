// frontend/src/App.tsx
import React, { useEffect, useState } from 'react';
import { SubnetScanner } from './components/SubnetScanner';
import { HostForm } from './components/HostForm';
import { HostList } from './components/HostList';
import type { Host } from './types/host';
import { fetchHosts, deleteHost } from './services/api';

function App() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the list of hosts from the backend
  const loadHosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHosts();
      setHosts(data);
    } catch {
      setError('Failed to load hosts');
    } finally {
      setLoading(false);
    }
  };

  // Delete a host and then reload the list
  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this host?')) return;
    try {
      await deleteHost(id);
      loadHosts();
    } catch {
      alert('Failed to delete host');
    }
  };

  // Load hosts on component mount
  useEffect(() => {
    loadHosts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Watchdog – Hosts</h1>

      {/* Scan a subnet and add selected hosts */}
      <SubnetScanner onAdd={loadHosts} />

      {/* Form to add a single host by name/address */}
      <HostForm onSuccess={loadHosts} />

      {/* Table of existing hosts with delete action */}
      <HostList
        hosts={hosts}
        loading={loading}
        error={error}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;

