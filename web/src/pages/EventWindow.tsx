import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, AlertTriangle, Loader2, Info } from "lucide-react"; // Removed Building, Added Info
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import type { Event } from "@/services/api.types"; // Ensure this path and type are correct
import { Badge } from '@/components/ui/badge';

interface EventWindowProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister?: () => Promise<void>; // This comes from Events.tsx which already uses selectedEvent.eventId
  formatDate: (dateString: string | null | undefined, includeTime?: boolean) => string;
}

const EventWindow: React.FC<EventWindowProps> = ({
  event,
  isOpen,
  onClose,
  onRegister,
  formatDate,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast(); // toast from useToast is already used in Events.tsx for success/failure

  if (!event) return null;

  // Use backend field names
  const eventDateObj = new Date(event.eventDate);
  const registrationDeadlineObj = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
  const now = new Date();

  const isRegistrationAllowed = registrationDeadlineObj ? registrationDeadlineObj > now : eventDateObj > now;
  const isEventFull = event.currentParticipants != null && event.maxParticipants != null && event.currentParticipants >= event.maxParticipants;
  const isEventPast = eventDateObj < now; // Simpler check: if event start date is past

  const handleActualRegister = async () => {
    if (!onRegister) return;
    
    setIsRegistering(true);
    setError(null);
    
    try {
      await onRegister(); // This will call handleRegister in Events.tsx
      // Success toast is handled in Events.tsx's handleRegister
      onClose(); // Close window on success
    } catch (err: any) {
      console.error("Registration error in EventWindow:", err);
      const errorMessage = err?.response?.data?.message || err.message || "Une erreur est survenue lors de l'inscription.";
      setError(errorMessage);
      // Error toast is handled in Events.tsx's handleRegister
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {event.title}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Organisé par {event.company?.name || "Organisateur inconnu"}
          </DialogDescription>
        </DialogHeader>

        {error && ( // Display error specific to this window's registration attempt, if any
          <Alert variant="destructive" className="my-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Date et heure</p>
                <p className="text-gray-600">{formatDate(event.eventDate, true)}</p>
              </div>
            </div>

            {event.registrationDeadline && (
                <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-gray-900">Limite d'inscription</p>
                        <p className="text-gray-600">{formatDate(event.registrationDeadline, true)}</p>
                    </div>
                </div>
            )}

            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Lieu</p>
                <p className="text-gray-600">{event.location}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Participants</p>
                <p className="text-gray-600">
                  {event.currentParticipants || 0} / {event.maxParticipants} places
                </p>
              </div>
            </div>

            {event.price != null && event.price > 0 && (
                 <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" /> {/* Using Info for price */}
                    <div>
                        <p className="font-medium text-gray-900">Prix</p>
                        <p className="text-gray-600">{event.price} TND</p> {/* Assuming TND */}
                    </div>
                </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Fermer
          </Button>
          {onRegister && !isEventPast && ( // Only show register button if event is not past
            <Button
              onClick={handleActualRegister}
              disabled={!isRegistrationAllowed || isEventFull || isRegistering}
              className="w-full sm:w-auto bg-tunisiaBlue-600 hover:bg-tunisiaBlue-700 text-white"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inscription...
                </>
              ) : !isRegistrationAllowed ? (
                "Inscriptions fermées"
              ) : isEventFull ? (
                "Complet"
              ) : (
                "S'inscrire"
              )}
            </Button>
          )}
          {isEventPast && (
             <Badge variant="outline" className="text-gray-600">Événement terminé</Badge>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventWindow;