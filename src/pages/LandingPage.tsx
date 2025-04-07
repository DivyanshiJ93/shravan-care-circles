
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-shravan-mint/30 via-shravan-blue/20 to-shravan-lavender/30 -z-10"
          aria-hidden="true"
        />
        
        <div className="container px-4 md:px-6 py-16 md:py-24 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-shravan-mint flex items-center justify-center mb-6 animate-float">
            <span className="text-4xl">👵🏼</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            SHRAVAN
            <span className="block text-2xl md:text-3xl text-muted-foreground font-normal mt-2">
              Care Circles for Aging Parents
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10">
            Connect, monitor, and support your parents with our all-in-one health tracking platform that brings peace of mind to families across generations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => navigate('/parents-login')} 
              className="btn-shravan btn-primary text-lg px-8 py-6"
            >
              I'm a Parent
            </Button>
            <Button 
              onClick={() => navigate('/kids-login')} 
              className="btn-shravan btn-secondary text-lg px-8 py-6"
            >
              I'm a Caregiver
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How SHRAVAN Helps Your Family
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="card-shravan bg-gradient-to-br from-white to-shravan-mint/20">
              <div className="w-16 h-16 rounded-full bg-shravan-mint flex items-center justify-center mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Vitals Tracking</h3>
              <p className="text-muted-foreground">
                Monitor heart rate, blood pressure, and other important health metrics with easy-to-understand alerts.
              </p>
            </div>
            
            {/* Feature Card 2 */}
            <div className="card-shravan bg-gradient-to-br from-white to-shravan-blue/20">
              <div className="w-16 h-16 rounded-full bg-shravan-blue flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold mb-2">SHRAVAN Assistant</h3>
              <p className="text-muted-foreground">
                A friendly AI companion that helps with daily health reminders and answers questions with a warm touch.
              </p>
            </div>
            
            {/* Feature Card 3 */}
            <div className="card-shravan bg-gradient-to-br from-white to-shravan-peach/20">
              <div className="w-16 h-16 rounded-full bg-shravan-peach flex items-center justify-center mb-4">
                <span className="text-2xl">🏃‍♀️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Physio Assistant</h3>
              <p className="text-muted-foreground">
                Guided exercises with real-time feedback to keep mobility and strength at their best.
              </p>
            </div>
            
            {/* Feature Card 4 */}
            <div className="card-shravan bg-gradient-to-br from-white to-shravan-lavender/20">
              <div className="w-16 h-16 rounded-full bg-shravan-lavender flex items-center justify-center mb-4">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Community Support</h3>
              <p className="text-muted-foreground">
                Connect with others on similar journeys to share experiences, tips, and encouragement.
              </p>
            </div>
            
            {/* Feature Card 5 */}
            <div className="card-shravan bg-gradient-to-br from-white to-shravan-mint/20">
              <div className="w-16 h-16 rounded-full bg-shravan-mint flex items-center justify-center mb-4">
                <span className="text-2xl">🔔</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Alerts</h3>
              <p className="text-muted-foreground">
                Receive notifications about important health changes or when scheduled check-ins are missed.
              </p>
            </div>
            
            {/* Feature Card 6 */}
            <div className="card-shravan bg-gradient-to-br from-white to-shravan-blue/20">
              <div className="w-16 h-16 rounded-full bg-shravan-blue flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Privacy First</h3>
              <p className="text-muted-foreground">
                Your family's health data stays private and secure with our robust protection systems.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="card-shravan max-w-3xl mx-auto bg-gradient-to-r from-shravan-mint/30 to-shravan-blue/30">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to join the SHRAVAN family?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Start your journey to better connected care and peace of mind today. It only takes a minute to get started.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  onClick={() => navigate('/parents-login')}
                  className="btn-shravan btn-primary"
                >
                  Sign Up as Parent
                </Button>
                <Button
                  onClick={() => navigate('/kids-login')}
                  className="btn-shravan btn-secondary"
                >
                  Sign Up as Caregiver
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted/30 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-shravan-mint flex items-center justify-center">
                <span className="font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-bold text-lg">SHRAVAN</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 SHRAVAN. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
