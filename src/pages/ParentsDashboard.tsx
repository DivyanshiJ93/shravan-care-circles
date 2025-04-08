
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Thermometer, 
  CalendarCheck, 
  User, 
  LineChart, 
  AlertTriangle, 
  CheckCircle, 
  Gauge 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ShravanBot from '@/components/ShravanBot';
import VitalCard from '@/components/VitalCard';

export default function ParentsDashboard() {
  const navigate = useNavigate();

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
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-shravan-blue">
            <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=Maria" />
            <AvatarFallback>MR</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Hello, Maria Rodriguez</h1>
            <p className="text-muted-foreground">Felix's care dashboard</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/vitals-tracker')}
            className="bg-shravan-blue hover:bg-shravan-darkBlue text-white"
          >
            View Vitals
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <Card className="md:col-span-8">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Felix's Vital Signs</CardTitle>
                <Button 
                  onClick={() => navigate('/vitals-tracker')}
                  variant="outline" 
                  className="h-8"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <VitalCard 
                    title="Heart Rate"
                    value={75}
                    unit="bpm"
                    status={getVitalStatus(75, {min: 60, max: 100})}
                    onClick={() => navigate('/vitals-tracker')}
                    normalRange={{ min: 60, max: 100 }}
                    icon={<Heart className="h-4 w-4 text-white" />}
                    history={[
                      { date: '2024-03-09', value: 76 },
                      { date: '2024-03-10', value: 75 },
                    ]}
                  />
                  
                  <VitalCard 
                    title="Blood Pressure"
                    value={120}
                    unit="mmHg"
                    status={getVitalStatus(120, {min: 90, max: 140})}
                    onClick={() => navigate('/vitals-tracker')}
                    normalRange={{ min: 90, max: 140 }}
                    icon={<Gauge className="h-4 w-4 text-white" />}
                    history={[
                      { date: '2024-03-09', value: 118 },
                      { date: '2024-03-10', value: 120 },
                    ]}
                  />
                  
                  <VitalCard 
                    title="Temperature"
                    value={37.2}
                    unit="°C"
                    status={getVitalStatus(37.2, {min: 36.1, max: 37.5})}
                    onClick={() => navigate('/vitals-tracker')}
                    normalRange={{ min: 36.1, max: 37.5 }}
                    icon={<Thermometer className="h-4 w-4 text-white" />}
                    history={[
                      { date: '2024-03-09', value: 37.0 },
                      { date: '2024-03-10', value: 37.2 },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle className="text-lg">Physio Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Daily Exercises</span>
                    <Badge variant="outline" className="bg-shravan-mint/20 text-primary">
                      3 of 5 completed
                    </Badge>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Weekly Target</span>
                    <Badge variant="outline" className="bg-shravan-peach/20 text-secondary">
                      12 of 15 completed
                    </Badge>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                
                <Button 
                  onClick={() => navigate('/physio-assistant')}
                  className="w-full"
                  variant="outline"
                >
                  View Exercise Plan
                </Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-6">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 bg-muted p-3 rounded-lg">
                  <div className="bg-shravan-blue/20 p-3 rounded-full">
                    <CalendarCheck className="h-5 w-5 text-shravan-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">Dr. Sarah Johnson</p>
                      <Badge>Upcoming</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">Thursday, 11 April 2024 - 10:30 AM</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-muted p-3 rounded-lg">
                  <div className="bg-shravan-mint/20 p-3 rounded-full">
                    <User className="h-5 w-5 text-shravan-mint" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">Dr. James Wilson</p>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">Monday, 22 April 2024 - 2:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-6">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-shravan-mint/20 p-3 rounded-full">
                    <CheckCircle className="h-5 w-5 text-shravan-mint" />
                  </div>
                  <div>
                    <p className="font-medium">Completed 3 exercises</p>
                    <p className="text-muted-foreground text-sm">Today, 2:15 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-shravan-blue/20 p-3 rounded-full">
                    <LineChart className="h-5 w-5 text-shravan-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Vitals checked and recorded</p>
                    <p className="text-muted-foreground text-sm">Today, 9:30 AM</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-shravan-peach/20 p-3 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-shravan-peach" />
                  </div>
                  <div>
                    <p className="font-medium">Missed evening exercise</p>
                    <p className="text-muted-foreground text-sm">Yesterday, 7:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="progress">
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium">Detailed progress tracking coming soon!</h3>
            <p className="text-muted-foreground">Check back later for detailed progress reports.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="appointments">
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium">Appointment management coming soon!</h3>
            <p className="text-muted-foreground">You'll be able to manage appointments here.</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <ShravanBot />
    </div>
  );
}
