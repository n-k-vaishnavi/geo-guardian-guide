export interface Tourist {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  lastSeen: Date;
  status: 'safe' | 'alert' | 'emergency';
  geofence: {
    center: { lat: number; lng: number };
    radius: number;
  };
}

export interface Alert {
  id: string;
  touristId: string;
  type: 'geofence_breach' | 'inactivity' | 'sudden_jump' | 'panic_button';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

export interface Language {
  code: 'en' | 'hi' | 'as';
  name: string;
  nativeName: string;
}

export interface DigitalId {
  touristId: string;
  name: string;
  nationality: string;
  passportNumber: string;
  issueDate: Date;
  expiryDate: Date;
  emergencyContact: string;
}