import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Tourist, Alert, Language } from '@/types/tourist';

interface TouristState {
  currentTourist: Tourist | null;
  tourists: Tourist[];
  alerts: Alert[];
  currentLanguage: Language;
  isTracking: boolean;
  geofenceEnabled: boolean;
}

type TouristAction =
  | { type: 'SET_CURRENT_TOURIST'; payload: Tourist }
  | { type: 'UPDATE_LOCATION'; payload: { lat: number; lng: number } }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'TOGGLE_TRACKING' }
  | { type: 'TOGGLE_GEOFENCE' }
  | { type: 'SET_TOURISTS'; payload: Tourist[] };

const initialState: TouristState = {
  currentTourist: null,
  tourists: [],
  alerts: [],
  currentLanguage: { code: 'en', name: 'English', nativeName: 'English' },
  isTracking: false,
  geofenceEnabled: true,
};

const touristReducer = (state: TouristState, action: TouristAction): TouristState => {
  switch (action.type) {
    case 'SET_CURRENT_TOURIST':
      return { ...state, currentTourist: action.payload };
    case 'UPDATE_LOCATION':
      if (!state.currentTourist) return state;
      return {
        ...state,
        currentTourist: {
          ...state.currentTourist,
          coordinates: action.payload,
          lastSeen: new Date(),
        },
      };
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts],
      };
    case 'SET_LANGUAGE':
      return { ...state, currentLanguage: action.payload };
    case 'TOGGLE_TRACKING':
      return { ...state, isTracking: !state.isTracking };
    case 'TOGGLE_GEOFENCE':
      return { ...state, geofenceEnabled: !state.geofenceEnabled };
    case 'SET_TOURISTS':
      return { ...state, tourists: action.payload };
    default:
      return state;
  }
};

const TouristContext = createContext<{
  state: TouristState;
  dispatch: React.Dispatch<TouristAction>;
} | null>(null);

export const TouristProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(touristReducer, initialState);

  return (
    <TouristContext.Provider value={{ state, dispatch }}>
      {children}
    </TouristContext.Provider>
  );
};

export const useTourist = () => {
  const context = useContext(TouristContext);
  if (!context) {
    throw new Error('useTourist must be used within a TouristProvider');
  }
  return context;
};