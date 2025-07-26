// frontend/src/services/api.ts
import type { System, SystemCreate, SystemUpdate, Machine, MachineCreate, MachineUpdate } from '../types/host';

const API_BASE = 'http://localhost:8080/api';

// System API functions
export const systemsApi = {
  list: async (): Promise<System[]> => {
    const response = await fetch(`${API_BASE}/systems`);
    if (!response.ok) throw new Error('Failed to fetch systems');
    return response.json();
  },

  create: async (system: SystemCreate): Promise<System> => {
    const response = await fetch(`${API_BASE}/systems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(system),
    });
    if (!response.ok) throw new Error('Failed to create system');
    return response.json();
  },

  get: async (id: number): Promise<System> => {
    const response = await fetch(`${API_BASE}/systems/${id}`);
    if (!response.ok) throw new Error('Failed to fetch system');
    return response.json();
  },

  update: async (id: number, system: SystemUpdate): Promise<System> => {
    const response = await fetch(`${API_BASE}/systems/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(system),
    });
    if (!response.ok) throw new Error('Failed to update system');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/systems/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete system');
  },
};

// Machine API functions
export const machinesApi = {
  list: async (): Promise<Machine[]> => {
    const response = await fetch(`${API_BASE}/machines`);
    if (!response.ok) throw new Error('Failed to fetch machines');
    return response.json();
  },

  listBySystem: async (systemId: number): Promise<Machine[]> => {
    const response = await fetch(`${API_BASE}/systems/${systemId}/machines`);
    if (!response.ok) throw new Error('Failed to fetch system machines');
    return response.json();
  },

  create: async (machine: MachineCreate): Promise<Machine> => {
    const response = await fetch(`${API_BASE}/machines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(machine),
    });
    if (!response.ok) throw new Error('Failed to create machine');
    return response.json();
  },

  get: async (id: number): Promise<Machine> => {
    const response = await fetch(`${API_BASE}/machines/${id}`);
    if (!response.ok) throw new Error('Failed to fetch machine');
    return response.json();
  },

  update: async (id: number, machine: MachineUpdate): Promise<Machine> => {
    const response = await fetch(`${API_BASE}/machines/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(machine),
    });
    if (!response.ok) throw new Error('Failed to update machine');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/machines/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete machine');
  },
};

// Legacy API functions for backward compatibility
export const hostsApi = {
  list: async (): Promise<Machine[]> => {
    const response = await fetch(`${API_BASE}/hosts`);
    if (!response.ok) throw new Error('Failed to fetch hosts');
    return response.json();
  },
};

// Scan API functions
export const scanApi = {
  scanSubnet: async (prefix: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix }),
    });
    if (!response.ok) throw new Error('Failed to scan subnet');
    return response.json();
  },
};
