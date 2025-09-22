import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Activity, Zap, AlertTriangle } from 'lucide-react';
import { useTourist } from '@/context/TouristContext';
import { translations } from '@/utils/translations';
import { Alert } from '@/types/tourist';

const DemoControls: React.FC = () => {
  const { state, dispatch } = useTourist();
  const { currentTourist, currentLanguage } = state;
  const t = translations[currentLanguage.code];

  const simulateAlert = (type: Alert['type'], message: string, severity: Alert['severity']) => {
    if (!currentTourist) return;

    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      touristId: currentTourist.id,
      type,
      message,
      timestamp: new Date(),
      severity,
    };

    dispatch({ type: 'ADD_ALERT', payload: alert });
  };

  const handleGeofenceBreach = () => {
    simulateAlert('geofence_breach', t.geofenceBreach, 'high');
  };

  const handleInactivity = () => {
    simulateAlert('inactivity', t.inactivityDetected, 'medium');
  };

  const handleSuddenJump = () => {
    simulateAlert('sudden_jump', t.abnormalMovement, 'high');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-warning">
          <AlertTriangle className="w-5 h-5" />
          {t.demoMode}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="demo"
            onClick={handleGeofenceBreach}
            className="gap-2 text-left justify-start h-auto p-3"
            disabled={!currentTourist}
          >
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">{t.simulateGeofence}</span>
          </Button>
          
          <Button
            variant="demo"
            onClick={handleInactivity}
            className="gap-2 text-left justify-start h-auto p-3"
            disabled={!currentTourist}
          >
            <Activity className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">{t.simulateInactivity}</span>
          </Button>
          
          <Button
            variant="demo"
            onClick={handleSuddenJump}
            className="gap-2 text-left justify-start h-auto p-3"
            disabled={!currentTourist}
          >
            <Zap className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">{t.simulateJump}</span>
          </Button>
        </div>

        {!currentTourist && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            Start GPS tracking to enable demo controls
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DemoControls;