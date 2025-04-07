
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Activity, Brain, AlertTriangle, Bell, CheckCircle } from 'lucide-react';
import VitalCard from '@/components/VitalCard';

// Mock data
const mockParentInfo = {
  name: "Raj Sharma",
  age: 68,
  lastActive: "2 hours ago",
  vitals: {
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
  }
};

const mockAlerts = [
  {
    type: "warning",
    message: "Blood pressure trending high over last 3 days",
    time: "2 hours ago"
  },
  {
    type: "info",
    message: "Medication reminder sent and acknowledged",
    time: "6 hours ago"
  },
  {
    type: "success",
    message: "Completed all scheduled exercises today",
    time: "Yesterday"
  }
];

const mockMedications = [
  { name: "Lisinopril", time: "8:00 AM", taken: true },
  { name: "Metformin", time: "1:00 PM", taken: true },
  { name: "Atorvastatin", time: "7:00 PM", taken: false }
];

export default function KidsDashboard() {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'kid') {
      navigate('/kids-login');
    }
  }, [isAuthenticated, user, navigate]);
  
  if (!isAuthenticated || user?.role !== 'kid') {
    return null;
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "info":
        return <Bell className="h-4 w-4 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Caregiver Dashboard</h1>
            <p className="text-muted-foreground">Monitoring {mockParentInfo.name}'s health</p>
          </div>
          
          <Card className="w-full md:w-auto">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-shravan-mint flex items-center justify-center">
                <span className="text-xl">👴🏼</span>
              </div>
              <div>
                <p className="font-medium">{mockParentInfo.name}, {mockParentInfo.age}</p>
                <p className="text-sm text-muted-foreground">Last active: {mockParentInfo.lastActive}</p>
              </div>
              <Button onClick={() => navigate('/video-call')} size="sm" className="bg-shravan-blue hover:bg-shravan-darkBlue">
                Call Now
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Vitals Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Current Vitals</h2>
            <Button onClick={() => navigate('/vitals-tracker')} variant="outline">History</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <VitalCard
              title="Heart Rate"
              value={mockParentInfo.vitals.heartRate.value}
              unit={mockParentInfo.vitals.heartRate.unit}
              normalRange={mockParentInfo.vitals.heartRate.normalRange}
              icon={<Heart className="h-4 w-4 text-shravan-blue" />}
              history={mockParentInfo.vitals.heartRate.history}
              editable={false}
            />
            
            <VitalCard
              title="Blood Pressure"
              value={mockParentInfo.vitals.bloodPressure.value}
              unit={mockParentInfo.vitals.bloodPressure.unit}
              normalRange={mockParentInfo.vitals.bloodPressure.normalRange}
              icon={<Activity className="h-4 w-4 text-shravan-blue" />}
              history={mockParentInfo.vitals.bloodPressure.history}
              editable={false}
            />
            
            <VitalCard
              title="Blood Sugar"
              value={mockParentInfo.vitals.bloodSugar.value}
              unit={mockParentInfo.vitals.bloodSugar.unit}
              normalRange={mockParentInfo.vitals.bloodSugar.normalRange}
              icon={<Brain className="h-4 w-4 text-shravan-blue" />}
              history={mockParentInfo.vitals.bloodSugar.history}
              editable={false}
            />
          </div>
        </section>
        
        {/* Alerts & Medications Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Important notifications about {mockParentInfo.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAlerts.map((alert, i) => (
                  <div key={i} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View All Alerts</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Medications */}
          <Card>
            <CardHeader>
              <CardTitle>Medication Tracker</CardTitle>
              <CardDescription>Today's medications for {mockParentInfo.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMedications.map((med, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${med.taken ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                      <span>{med.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{med.time}</span>
                      <div className={`px-2 py-0.5 rounded text-xs ${med.taken ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {med.taken ? 'Taken' : 'Due'}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">Set Reminders</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => navigate('/video-call')}
              className="h-auto flex flex-col items-center justify-center gap-2 p-6 bg-shravan-blue text-white hover:bg-shravan-darkBlue"
            >
              Start Video Call
            </Button>
            
            <Button 
              onClick={() => navigate('/send-reminder')}
              className="h-auto flex flex-col items-center justify-center gap-2 p-6 bg-shravan-peach text-secondary-foreground hover:bg-shravan-darkPeach"
            >
              Send Reminder
            </Button>
            
            <Button 
              onClick={() => navigate('/emergency-contacts')}
              className="h-auto flex flex-col items-center justify-center gap-2 p-6 bg-shravan-mint text-primary-foreground hover:bg-shravan-darkMint"
            >
              Emergency Contacts
            </Button>
            
            <Button 
              onClick={() => navigate('/care-settings')}
              variant="outline"
              className="h-auto flex flex-col items-center justify-center gap-2 p-6"
            >
              Care Settings
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
