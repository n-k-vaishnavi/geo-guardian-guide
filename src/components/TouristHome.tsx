import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Square, 
  Phone, 
  Navigation, 
  MapPin, 
  Shield,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';
import MapView from './MapView';
import AlertPanel from './AlertPanel';
import DemoControls from './DemoControls';
import DigitalIdCard from './DigitalIdCard';
import LanguageSelector from './LanguageSelector';
import { useTourist } from '@/context/TouristContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { translations } from '@/utils/translations';
import { Tourist, Alert } from '@/types/tourist';

const TouristHome: React.FC = () => {
  const { state, dispatch } = useTourist();
  const { currentTourist, isTracking, geofenceEnabled, currentLanguage } = state;
  const { location, error, loading } = useGeolocation();
  const t = translations[currentLanguage.code];

  const [showIdCard, setShowIdCard] = React.useState(false);

  // Initialize tourist when GPS is available
  useEffect(() => {
    if (location && !currentTourist) {
      const newTourist: Tourist = {
        id: 'tourist_main',
        name: 'John Doe',
        coordinates: location,
        lastSeen: new Date(),
        status: 'safe',
        geofence: {
          center: location,
          radius: 200,
        },
      };
      dispatch({ type: 'SET_CURRENT_TOURIST', payload: newTourist });
    }
  }, [location, currentTourist, dispatch]);

  // Update location when tracking
  useEffect(() => {
    if (location && isTracking && currentTourist) {
      dispatch({ type: 'UPDATE_LOCATION', payload: location });

      // Check geofence breach
      if (geofenceEnabled && currentTourist.geofence) {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          currentTourist.geofence.center.lat,
          currentTourist.geofence.center.lng
        );

        if (distance > currentTourist.geofence.radius) {
          const alert: Alert = {
            id: `geofence_${Date.now()}`,
            touristId: currentTourist.id,
            type: 'geofence_breach',
            message: t.geofenceBreach,
            timestamp: new Date(),
            severity: 'high',
          };
          dispatch({ type: 'ADD_ALERT', payload: alert });
        }
      }
    }
  }, [location, isTracking, currentTourist, geofenceEnabled, dispatch, t]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleToggleTracking = () => {
    dispatch({ type: 'TOGGLE_TRACKING' });
  };

  const handlePanicButton = () => {
    if (!currentTourist) return;

    const alert: Alert = {
      id: `panic_${Date.now()}`,
      touristId: currentTourist.id,
      type: 'panic_button',
      message: t.panicPressed,
      timestamp: new Date(),
      severity: 'high',
    };
    dispatch({ type: 'ADD_ALERT', payload: alert });
  };

  const getStatusColor = () => {
    if (!currentTourist) return 'bg-muted';
    switch (currentTourist.status) {
      case 'safe':
        return 'bg-safe';
      case 'alert':
        return 'bg-warning';
      case 'emergency':
        return 'bg-emergency';
      default:
        return 'bg-muted';
    }
  };

  if (showIdCard) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowIdCard(false)}
            >
              ← Back
            </Button>
            <LanguageSelector />
          </div>
          <DigitalIdCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t.appName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
              <span className="text-sm text-muted-foreground">
                {currentTourist ? t[currentTourist.status] : 'Initializing...'}
              </span>
            </div>
          </div>
          <LanguageSelector />
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                GPS Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={location ? "default" : "destructive"}>
                {loading ? 'Searching...' : location ? 'Active' : 'Inactive'}
              </Badge>
              {error && <p className="text-xs text-destructive mt-1">{error}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {t.safeZone}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={geofenceEnabled ? "default" : "secondary"}>
                {geofenceEnabled ? 'Active (200m)' : 'Disabled'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={isTracking ? "default" : "secondary"}>
                {isTracking ? 'Recording' : 'Stopped'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        {location && currentTourist && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {t.currentLocation}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MapView 
                tourist={currentTourist}
                center={location}
                showGeofence={geofenceEnabled}
              />
              <div className="mt-3 text-sm text-muted-foreground">
                <strong>{t.coordinates}:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleToggleTracking}
                variant={isTracking ? "destructive" : "safe"}
                className="w-full gap-2"
                disabled={!location}
              >
                {isTracking ? (
                  <>
                    <Square className="w-4 h-4" />
                    Stop Tracking
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Start Tracking
                  </>
                )}
              </Button>

              <Button 
                onClick={() => setShowIdCard(true)}
                variant="outline"
                className="w-full gap-2"
              >
                <CreditCard className="w-4 h-4" />
                {t.digitalId}
              </Button>

              <Separator />

              <Button 
                onClick={handlePanicButton}
                variant="emergency"
                size="lg"
                className="w-full gap-2 h-16 text-lg"
                disabled={!currentTourist}
              >
                <Phone className="w-6 h-6" />
                {t.panicButton}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <AlertPanel />
            <DemoControls />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristHome;