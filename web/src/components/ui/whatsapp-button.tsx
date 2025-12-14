
import React from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  message = "Bonjour, je souhaite obtenir plus d'informations sur vos formations."
}) => {
  // Format phone number to ensure it works with WhatsApp
  const formattedPhone = phoneNumber.replace(/[^0-9]/g, "");
  
  // Create WhatsApp URL with phone and encoded message
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  
  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <Button 
        size="lg"
        className="rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center"
      >
        <Phone className="h-6 w-6" />
        <span className="sr-only">Contactez-nous via WhatsApp</span>
      </Button>
    </a>
  );
};

export default WhatsAppButton;
