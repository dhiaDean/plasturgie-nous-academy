import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EventDTO, EventRegistrationDTO, Role } from '@/services/api.types'; // Import EventRegistrationDTO and Role
import { EventAPI, EventRegistrationAPI } from '@/services/api.service'; // Import EventAPI and EventRegistrationAPI
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { LoadingSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { ErrorDisplay } from '@/components/dashboard/ErrorDisplay';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { useToast } from '@/components/ui/use-toast'; // Import useToast
import CreateEventModal from '@/components/dashboard/CreateEventModal'; // Import CreateEventModal
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const EventDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Get navigate function
  const { user } = useAuth(); // Get authenticated user
  const { toast } = useToast(); // Get toast function

  const [event, setEvent] = useState<EventDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false); // State to track if user is registered
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation dialog
  const [eventIdToDelete, setEventIdToDelete] = useState<number | null>(null); // State to store event ID to delete
  const [showEditModal, setShowEditModal] = useState(false); // State for edit modal

  useEffect(() => {
    if (id) {
      fetchEventDetails(id);
      if (user) { // Only fetch registration status if user is logged in
        fetchUserRegistrationStatus(id, user.userId);
      }
    }
  }, [id, user]); // Add user to dependency array

  const fetchEventDetails = async (eventId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await EventAPI.getEventById(parseInt(eventId));
      setEvent(response.data);
    } catch (err: any) {
      setError(err.message || t('eventDetails.error.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRegistrationStatus = async (eventId: string, userId: number) => {
    try {
      const response = await EventRegistrationAPI.getUserRegistrations(userId);
      const registrations = response.data;
      const registered = registrations.some(reg => reg.eventId === parseInt(eventId));
      setIsRegistered(registered);
    } catch (err: any) {
      console.error("Failed to fetch user registration status:", err);
      // Optionally set an error state specifically for registration status
    }
  };

  const handleRegistration = async (eventId: number) => {
    if (!user) {
      // Redirect to login or show a message
      toast({
        title: t('eventDetails.registration.error.notLoggedInTitle'),
        description: t('eventDetails.registration.error.notLoggedInDescription'),
        variant: 'destructive',
      });
      return;
    }

    setIsRegistering(true);
    try {
      // Assuming registerForEvent takes eventId as a parameter
      await EventRegistrationAPI.registerForEvent(eventId);
      setIsRegistered(true); // Update state on successful registration
      // Optionally refetch event details to update participant count
      fetchEventDetails(id!);
      toast({
        title: t('eventDetails.registration.successTitle'),
        description: t('eventDetails.registration.successDescription'),
      });
    } catch (err: any) {
      setError(err.message || t('eventDetails.registration.error.failed'));
      toast({
        title: t('eventDetails.registration.error.failedTitle'),
        description: err.message || t('eventDetails.registration.error.failed'),
        variant: 'destructive',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDeleteClick = (eventId: number) => {
    setEventIdToDelete(eventId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (eventIdToDelete === null) return;

    try {
      await EventAPI.deleteEvent(eventIdToDelete);
      toast({
        title: t('eventDetails.delete.successTitle'),
        description: t('eventDetails.delete.successDescription'),
      });
      navigate('/dashboard/events'); // Navigate back to event list
    } catch (err: any) {
      setError(err.message || t('eventDetails.delete.error.failed'));
      toast({
        title: t('eventDetails.delete.error.failedTitle'),
        description: err.message || t('eventDetails.delete.error.failed'),
        variant: 'destructive',
      });
    } finally {
      setShowDeleteConfirm(false);
      setEventIdToDelete(null);
    }
  };

  const handleEditEvent = (eventId: number) => {
    console.log("Edit event:", eventId);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchEventDetails(id!); // Refetch event details to show updates
  };


  if (loading) {
    return <DashboardLayout><LoadingSkeleton /></DashboardLayout>;
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorDisplay error={error} onRetry={() => fetchEventDetails(id!)} />
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-500">
          {t('eventDetails.emptyState.notFound')}
        </div>
      </DashboardLayout>
    );
  }

  const isEventFull = event.currentParticipants !== undefined && event.maxParticipants !== undefined && event.currentParticipants >= event.maxParticipants;
  const isRegistrationOpen = event.registrationDeadline ? new Date(event.registrationDeadline) > new Date() : true; // Assume open if no deadline

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{event.title}</h2>
          {user?.role === Role.ADMIN && (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => handleEditEvent(event.eventId)}>
                {t('eventDetails.button.edit')}
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteClick(event.eventId)}> {/* Use handleDeleteClick */}
                {t('eventDetails.button.delete')}
              </Button>
            </div>
          )}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t('eventDetails.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>{t('eventDetails.label.description')}:</strong> {event.description}</p>
            <p><strong>{t('eventDetails.label.location')}:</strong> {event.location}</p>
            <p><strong>{t('eventDetails.label.date')}:</strong> {event.eventDate ? format(new Date(event.eventDate), 'PPP p') : 'N/A'}</p>
            <p><strong>{t('eventDetails.label.deadline')}:</strong> {event.registrationDeadline ? format(new Date(event.registrationDeadline), 'PPP p') : 'N/A'}</p>
            <p><strong>{t('eventDetails.label.price')}:</strong> {event.price ? `${event.price} €` : t('eventDetails.price.free')}</p>
            <p><strong>{t('eventDetails.label.participants')}:</strong> {event.currentParticipants}/{event.maxParticipants || t('eventDetails.participants.noLimit')}</p>
            <p><strong>{t('eventDetails.label.type')}:</strong> {event.type || 'N/A'}</p>
            {event.companyName && (
              <p><strong>{t('eventDetails.label.company')}:</strong> {event.companyName}</p>
            )}
            <p><strong>{t('eventDetails.label.createdAt')}:</strong> {format(new Date(event.createdAt), 'PPP p')}</p>
          </CardContent>
        </Card>
        {/* Add registration button/status */}
        {user && ( // Only show registration options if logged in
          isRegistered ? (
            <p className="text-green-600">{t('eventDetails.registration.status.registered')}</p>
          ) : isEventFull ? (
            <p className="text-yellow-600">{t('eventDetails.registration.status.full')}</p>
          ) : !isRegistrationOpen ? (
             <p className="text-red-600">{t('eventDetails.registration.status.closed')}</p>
          ) : (
            <Button onClick={() => handleRegistration(event.eventId)} disabled={isRegistering}>
              {isRegistering ? t('eventDetails.registration.button.registering') : t('eventDetails.registration.button.register')}
            </Button>
          )
        )}
      </div>

      {/* Edit Event Modal */}
      {event && ( // Only render modal if event data is loaded
        <CreateEventModal
          event={event}
          onSuccess={handleEditSuccess}
          open={showEditModal} // Pass open state
          onOpenChange={setShowEditModal} // Pass state handler
        >
           {/* This trigger is hidden, modal is controlled by state */}
           <Button variant="outline" className="hidden">{t('eventDetails.button.edit')}</Button>
        </CreateEventModal>
      )}


      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('eventDetails.delete.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('eventDetails.delete.confirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('eventDetails.delete.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              {t('eventDetails.delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default EventDetailsPage;
