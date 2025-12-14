import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CreateEventForm from './CreateEventForm';
import { EventDTO } from '@/services/api.types'; // Import EventDTO

interface CreateEventModalProps {
  children: React.ReactNode;
  event?: EventDTO; // Optional event prop for editing
  onSuccess?: () => void; // Optional callback for success
  open: boolean; // Prop to control modal open state
  onOpenChange: (open: boolean) => void; // Prop to handle open state changes
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ children, event, onSuccess, open, onOpenChange }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}> {/* Control modal open state */}
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? t('createEventModal.editTitle') : t('createEventModal.createTitle')}</DialogTitle> {/* Change title based on event prop */}
        </DialogHeader>
        <CreateEventForm event={event} onSuccess={onSuccess} /> {/* Pass event and onSuccess props to CreateEventForm */}
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;
