// frontend/src/types/host.ts

// Node interface
export interface Node {
  id: number;
  name: string;
  ip_address: string;
  hostname?: string;
  ssh_port: number;
  ssh_username?: string;
  ssh_key_path?: string;
  operating_system?: string;
  cpu_info?: string;
  memory_info?: string;
  disk_info?: string;
  notes?: string;
  cluster_id: number;
  ssh_reachable: boolean;
  is_alive: boolean;
  passing_unit_tests: boolean;
  last_health_check?: string;
  created_at: string;
  updated_at: string;
}

// Cluster interface
export interface Cluster {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  nodes: Node[];
}

// Create/Update interfaces
export interface NodeCreate {
  name: string;
  ip_address: string;
  hostname?: string;
  ssh_port?: number;
  ssh_username?: string;
  ssh_key_path?: string;
  operating_system?: string;
  cpu_info?: string;
  memory_info?: string;
  disk_info?: string;
  notes?: string;
  cluster_id: number;
}

export interface NodeUpdate {
  name?: string;
  ip_address?: string;
  hostname?: string;
  ssh_port?: number;
  ssh_username?: string;
  ssh_key_path?: string;
  operating_system?: string;
  cpu_info?: string;
  memory_info?: string;
  disk_info?: string;
  notes?: string;
}

export interface ClusterCreate {
  name: string;
  description?: string;
}


