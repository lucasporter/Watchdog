// frontend/src/types/scan.ts
export interface ScanResult {
  address: string;
  hostname: string;
  status: "RED" | "BLUE" | "GREEN";
}

