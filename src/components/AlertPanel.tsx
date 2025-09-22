import React from 'react';
import { Alert } from '@/types/tourist';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Shield, Activity, Phone } from 'lucide-react';
import { useTourist } from '@/context/TouristContext';
import { translations } from '@/utils/translations';

const AlertPanel: React.FC = () => {
  const { state } = useTourist();
  const { alerts, currentLanguage } = state;
  const t = translations[currentLanguage.code];

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'geofence_breach':
        return <Shield className="w-4 h-4" />;
      case 'inactivity':
        return <Activity className="w-4 h-4" />;
      case 'sudden_jump':
        return <AlertTriangle className="w-4 h-4" />;
      case 'panic_button':
        return <Phone className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'low':
        return 'bg-warning/20 text-warning-foreground border-warning';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'high':
        return 'bg-emergency text-emergency-foreground animate-pulse-emergency';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getAlertMessage = (alert: Alert) => {
    const messages = {
      geofence_breach: t.geofenceBreach,
      inactivity: t.inactivityDetected,
      sudden_jump: t.abnormalMovement,
      panic_button: t.panicPressed,
    };
    return messages[alert.type] || alert.message;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          {t.alerts} ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40 w-full">
          {alerts.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-safe" />
                <p className="text-sm">No alerts - All clear</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">
                        {getAlertMessage(alert)}
                      </p>
                      <Badge 
                        className={getSeverityColor(alert.severity)}
                        variant="outline"
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.timestamp.toLocaleString(
                        currentLanguage.code === 'en' ? 'en-US' : 
                        currentLanguage.code === 'hi' ? 'hi-IN' : 'as-IN'
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertPanel;