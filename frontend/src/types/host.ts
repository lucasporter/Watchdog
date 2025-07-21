// frontend/src/types/host.ts
export interface Host {
  id: number;
  name: string;
  address: string;
  alive?: boolean;         // is the host currently reachable?
  passingTests?: boolean;  // is it passing all configured health checks?
}

export interface HostCreate {
  name: string;
  address: string;
}


