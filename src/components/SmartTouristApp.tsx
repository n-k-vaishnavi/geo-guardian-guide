import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, MapPin, CreditCard } from 'lucide-react';
import TouristHome from './TouristHome';
import AdminDashboard from './AdminDashboard';
import { TouristProvider } from '@/context/TouristContext';

type AppMode = 'landing' | 'tourist' | 'admin';

const SmartTouristApp: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('landing');

  const renderLandingPage = () => (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-16">
          <div className="mb-6">
            <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Smart Tourist Safety Monitor
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced GPS tracking and geofencing system for tourist safety. 
              Real-time monitoring, anomaly detection, and emergency response.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => setMode('tourist')}
              variant="safe"
              size="lg"
              className="gap-2 min-w-48"
            >
              <MapPin className="w-5 h-5" />
              Tourist Mode
            </Button>
            
            <Button 
              onClick={() => setMode('admin')}
              variant="default"
              size="lg"
              className="gap-2 min-w-48"
            >
              <Users className="w-5 h-5" />
              Admin Dashboard
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Real-time GPS Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Continuous location monitoring with high-precision GPS coordinates and live map visualization.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-8 h-8 mx-auto mb-2 text-safe" />
              <CardTitle className="text-lg">Geofencing Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatic safe zone creation with instant alerts when tourists leave designated areas.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-8 h-8 mx-auto mb-2 text-warning" />
              <CardTitle className="text-lg">Anomaly Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI-powered detection of inactivity, sudden movements, and emergency situations.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-lg">Digital ID System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Secure digital identification with QR codes for quick verification by authorities.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="text-2xl mb-2">🚨</div>
              <CardTitle className="text-lg">Emergency Response</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                One-touch panic button with immediate alert dispatch to monitoring centers.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="text-2xl mb-2">🌐</div>
              <CardTitle className="text-lg">Multi-language Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Available in English, Hindi, and Assamese for seamless user experience.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Notice */}
        <div className="text-center py-8 border-t border-border">
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-warning mb-2">Demo Application</h3>
            <p className="text-sm text-muted-foreground">
              This is a working prototype demonstrating smart tourist safety monitoring capabilities. 
              Features include live GPS tracking, geofencing, anomaly detection, and emergency response systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (mode === 'landing') {
    return renderLandingPage();
  }

  return (
    <TouristProvider>
      {mode === 'tourist' && <TouristHome />}
      {mode === 'admin' && <AdminDashboard onBack={() => setMode('landing')} />}
    </TouristProvider>
  );
};

export default SmartTouristApp;