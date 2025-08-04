// frontend/src/services/api.ts
import type { Cluster, ClusterCreate, Node, NodeCreate, NodeUpdate } from '../types/host';

const API_BASE = 'http://localhost:8080/api';

// Cluster API functions
export const clustersApi = {
  list: async (): Promise<Cluster[]> => {
    const response = await fetch(`${API_BASE}/clusters`);
    if (!response.ok) throw new Error('Failed to fetch clusters');
    return response.json();
  },

  create: async (cluster: ClusterCreate): Promise<Cluster> => {
    const response = await fetch(`${API_BASE}/clusters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cluster),
    });
    if (!response.ok) throw new Error('Failed to create cluster');
    return response.json();
  },
};

// Node API functions
export const nodesApi = {
  create: async (node: NodeCreate): Promise<Node> => {
    const response = await fetch(`${API_BASE}/nodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(node),
    });
    if (!response.ok) throw new Error('Failed to create node');
    return response.json();
  },

  get: async (id: number): Promise<Node> => {
    const response = await fetch(`${API_BASE}/nodes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch node');
    return response.json();
  },

  update: async (id: number, node: NodeUpdate): Promise<Node> => {
    const response = await fetch(`${API_BASE}/nodes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(node),
    });
    if (!response.ok) throw new Error('Failed to update node');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/nodes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete node');
  },
};
