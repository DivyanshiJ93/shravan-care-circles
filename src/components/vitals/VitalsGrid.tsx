
import React from 'react';
import VitalCard from '@/components/VitalCard';
import { PatientVitals } from '@/types/vitals';

interface VitalsGridProps {
  patientData: PatientVitals;
  selectedMetric: keyof PatientVitals;
  setSelectedMetric: (metric: keyof PatientVitals) => void;
  getMetricDisplayName: (metric: keyof PatientVitals) => string;
  getVitalIcon: (vitalType: keyof PatientVitals) => React.ReactNode;
  getVitalStatus: (value: number, normalRange: {min: number, max: number}) => 'normal' | 'warning' | 'critical';
}

export default function VitalsGrid({
  patientData,
  selectedMetric,
  setSelectedMetric,
  getMetricDisplayName,
  getVitalIcon,
  getVitalStatus
}: VitalsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {Object.entries(patientData).map(([key, data]) => {
        const vitalKey = key as keyof PatientVitals;
        return (
          <VitalCard 
            key={key}
            title={getMetricDisplayName(vitalKey)}
            value={data.value}
            unit={data.unit}
            status={getVitalStatus(data.value, data.normalRange)}
            onClick={() => setSelectedMetric(vitalKey)}
            isSelected={selectedMetric === key}
            normalRange={data.normalRange}
            icon={getVitalIcon(vitalKey)}
            history={data.history}
          />
        );
      })}
    </div>
  );
}
