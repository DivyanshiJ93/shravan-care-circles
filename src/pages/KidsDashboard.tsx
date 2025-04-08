
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CalendarCheck, Heart, Trophy, Thermometer, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import ShravanBot from '@/components/ShravanBot';
import VitalCard from '@/components/VitalCard';

export default function KidsDashboard() {
  const navigate = useNavigate();
  const { userName } = useUser();

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
          <Avatar className="h-16 w-16 border-2 border-shravan-mint">
            <AvatarImage src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" />
            <AvatarFallback>FD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {userName || 'Felix'}!</h1>
            <p className="text-muted-foreground">Let's check how you're doing today</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/physio-assistant')}
            className="bg-white dark:bg-background"
          >
            Physio Session
          </Button>
          <Button 
            onClick={() => navigate('/vitals-tracker')}
            className="bg-shravan-mint hover:bg-shravan-darkMint text-foreground"
          >
            Track Vitals
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Daily Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">3/5 exercises</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/physio-assistant')} 
                  className="w-full bg-shravan-mint hover:bg-shravan-darkMint text-foreground"
                >
                  Complete Today's Exercises
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Next Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-shravan-blue/20 p-3 rounded-full">
                    <CalendarCheck className="h-6 w-6 text-shravan-blue" />
                  </div>
                  <div>
                    <p className="font-medium">Dr. Sarah Johnson</p>
                    <p className="text-muted-foreground text-sm">Physiotherapist</p>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="font-medium">Thursday, 11 April 2024</p>
                  <p className="text-muted-foreground">10:30 AM - 11:15 AM</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
            
            <Card className="xl:col-span-1 md:col-span-2 xl:col-start-3 xl:row-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 bg-shravan-mint/20 p-3 rounded-lg">
                  <div className="bg-shravan-mint rounded-full p-2">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Exercise Streak</p>
                    <p className="text-muted-foreground text-sm">5 days in a row!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-shravan-peach/20 p-3 rounded-lg">
                  <div className="bg-shravan-peach rounded-full p-2">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Range Improvement</p>
                    <p className="text-muted-foreground text-sm">15% better flexibility</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                editable={false}
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
                editable={false}
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
                editable={false}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="activities">
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium">Activities coming soon!</h3>
            <p className="text-muted-foreground">Check back later for your activity tracking.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements">
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium">Achievements collection coming soon!</h3>
            <p className="text-muted-foreground">Your achievements will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <ShravanBot />
    </div>
  );
}
