import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import QRCode from 'qrcode';
import { DigitalId } from '@/types/tourist';
import { useTourist } from '@/context/TouristContext';
import { translations } from '@/utils/translations';
import { CreditCard, Phone, Calendar, MapPin } from 'lucide-react';

interface DigitalIdCardProps {
  digitalId?: DigitalId;
}

const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ digitalId }) => {
  const { state } = useTourist();
  const { currentLanguage } = state;
  const t = translations[currentLanguage.code];
  
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Demo digital ID
  const demoId: DigitalId = digitalId || {
    touristId: 'TUR001',
    name: 'John Doe',
    nationality: 'United States',
    passportNumber: 'US123456789',
    issueDate: new Date('2024-01-15'),
    expiryDate: new Date('2025-01-15'),
    emergencyContact: '+1-555-0123',
  };

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrData = JSON.stringify({
          id: demoId.touristId,
          name: demoId.name,
          passport: demoId.passportNumber,
          nationality: demoId.nationality,
          issued: demoId.issueDate.toISOString(),
          expires: demoId.expiryDate.toISOString(),
          emergency: demoId.emergencyContact,
          verification: `https://gov.in/verify/${demoId.touristId}`,
        });
        
        const url = await QRCode.toDataURL(qrData, {
          errorCorrectionLevel: 'M',
          margin: 1,
          color: {
            dark: '#1f2937',
            light: '#ffffff',
          },
          width: 200,
        });
        
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [demoId]);

  return (
    <Card className="max-w-md mx-auto bg-gradient-primary text-primary-foreground">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CreditCard className="w-6 h-6" />
          <CardTitle className="text-lg font-bold">{t.digitalId}</CardTitle>
        </div>
        <Badge variant="outline" className="bg-white/20 text-white border-white/30 w-fit mx-auto">
          Government of India
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-1">{demoId.name}</h2>
          <p className="text-primary-foreground/80 text-sm">Tourist ID: {demoId.touristId}</p>
        </div>

        <Separator className="bg-white/20" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-primary-foreground/70 font-medium">Nationality</p>
            <p className="font-semibold">{demoId.nationality}</p>
          </div>
          <div>
            <p className="text-primary-foreground/70 font-medium">Passport</p>
            <p className="font-semibold">{demoId.passportNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4" />
          <div>
            <span className="text-primary-foreground/70">Valid: </span>
            <span className="font-semibold">
              {demoId.issueDate.toLocaleDateString()} - {demoId.expiryDate.toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4" />
          <div>
            <span className="text-primary-foreground/70">Emergency: </span>
            <span className="font-semibold">{demoId.emergencyContact}</span>
          </div>
        </div>

        <Separator className="bg-white/20" />

        <div className="text-center">
          <div className="bg-white p-3 rounded-lg inline-block">
            {qrCodeUrl && (
              <img 
                src={qrCodeUrl} 
                alt="Digital ID QR Code" 
                className="w-32 h-32 mx-auto"
              />
            )}
          </div>
          <p className="text-xs text-primary-foreground/70 mt-2">
            Scan for verification
          </p>
        </div>

        <div className="text-center pt-2 border-t border-white/20">
          <div className="flex items-center justify-center gap-2 text-xs text-primary-foreground/70">
            <MapPin className="w-3 h-3" />
            Smart Tourist Safety Monitor System
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalIdCard;