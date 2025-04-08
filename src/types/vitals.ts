
// Vital data types
export interface VitalReading {
  value: number;
  unit: string;
  normalRange: {
    min: number;
    max: number;
  };
  history: {
    date: string;
    value: number;
  }[];
}

export interface PatientVitals {
  heartRate: VitalReading;
  bloodPressure: VitalReading;
  bloodSugar: VitalReading;
  bodyTemperature: VitalReading;
  weight: VitalReading;
}
