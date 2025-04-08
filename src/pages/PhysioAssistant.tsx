
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import Header from '@/components/Header';
import ShravanBot from '@/components/ShravanBot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExerciseDetector from '@/components/ExerciseDetector';
import { useToast } from '@/hooks/use-toast';

export default function PhysioAssistant() {
  const { user, isAuthenticated, userRole } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('handsUp');
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }

    // Display helpful toast on component mount
    toast({
      title: "Welcome to Virtual Physiotherapy",
      description: "Turn on your camera to start the guided exercises with real-time feedback.",
    });
  }, [isAuthenticated, navigate, toast]);
  
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Virtual Physiotherapy</h1>
            <p className="text-muted-foreground">Stay active with guided exercises and real-time feedback</p>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="bg-gradient-to-r from-shravan-blue/20 to-shravan-mint/20">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Daily Exercise Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="text-4xl font-bold">2/3</div>
                <div className="text-muted-foreground">Exercises completed today</div>
              </div>
              
              <div className="w-full max-w-md bg-muted/30 h-8 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-shravan-mint to-shravan-blue h-full rounded-full"
                  style={{ width: '66%' }}
                ></div>
              </div>
              
              <div className="flex flex-col items-center md:items-end gap-1">
                <div className="text-2xl font-bold">15</div>
                <div className="text-muted-foreground">Minutes of activity</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="handsUp">Hands Up</TabsTrigger>
            <TabsTrigger value="handsCurl">Hands Curl</TabsTrigger>
            <TabsTrigger value="sitAndReach">Sit & Reach</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="p-6">
              <TabsContent value="handsUp" className="mt-0">
                <ExerciseDetector exerciseType="handsUp" />
              </TabsContent>
              
              <TabsContent value="handsCurl" className="mt-0">
                <ExerciseDetector exerciseType="handsCurl" />
              </TabsContent>
              
              <TabsContent value="sitAndReach" className="mt-0">
                <ExerciseDetector exerciseType="sitAndReach" />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Exercise Benefits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-shravan-mint flex items-center justify-center mb-4">
                  <span className="text-2xl">💪</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Improved Strength</h3>
                <p className="text-muted-foreground">
                  Regular exercise helps maintain muscle mass and strength, which is essential for daily activities and preventing falls.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-shravan-peach flex items-center justify-center mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Mental Clarity</h3>
                <p className="text-muted-foreground">
                  Physical activity improves blood flow to the brain, enhancing cognitive function and reducing the risk of dementia.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-shravan-blue flex items-center justify-center mb-4">
                  <span className="text-2xl">❤️</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Heart Health</h3>
                <p className="text-muted-foreground">
                  Regular exercise helps lower blood pressure, improve cholesterol levels, and strengthen your heart muscle.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {userRole === 'parent' && <ShravanBot />}
    </div>
  );
}
