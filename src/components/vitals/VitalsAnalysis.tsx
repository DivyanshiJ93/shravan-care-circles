
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { PatientVitals } from '@/types/vitals';
import {
  AreaChart,
  Area,
  ResponsiveContainer
} from 'recharts';

interface VitalsAnalysisProps {
  selectedMetric: keyof PatientVitals;
  patientData: PatientVitals;
  getMetricDisplayName: (metric: keyof PatientVitals) => string;
  isAnomaly: (value: number) => boolean;
  getFilteredData: () => { date: string; value: number }[];
}

export default function VitalsAnalysis({
  selectedMetric,
  patientData,
  getMetricDisplayName,
  isAnomaly,
  getFilteredData
}: VitalsAnalysisProps) {
  const { toast } = useToast();
  const { userRole } = useUser();

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

  return (
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
  );
}
