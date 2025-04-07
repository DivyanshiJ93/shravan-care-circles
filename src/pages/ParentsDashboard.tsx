
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import Header from '@/components/Header';
import ShravanBot from '@/components/ShravanBot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Pill, Brain, Dumbbell, Users } from 'lucide-react';
import VitalCard from '@/components/VitalCard';

// Mock data
const mockHealthTips = [
  "Drink at least 8 glasses of water daily",
  "Try 10 minutes of meditation to reduce stress",
  "Include colorful vegetables in every meal",
  "Take a 15-minute walk after meals to aid digestion",
  "Maintain a consistent sleep schedule"
];

const mockVitals = {
  heartRate: {
    value: 72,
    unit: 'bpm',
    normalRange: { min: 60, max: 100 },
    history: [
      { date: 'Apr 6, 2025', value: 75 },
      { date: 'Apr 5, 2025', value: 72 },
      { date: 'Apr 4, 2025', value: 78 },
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
    ]
  }
};

const mockUpcomingActivities = [
  { title: "Morning Medication", time: "8:00 AM", icon: <Pill className="h-4 w-4" /> },
  { title: "Video Call with Anika", time: "11:30 AM", icon: <Users className="h-4 w-4" /> },
  { title: "Physio Exercises", time: "3:00 PM", icon: <Dumbbell className="h-4 w-4" /> },
  { title: "Evening Medication", time: "7:00 PM", icon: <Pill className="h-4 w-4" /> }
];

export default function ParentsDashboard() {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'parent') {
      navigate('/parents-login');
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!isAuthenticated || user?.role !== 'parent') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <div className="w-12 h-12 rounded-full bg-shravan-lavender flex items-center justify-center">
            <span className="text-xl">👋</span>
          </div>
        </div>
        
        {/* Vitals Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Vitals</h2>
            <Button onClick={() => navigate('/vitals-tracker')} variant="outline">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <VitalCard
              title="Heart Rate"
              value={mockVitals.heartRate.value}
              unit={mockVitals.heartRate.unit}
              normalRange={mockVitals.heartRate.normalRange}
              icon={<Heart className="h-4 w-4 text-shravan-blue" />}
              history={mockVitals.heartRate.history}
            />
            
            <VitalCard
              title="Blood Pressure"
              value={mockVitals.bloodPressure.value}
              unit={mockVitals.bloodPressure.unit}
              normalRange={mockVitals.bloodPressure.normalRange}
              icon={<Activity className="h-4 w-4 text-shravan-blue" />}
              history={mockVitals.bloodPressure.history}
            />
            
            <VitalCard
              title="Blood Sugar"
              value={mockVitals.bloodSugar.value}
              unit={mockVitals.bloodSugar.unit}
              normalRange={mockVitals.bloodSugar.normalRange}
              icon={<Brain className="h-4 w-4 text-shravan-blue" />}
              history={mockVitals.bloodSugar.history}
            />
          </div>
        </section>
        
        {/* Quick Actions Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => navigate('/vitals-tracker')} 
              variant="outline"
              className="h-auto flex flex-col items-center justify-center gap-2 p-6"
            >
              <div className="w-12 h-12 rounded-full bg-shravan-mint flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span>Log Vitals</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/physio-assistant')} 
              variant="outline"
              className="h-auto flex flex-col items-center justify-center gap-2 p-6"
            >
              <div className="w-12 h-12 rounded-full bg-shravan-peach flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-secondary-foreground" />
              </div>
              <span>Exercises</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/medication')} 
              variant="outline"
              className="h-auto flex flex-col items-center justify-center gap-2 p-6"
            >
              <div className="w-12 h-12 rounded-full bg-shravan-blue flex items-center justify-center">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <span>Medication</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/community')} 
              variant="outline"
              className="h-auto flex flex-col items-center justify-center gap-2 p-6"
            >
              <div className="w-12 h-12 rounded-full bg-shravan-lavender flex items-center justify-center">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <span>Community</span>
            </Button>
          </div>
        </section>
        
        {/* Today's Schedule & Health Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your activities for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUpcomingActivities.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {activity.icon}
                      </div>
                      <span>{activity.title}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Health Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Health Tips</CardTitle>
              <CardDescription>Simple ways to stay healthy</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {mockHealthTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-shravan-mint flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-primary-foreground">{i + 1}</span>
                    </div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <ShravanBot />
    </div>
  );
}
