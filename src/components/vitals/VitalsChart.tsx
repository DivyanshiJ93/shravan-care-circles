
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
import { PatientVitals } from '@/types/vitals';

interface VitalsChartProps {
  selectedMetric: keyof PatientVitals;
  patientData: PatientVitals;
  timeRange: 'day' | 'week' | 'month';
  setTimeRange: (range: 'day' | 'week' | 'month') => void;
  showAnomalies: boolean;
  setShowAnomalies: (show: boolean) => void;
  getMetricDisplayName: (metric: keyof PatientVitals) => string;
  getFilteredData: () => { date: string; value: number }[];
  isAnomaly: (value: number) => boolean;
}

export default function VitalsChart({
  selectedMetric,
  patientData,
  timeRange,
  setTimeRange,
  showAnomalies,
  setShowAnomalies,
  getMetricDisplayName,
  getFilteredData,
  isAnomaly
}: VitalsChartProps) {
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

  return (
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
  );
}
