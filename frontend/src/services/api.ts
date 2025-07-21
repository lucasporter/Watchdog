// frontend/src/services/api.ts
import axios from 'axios';
import type { Host, HostCreate } from '../types/host';
import type { ScanResult } from "../types/scan";

const API_URL = import.meta.env.VITE_API_URL as string;
console.log('⛓️ API_URL:', API_URL);

// create a shared axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// fetch all hosts
export async function fetchHosts(): Promise<Host[]> {
  const resp = await api.get<Host[]>('/api/hosts');
  return resp.data;
}

// create a new host
export async function createHost(payload: HostCreate): Promise<Host> {
  const resp = await api.post<Host>('/api/hosts', payload);
  return resp.data;
}

export async function deleteHost(id: number): Promise<void> {
  await api.delete(`/api/hosts/${id}`);
}

export async function scanSubnet(prefix: string): Promise<ScanResult[]> {
  const resp = await api.post<ScanResult[]>("/api/scan", { prefix });
  return resp.data;
}
