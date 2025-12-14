import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventDTO } from '@/services/api.types'; // Use EventDTO
import { EventAPI } from '@/services/api.service'; // Assuming EventAPI service exists
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Link } from 'react-router-dom'; // Import Link
import CreateEventModal from './CreateEventModal';

const EventList: React.FC = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<EventDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {

      const response = await EventAPI.getAllEvents();
      setEvents(response.data);
    } catch (err: any) {
      setError(err.message || t('eventList.error.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>{t('eventList.loading')}</p>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>{t('eventList.error.prefix')}{error}</p>
        <Button onClick={fetchEvents}>{t('eventList.button.retry')}</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('eventList.title')}</h2>
        <CreateEventModal>
          <Button>{t('eventList.button.createEvent')}</Button>
        </CreateEventModal>
      </div>
      <Input
        placeholder={t('eventList.placeholder.search')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredEvents.length === 0 ? (
        <p>{t('eventList.emptyState.noEventsFound')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map(event => (
            <Link key={event.eventId} to={`/dashboard/events/${event.eventId}`} className="block"> {/* Wrap Card with Link */}
              <Card> {/* Remove key from Card as it's on the Link */}
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>{t('eventList.label.location')}:</strong> {event.location}</p>
                <p><strong>{t('eventList.label.date')}:</strong> {event.eventDate ? format(new Date(event.eventDate), 'PPP p') : 'N/A'}</p>
                <p><strong>{t('eventList.label.deadline')}:</strong> {event.registrationDeadline ? format(new Date(event.registrationDeadline), 'PPP p') : 'N/A'}</p>
                <p><strong>{t('eventList.label.price')}:</strong> {event.price ? `${event.price} €` : t('eventList.price.free')}</p>
                <p><strong>{t('eventList.label.participants')}:</strong> {event.currentParticipants}/{event.maxParticipants || t('eventList.participants.noLimit')}</p>
              </CardContent>
            </Card>
          </Link> 
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
