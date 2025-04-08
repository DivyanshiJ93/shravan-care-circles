
import React, { useState } from 'react';
import VitalsGrid from '@/components/vitals/VitalsGrid';
import VitalsChart from '@/components/vitals/VitalsChart';
import VitalsAnalysis from '@/components/vitals/VitalsAnalysis';
import ShravanBot from '@/components/ShravanBot';
import { Heart, Thermometer, Gauge, Droplets, Weight } from 'lucide-react';
import { PatientVitals } from '@/types/vitals';

export default function VitalsTracker() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [showAnomalies, setShowAnomalies] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<keyof PatientVitals>('heartRate');
  
  // Mock patient data
  const patientData: PatientVitals = {
    heartRate: {
      value: 72,
      unit: 'bpm',
      normalRange: { min: 60, max: 100 },
      history: [
        { date: '2024-03-01', value: 72 },
        { date: '2024-03-02', value: 75 },
        { date: '2024-03-03', value: 70 },
        { date: '2024-03-04', value: 68 },
        { date: '2024-03-05', value: 71 },
        { date: '2024-03-06', value: 73 },
        { date: '2024-03-07', value: 105 }, // Anomaly
        { date: '2024-03-08', value: 77 },
        { date: '2024-03-09', value: 76 },
        { date: '2024-03-10', value: 74 }
      ]
    },
    bloodPressure: {
      value: 120,
      unit: 'mmHg',
      normalRange: { min: 90, max: 140 },
      history: [
        { date: '2024-03-01', value: 120 },
        { date: '2024-03-02', value: 118 },
        { date: '2024-03-03', value: 122 },
        { date: '2024-03-04', value: 119 },
        { date: '2024-03-05', value: 121 },
        { date: '2024-03-06', value: 145 }, // Anomaly
        { date: '2024-03-07', value: 125 },
        { date: '2024-03-08', value: 123 },
        { date: '2024-03-09', value: 120 },
        { date: '2024-03-10', value: 121 }
      ]
    },
    bloodSugar: {
      value: 85,
      unit: 'mg/dL',
      normalRange: { min: 70, max: 140 },
      history: [
        { date: '2024-03-01', value: 85 },
        { date: '2024-03-02', value: 90 },
        { date: '2024-03-03', value: 88 },
        { date: '2024-03-04', value: 87 },
        { date: '2024-03-05', value: 89 },
        { date: '2024-03-06', value: 86 },
        { date: '2024-03-07', value: 150 }, // Anomaly
        { date: '2024-03-08', value: 92 },
        { date: '2024-03-09', value: 88 },
        { date: '2024-03-10', value: 87 }
      ]
    },
    bodyTemperature: {
      value: 37.2,
      unit: '°C',
      normalRange: { min: 36.1, max: 37.5 },
      history: [
        { date: '2024-03-01', value: 37.2 },
        { date: '2024-03-02', value: 37.0 },
        { date: '2024-03-03', value: 37.1 },
        { date: '2024-03-04', value: 37.3 },
        { date: '2024-03-05', value: 37.4 },
        { date: '2024-03-06', value: 37.2 },
        { date: '2024-03-07', value: 38.2 }, // Anomaly
        { date: '2024-03-08', value: 37.3 },
        { date: '2024-03-09', value: 37.1 },
        { date: '2024-03-10', value: 37.0 }
      ]
    },
    weight: {
      value: 68.5,
      unit: 'kg',
      normalRange: { min: 55, max: 80 },
      history: [
        { date: '2024-03-01', value: 68.5 },
        { date: '2024-03-02', value: 68.2 },
        { date: '2024-03-03', value: 68.7 },
        { date: '2024-03-04', value: 68.4 },
        { date: '2024-03-05', value: 68.6 },
        { date: '2024-03-06', value: 68.3 },
        { date: '2024-03-07', value: 68.8 },
        { date: '2024-03-08', value: 68.5 },
        { date: '2024-03-09', value: 68.3 },
        { date: '2024-03-10', value: 68.4 }
      ]
    }
  };

  // Get filtered data based on time range
  const getFilteredData = () => {
    const now = new Date();
    let cutoffDate = new Date();
    
    if (timeRange === 'day') {
      cutoffDate.setDate(now.getDate() - 1);
    } else if (timeRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else {
      cutoffDate.setMonth(now.getMonth() - 1);
    }
    
    return patientData[selectedMetric].history.filter(
      item => new Date(item.date) >= cutoffDate
    );
  };

  // Check if a value is anomalous
  const isAnomaly = (value: number) => {
    const { min, max } = patientData[selectedMetric].normalRange;
    return value < min || value > max;
  };

  // Get metric display name
  const getMetricDisplayName = (metric: keyof PatientVitals): string => {
    const displayNames: Record<keyof PatientVitals, string> = {
      heartRate: 'Heart Rate',
      bloodPressure: 'Blood Pressure',
      bloodSugar: 'Blood Sugar',
      bodyTemperature: 'Body Temperature',
      weight: 'Weight'
    };
    return displayNames[metric];
  };

  // Get icon for vital type
  const getVitalIcon = (vitalType: keyof PatientVitals) => {
    switch(vitalType) {
      case 'heartRate':
        return <Heart className="h-4 w-4 text-white" />;
      case 'bloodPressure':
        return <Gauge className="h-4 w-4 text-white" />;
      case 'bloodSugar':
        return <Droplets className="h-4 w-4 text-white" />;
      case 'bodyTemperature':
        return <Thermometer className="h-4 w-4 text-white" />;
      case 'weight':
        return <Weight className="h-4 w-4 text-white" />;
    }
  };

  // Get status for vital value
  const getVitalStatus = (value: number, normalRange: {min: number, max: number}): 'normal' | 'warning' | 'critical' => {
    if (value < normalRange.min || value > normalRange.max) {
      // Simple logic: if more than 10% outside range, it's critical
      const minDiff = normalRange.min - value;
      const maxDiff = value - normalRange.max;
      const threshold = (normalRange.max - normalRange.min) * 0.1;
      
      if ((minDiff > 0 && minDiff > threshold) || (maxDiff > 0 && maxDiff > threshold)) {
        return 'critical';
      }
      return 'warning';
    }
    return 'normal';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vitals Tracker</h1>
      
      <VitalsGrid 
        patientData={patientData}
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
        getMetricDisplayName={getMetricDisplayName}
        getVitalIcon={getVitalIcon}
        getVitalStatus={getVitalStatus}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <VitalsChart 
          selectedMetric={selectedMetric}
          patientData={patientData}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          showAnomalies={showAnomalies}
          setShowAnomalies={setShowAnomalies}
          getMetricDisplayName={getMetricDisplayName}
          getFilteredData={getFilteredData}
          isAnomaly={isAnomaly}
        />
        
        <VitalsAnalysis 
          selectedMetric={selectedMetric}
          patientData={patientData}
          getMetricDisplayName={getMetricDisplayName}
          isAnomaly={isAnomaly}
          getFilteredData={getFilteredData}
        />
      </div>
      
      <ShravanBot />
    </div>
  );
}
