import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VitalCard from '@/components/VitalCard';
import { useToast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { useUser } from '@/context/UserContext';
import { AreaChart, Area } from 'recharts';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import ShravanBot from '@/components/ShravanBot';
import { Heart, Thermometer, Gauge, Droplets, Weight } from 'lucide-react';

// Vital data types
interface VitalReading {
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

interface PatientVitals {
  heartRate: VitalReading;
  bloodPressure: VitalReading;
  bloodSugar: VitalReading;
  bodyTemperature: VitalReading;
  weight: VitalReading;
}

export default function VitalsTracker() {
  const { toast } = useToast();
  const { userRole } = useUser();
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

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const value = payload[0].value as number;
      const isAnomalous = isAnomaly(value);
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">{`Date: ${label}`}</p>
          <p className={`text-sm font-bold ${isAnomalous ? 'text-destructive' : 'text-foreground'}`}>
            {`${selectedMetric}: ${value} ${patientData[selectedMetric].unit}`}
          </p>
          {isAnomalous && (
            <p className="text-xs text-destructive mt-1">Out of normal range</p>
          )}
        </div>
      );
    }
    return null;
  };

  const handleAddReading = () => {
    toast({
      title: "Feature coming soon",
      description: "You'll be able to add new readings in a future update!",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Your vitals data has been prepared for export.",
    });
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <CardTitle>{getMetricDisplayName(selectedMetric)} History</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-start sm:items-center">
              <div className="flex items-center space-x-2">
                <Label htmlFor="show-anomalies" className="text-sm">Show Anomalies</Label>
                <Switch
                  id="show-anomalies"
                  checked={showAnomalies}
                  onCheckedChange={setShowAnomalies}
                />
              </div>
              <ToggleGroup type="single" value={timeRange} onValueChange={(value) => value && setTimeRange(value as 'day' | 'week' | 'month')}>
                <ToggleGroupItem value="day">Day</ToggleGroupItem>
                <ToggleGroupItem value="week">Week</ToggleGroupItem>
                <ToggleGroupItem value="month">Month</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getFilteredData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8ECDA0"
                    strokeWidth={2}
                    dot={(props) => {
                      const value = props.payload.value;
                      const anomalous = isAnomaly(value);
                      
                      if (!showAnomalies && anomalous) {
                        return null;
                      }
                      
                      return (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={anomalous ? 6 : 4}
                          fill={anomalous ? "#ff6b6b" : "#8ECDA0"}
                          stroke="none"
                        />
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Current Status</h3>
              <div className={`p-4 rounded-lg ${
                isAnomaly(patientData[selectedMetric].value) 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              }`}>
                <p className="text-sm">
                  {isAnomaly(patientData[selectedMetric].value) 
                    ? `Your ${getMetricDisplayName(selectedMetric).toLowerCase()} is outside the normal range.` 
                    : `Your ${getMetricDisplayName(selectedMetric).toLowerCase()} is within normal range.`
                  }
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Recent Trends</h3>
              <div className="h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={getFilteredData().slice(-5)}
                    margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                  >
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8ECDA0" 
                      fill="#8ECDA0" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Actions</h3>
              <button 
                onClick={handleAddReading} 
                className="w-full py-2 px-4 bg-shravan-mint text-primary-foreground hover:bg-shravan-darkMint dark:bg-shravan-darkMint dark:hover:bg-shravan-mint transition-colors rounded-lg text-sm"
              >
                Add New Reading
              </button>
              {userRole === 'kid' && (
                <button 
                  onClick={handleExportData} 
                  className="w-full py-2 px-4 bg-shravan-blue text-primary-foreground hover:bg-shravan-darkBlue dark:bg-shravan-darkBlue dark:hover:bg-shravan-blue transition-colors rounded-lg text-sm"
                >
                  Export Data for Doctor
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ShravanBot />
    </div>
  );
}
