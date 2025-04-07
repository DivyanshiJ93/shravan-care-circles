
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import Header from '@/components/Header';
import ShravanBot from '@/components/ShravanBot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Brain, Weight, Thermometer, Plus } from 'lucide-react';
import VitalCard from '@/components/VitalCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

// Mock data
const initialVitals = {
  heartRate: {
    value: 72,
    unit: 'bpm',
    normalRange: { min: 60, max: 100 },
    history: [
      { date: 'Apr 6, 2025', value: 75 },
      { date: 'Apr 5, 2025', value: 72 },
      { date: 'Apr 4, 2025', value: 78 },
      { date: 'Apr 3, 2025', value: 74 },
      { date: 'Apr 2, 2025', value: 76 },
    ]
  },
  bloodPressure: {
    value: 138,
    unit: 'mmHg',
    normalRange: { min: 90, max: 130 },
    history: [
      { date: 'Apr 6, 2025', value: 142 },
      { date: 'Apr 5, 2025', value: 138 },
      { date: 'Apr 4, 2025', value: 135 },
      { date: 'Apr 3, 2025', value: 140 },
      { date: 'Apr 2, 2025', value: 137 },
    ]
  },
  bloodSugar: {
    value: 110,
    unit: 'mg/dL',
    normalRange: { min: 70, max: 140 },
    history: [
      { date: 'Apr 6, 2025', value: 115 },
      { date: 'Apr 5, 2025', value: 110 },
      { date: 'Apr 4, 2025', value: 108 },
      { date: 'Apr 3, 2025', value: 112 },
      { date: 'Apr 2, 2025', value: 109 },
    ]
  },
  bodyTemperature: {
    value: 98.6,
    unit: '°F',
    normalRange: { min: 97, max: 99 },
    history: [
      { date: 'Apr 6, 2025', value: 98.6 },
      { date: 'Apr 5, 2025', value: 98.4 },
      { date: 'Apr 4, 2025', value: 98.7 },
      { date: 'Apr 3, 2025', value: 98.5 },
      { date: 'Apr 2, 2025', value: 98.4 },
    ]
  },
  weight: {
    value: 165,
    unit: 'lbs',
    normalRange: { min: 150, max: 180 },
    history: [
      { date: 'Apr 6, 2025', value: 165 },
      { date: 'Apr 5, 2025', value: 165.5 },
      { date: 'Apr 4, 2025', value: 166 },
      { date: 'Mar 28, 2025', value: 167 },
      { date: 'Mar 21, 2025', value: 168 },
    ]
  }
};

export default function VitalsTracker() {
  const { user, isAuthenticated, userRole } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [vitals, setVitals] = useState(initialVitals);
  const [timeRange, setTimeRange] = useState('week');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }

  const handleUpdateVital = (vitalType: keyof typeof vitals, newValue: number) => {
    // In a real app, you'd send this to an API
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    
    setVitals(prev => {
      const updatedVital = {
        ...prev[vitalType],
        value: newValue,
        history: [
          { date: today, value: newValue },
          ...prev[vitalType].history
        ]
      };
      
      return {
        ...prev,
        [vitalType]: updatedVital
      };
    });
    
    // Check if the value is outside normal range and show alert
    const isNormal = newValue >= vitals[vitalType].normalRange.min && 
                    newValue <= vitals[vitalType].normalRange.max;
    
    if (!isNormal) {
      toast({
        title: "Vital Reading Alert",
        description: `The ${vitalType} reading is outside the normal range.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Vitals Tracker</h1>
            <p className="text-muted-foreground">
              {userRole === 'parent' ? 'Track and monitor your health vitals' : `Monitor ${initialVitals.name || 'parent'}'s vitals`}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
              </SelectContent>
            </Select>
            
            {userRole === 'parent' && (
              <Button className="btn-shravan btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add New Vital
              </Button>
            )}
          </div>
        </div>
        
        {/* Vitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VitalCard
            title="Heart Rate"
            value={vitals.heartRate.value}
            unit={vitals.heartRate.unit}
            normalRange={vitals.heartRate.normalRange}
            icon={<Heart className="h-4 w-4 text-shravan-blue" />}
            history={vitals.heartRate.history}
            onUpdate={userRole === 'parent' ? (value) => handleUpdateVital('heartRate', value) : undefined}
            editable={userRole === 'parent'}
          />
          
          <VitalCard
            title="Blood Pressure"
            value={vitals.bloodPressure.value}
            unit={vitals.bloodPressure.unit}
            normalRange={vitals.bloodPressure.normalRange}
            icon={<Activity className="h-4 w-4 text-shravan-blue" />}
            history={vitals.bloodPressure.history}
            onUpdate={userRole === 'parent' ? (value) => handleUpdateVital('bloodPressure', value) : undefined}
            editable={userRole === 'parent'}
          />
          
          <VitalCard
            title="Blood Sugar"
            value={vitals.bloodSugar.value}
            unit={vitals.bloodSugar.unit}
            normalRange={vitals.bloodSugar.normalRange}
            icon={<Brain className="h-4 w-4 text-shravan-blue" />}
            history={vitals.bloodSugar.history}
            onUpdate={userRole === 'parent' ? (value) => handleUpdateVital('bloodSugar', value) : undefined}
            editable={userRole === 'parent'}
          />
          
          <VitalCard
            title="Body Temperature"
            value={vitals.bodyTemperature.value}
            unit={vitals.bodyTemperature.unit}
            normalRange={vitals.bodyTemperature.normalRange}
            icon={<Thermometer className="h-4 w-4 text-shravan-blue" />}
            history={vitals.bodyTemperature.history}
            onUpdate={userRole === 'parent' ? (value) => handleUpdateVital('bodyTemperature', value) : undefined}
            editable={userRole === 'parent'}
          />
          
          <VitalCard
            title="Weight"
            value={vitals.weight.value}
            unit={vitals.weight.unit}
            normalRange={vitals.weight.normalRange}
            icon={<Weight className="h-4 w-4 text-shravan-blue" />}
            history={vitals.weight.history}
            onUpdate={userRole === 'parent' ? (value) => handleUpdateVital('weight', value) : undefined}
            editable={userRole === 'parent'}
          />
        </div>
        
        {/* Health Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Health Insights</CardTitle>
            <CardDescription>
              Analyzing your vital trends to provide personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-shravan-mint/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-shravan-mint flex items-center justify-center flex-shrink-0">
                    <Activity className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Blood Pressure Trending High</h3>
                    <p className="text-muted-foreground">
                      Your blood pressure readings have been slightly elevated over the past week.
                      Consider reducing sodium intake and increasing physical activity.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-shravan-blue/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-shravan-blue flex items-center justify-center flex-shrink-0">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Heart Rate Stability</h3>
                    <p className="text-muted-foreground">
                      Your heart rate has been stable within the normal range. Continue your current
                      routine and consider adding light cardio exercises.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-shravan-peach/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-shravan-peach flex items-center justify-center flex-shrink-0">
                    <Weight className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Weight Improvement</h3>
                    <p className="text-muted-foreground">
                      You've lost 3 pounds over the last month! Keep up with your diet and exercise routine.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      {userRole === 'parent' && <ShravanBot />}
    </div>
  );
}
