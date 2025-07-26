// frontend/src/types/host.ts

// Machine interface
export interface Machine {
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
  system_id: number;
  ssh_reachable: boolean;
  is_alive: boolean;
  passing_unit_tests: boolean;
  last_health_check?: string;
  created_at: string;
  updated_at: string;
}

// System interface
export interface System {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  machines: Machine[];
}

// Legacy Host interface for backward compatibility
export interface Host {
  id: number;
  name: string;
  address: string;
  alive?: boolean;         // is the host currently reachable?
  passingTests?: boolean;  // is it passing all configured health checks?
}

// Create/Update interfaces
export interface MachineCreate {
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
  system_id: number;
}

export interface MachineUpdate {
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

export interface SystemCreate {
  name: string;
  description?: string;
}

export interface SystemUpdate {
  name?: string;
  description?: string;
}


