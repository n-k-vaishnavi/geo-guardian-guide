import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  AlertTriangle, 
  Shield, 
  Activity,
  MapPin,
  ArrowLeft,
} from 'lucide-react';
import MapView from './MapView';
import LanguageSelector from './LanguageSelector';
import { useTourist } from '@/context/TouristContext';
import { translations } from '@/utils/translations';
import { Tourist } from '@/types/tourist';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { state, dispatch } = useTourist();
  const { tourists, alerts, currentLanguage } = state;
  const t = translations[currentLanguage.code];

  // Demo tourists data
  useEffect(() => {
    const demoTourists: Tourist[] = [
      {
        id: 'tourist_001',
        name: 'John Doe',
        coordinates: { lat: 26.1445, lng: 91.7362 },
        lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        status: 'safe',
        geofence: { center: { lat: 26.1445, lng: 91.7362 }, radius: 200 },
      },
      {
        id: 'tourist_002', 
        name: 'Sarah Smith',
        coordinates: { lat: 26.1425, lng: 91.7342 },
        lastSeen: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        status: 'alert',
        geofence: { center: { lat: 26.1425, lng: 91.7342 }, radius: 200 },
      },
      {
        id: 'tourist_003',
        name: 'Ahmed Hassan',
        coordinates: { lat: 26.1465, lng: 91.7382 },
        lastSeen: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
        status: 'safe',
        geofence: { center: { lat: 26.1465, lng: 91.7382 }, radius: 200 },
      },
    ];

    dispatch({ type: 'SET_TOURISTS', payload: demoTourists });
  }, [dispatch]);

  const getStatusCount = (status: Tourist['status']) => {
    return tourists.filter(t => t.status === status).length;
  };

  const getAlertSeverityCount = (severity: 'low' | 'medium' | 'high') => {
    return alerts.filter(a => a.severity === severity).length;
  };

  const mapCenter = tourists.length > 0 
    ? { 
        lat: tourists.reduce((sum, t) => sum + t.coordinates.lat, 0) / tourists.length,
        lng: tourists.reduce((sum, t) => sum + t.coordinates.lng, 0) / tourists.length,
      }
    : { lat: 26.1445, lng: 91.7362 };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{t.dashboard}</h1>
              <p className="text-muted-foreground">Real-time tourist monitoring system</p>
            </div>
          </div>
          <LanguageSelector />
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t.activeTourists}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tourists.length}</div>
              <div className="flex gap-2 mt-2">
                <Badge className="bg-safe text-safe-foreground">
                  {getStatusCount('safe')} Safe
                </Badge>
                <Badge className="bg-warning text-warning-foreground">
                  {getStatusCount('alert')} Alert
                </Badge>
                <Badge className="bg-emergency text-emergency-foreground">
                  {getStatusCount('emergency')} Emergency
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t.totalAlerts}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts.length}</div>
              <div className="flex gap-1 mt-2">
                <Badge variant="outline">{getAlertSeverityCount('high')} High</Badge>
                <Badge variant="outline">{getAlertSeverityCount('medium')} Med</Badge>
                <Badge variant="outline">{getAlertSeverityCount('low')} Low</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Geofences Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tourists.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All tourists protected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-safe text-safe-foreground">Online</Badge>
              <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Live Tourist Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MapView 
              tourists={tourists}
              center={mapCenter}
              zoom={13}
              className="h-96"
            />
          </CardContent>
        </Card>

        {/* Tourist List and Recent Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tourist List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tourists.map((tourist) => (
                  <div 
                    key={tourist.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-3 h-3 rounded-full ${
                          tourist.status === 'safe' ? 'bg-safe' :
                          tourist.status === 'alert' ? 'bg-warning' : 'bg-emergency'
                        }`}
                      />
                      <div>
                        <p className="font-medium">{tourist.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.lastSeen}: {tourist.lastSeen.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        className={
                          tourist.status === 'safe' ? 'bg-safe text-safe-foreground' :
                          tourist.status === 'alert' ? 'bg-warning text-warning-foreground' : 
                          'bg-emergency text-emergency-foreground'
                        }
                      >
                        {t[tourist.status]}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {tourist.coordinates.lat.toFixed(4)}, {tourist.coordinates.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <div 
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                  >
                    <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                      alert.severity === 'high' ? 'text-emergency' :
                      alert.severity === 'medium' ? 'text-warning' : 'text-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          {alert.timestamp.toLocaleString()}
                        </p>
                        <Badge 
                          variant="outline"
                          className={
                            alert.severity === 'high' ? 'border-emergency text-emergency' :
                            alert.severity === 'medium' ? 'border-warning text-warning' : 
                            'border-muted-foreground text-muted-foreground'
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-safe" />
                    <p className="text-muted-foreground">No recent alerts</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;