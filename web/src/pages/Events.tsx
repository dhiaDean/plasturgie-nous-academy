import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, Users, ArrowRight, Briefcase, Clock } from "lucide-react"; // Added Clock
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import EventWindow from "./EventWindow";
import { EventAPI, EventRegistrationAPI } from "@/services/api.service";
import type { Event } from "@/services/api.types"; // Ensure this path is correct and Event type is updated

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventWindowOpen, setIsEventWindowOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEvents = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (query && query.trim() !== "") {
        response = await EventAPI.search(query);
      } else {
        response = await EventAPI.getAll(); // Assuming EventAPI.getAll is your method for getting all events
      }
      
      const eventsData = Array.isArray(response.data) ? response.data : 
                        (response.data && Array.isArray(response.data.data)) ? response.data.data : // Common for paginated responses
                        [];
      
      setEvents(eventsData);
    } catch (err: any) {
      console.error("Error in fetchEvents:", err);
      const errorMessage = err?.response?.data?.message || err.message || "Erreur lors de la récupération des événements.";
      setError(errorMessage);
      if (toast) {
        toast({ variant: "destructive", title: "Erreur API", description: errorMessage });
      }
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // Basic check for toast availability
    if (typeof toast === 'function') {
      fetchEvents();
    } else {
      console.warn("Toast not ready, fetching events without toast for potential errors.");
      fetchEvents(); 
    }
  }, [fetchEvents, toast]);

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchEvents(searchTerm);
    }
  };
  
  const handleSearchButtonClick = () => {
    fetchEvents(searchTerm);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventWindowOpen(true);
  };

  const handleRegister = async () => {
    if (!selectedEvent || !user) {
      if (toast) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Utilisateur non connecté ou aucun événement sélectionné.",
        });
      }
      return;
    }

    try {
      // Use eventId for registration
      await EventRegistrationAPI.create(selectedEvent.eventId); 
      if (toast) {
        toast({
          title: "Inscription réussie",
          description: `Vous êtes maintenant inscrit à "${selectedEvent.title}".`,
        });
      }
      fetchEvents(searchTerm || undefined);
      // Ensure currentParticipants is a number before incrementing
      setSelectedEvent(prev => prev ? {...prev, currentParticipants: (Number(prev.currentParticipants) || 0) + 1} : null);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || "Une erreur est survenue lors de l'inscription.";
      if (toast) {
        toast({
          variant: "destructive",
          title: "Échec de l'inscription",
          description: errorMessage,
        });
      }
    }
  };

  const formatDate = (dateString: string | null | undefined, includeTime = true) => {
    if (!dateString) return "Date non disponible";
    try {
      const formatString = includeTime ? "d MMMM yyyy 'à' HH:mm" : "d MMMM yyyy";
      return format(new Date(dateString), formatString, { locale: fr });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Date invalide";
    }
  };

  const getStatusBadge = (event: Event) => {
    const now = new Date();
    const eventDate = new Date(event.eventDate); // Use eventDate
    const registrationDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
  
    // Check if full
    if (event.currentParticipants != null && event.maxParticipants != null && event.currentParticipants >= event.maxParticipants) {
      return <Badge className="bg-red-600 text-white">Complet</Badge>;
    }
    
    // Check if registration is closed
    if (registrationDeadline && registrationDeadline < now && eventDate > now) {
      return <Badge className="bg-yellow-500 text-black">Inscriptions fermées</Badge>;
    }
  
    // Check if upcoming, ongoing, or terminated
    // Backend doesn't have a direct 'endDate'. We'll assume events past their eventDate are "Terminé".
    // If you need "En cours", backend should provide an endDate or duration.
    if (eventDate > now) {
      return <Badge className="bg-blue-500 text-white">À venir</Badge>;
    } else {
      // For simplicity, if eventDate is past, it's considered Terminé
      // To have "En cours", you'd need an event end date or duration from backend.
      return <Badge className="bg-slate-500 text-white">Terminé</Badge>;
    }
  };

  const renderEventCard = (event: Event) => (
    <Card 
      key={event.eventId} // Use eventId
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
      onClick={() => handleEventClick(event)}
    >
      <div className="w-full h-48 bg-tunisiaBlue-100 flex items-center justify-center">
        <Calendar size={48} className="text-tunisiaBlue-300" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          {getStatusBadge(event)}
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(event.eventDate, false)} {/* Use eventDate */}
          </span>
        </div>
        <CardTitle className="text-xl h-14 line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="line-clamp-3 h-[4.5rem]">{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-3 flex-grow">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
            {/* Use currentParticipants and maxParticipants */}
            <span>{event.currentParticipants || 0} / {event.maxParticipants} participants</span>
          </div>
          {event.registrationDeadline && ( // Display registration deadline
             <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span>Limite d'inscription: {formatDate(event.registrationDeadline, true)}</span>
             </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        <div className="flex items-center text-sm text-gray-500">
          <Briefcase className="h-4 w-4 mr-2 text-gray-400" /> 
          <span className="line-clamp-1">{event.company?.name || "Organisateur inconnu"}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-tunisiaBlue-600 hover:text-tunisiaBlue-700"
        >
          Détails <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  // --- JSX for loading, error, and main content structure ---
  // (This part remains largely the same, ensure consistency with variable names if any were missed)
  if (error && !events.length && !loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Une erreur est survenue</h1>
          <p className="text-gray-700 mb-2">{error}</p>
          <p className="text-gray-500 mb-6">Veuillez vérifier votre connexion ou la configuration de l'API.</p>
          <Button onClick={() => fetchEvents(searchTerm || undefined)} className="mt-4">
            Réessayer de charger les événements
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-tunisiaBlue-600 to-tunisiaTeal-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Événements Plasturgie Tunisie</h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Découvrez et participez à nos formations, conférences et ateliers pour développer vos compétences dans l'industrie plastique.
            </p>
            <div className="max-w-xl mx-auto relative flex">
              <Input 
                placeholder="Rechercher un événement par titre..." 
                className="pl-10 pr-24 py-6 text-black rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Button 
                onClick={handleSearchButtonClick} 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full py-2 px-4 bg-tunisiaOrange-500 hover:bg-tunisiaOrange-600"
              >
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Events List */}
            <div className="lg:w-2/3">
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">Tous les événements</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  {loading && events.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="animate-pulse">
                          {/* Skeleton structure */}
                          <div className="w-full h-48 bg-gray-300 rounded-t-md"></div>
                          <CardHeader className="pb-2">
                            <div className="h-5 bg-gray-300 rounded w-1/4 mb-2"></div>
                            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                            <div className="h-4 bg-gray-300 rounded w-5/6 mb-1"></div>
                            <div className="h-4 bg-gray-300 rounded w-full"></div>
                          </CardHeader>
                          <CardContent className="px-6 pb-3">
                            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center pt-2">
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : !loading && error && events.length === 0 ? (
                    <div className="text-red-500 text-center py-10 bg-red-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-2">Erreur de chargement</h3>
                      <p>{error}</p>
                      <Button onClick={() => fetchEvents(searchTerm || undefined)} className="mt-4">Réessayer</Button>
                    </div>
                  ) : !loading && events.length === 0 ? (
                    <div className="text-center py-10 text-gray-600 bg-gray-100 p-6 rounded-lg">
                      <Search size={48} className="mx-auto mb-4 text-gray-400" />
                      <h3 className="text-xl font-semibold mb-2">Aucun événement trouvé</h3>
                      <p>Essayez d'ajuster vos filtres de recherche ou revenez plus tard.</p>
                      {searchTerm && <Button onClick={() => { setSearchTerm(""); fetchEvents();}} variant="link" className="mt-2">Effacer la recherche</Button>}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {events.map(renderEventCard)}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/3 space-y-6">
              {events.length > 0 && !loading && (
                <Card>
                  <CardHeader>
                    <CardTitle>Événements populaires</CardTitle>
                    <CardDescription>Quelques événements à ne pas manquer.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {events.slice(0, 3).map((event) => (
                      <div 
                        key={event.eventId} // Use eventId
                        className="flex gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors" 
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="w-20 h-20 bg-tunisiaBlue-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <Calendar size={24} className="text-tunisiaBlue-400"/>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="font-semibold text-sm line-clamp-2 leading-tight">{event.title}</h4>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {formatDate(event.eventDate, false)} {/* Use eventDate */}
                          </p>
                          <p className="text-xs text-tunisiaBlue-600 font-medium mt-1">
                            {event.currentParticipants || 0} / {event.maxParticipants} inscrits {/* Use maxParticipants */}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Newsletter</CardTitle>
                  <CardDescription>Soyez informé de nos prochains événements directement dans votre boîte mail.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Input type="email" placeholder="Votre email" />
                    <Button className="w-full bg-tunisiaTeal-500 hover:bg-tunisiaTeal-600">S'abonner</Button>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
      <Footer />

      {selectedEvent && (
        <EventWindow
          event={selectedEvent}
          isOpen={isEventWindowOpen}
          onClose={() => {
            setIsEventWindowOpen(false);
            setTimeout(() => setSelectedEvent(null), 300);
          }}
          onRegister={handleRegister}
          formatDate={formatDate} // Pass the updated formatter
        />
      )}
    </div>
  );
};

export default Events;