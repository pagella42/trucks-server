export interface CarrierData {
  inspections: Inspection[];
  crashes: Crash[];
}

export interface Inspection {
  inspection_date: string;
  report_state: string;
  report_number: string;
  level: number;
  time_weight: number;
  Placarable_HM_Veh_Insp: string;
  HM_inspection: string;
  vehicles: Vehicle[];
  violations: Violation[];
}

export interface Vehicle {
  unit: number;
  vehicle_id_number?: string;
  unit_type?: string;
  license_state?: string;
  license_number?: string;
}

export interface Violation {
  convicted_of_dif_charge: string;
  code?: string;
  description?: string;
  oos?: string;
  time_severity_weight?: number;
  BASIC?: string;
  unit?: string;
}

export interface Crash {
  vehicle_id_number: string;
  crash_date: string;
  report_state: string;
  report_number: string;
  fatal?: number;
  injury?: number;
  tow?: number;
  hazmat?: string;
}
