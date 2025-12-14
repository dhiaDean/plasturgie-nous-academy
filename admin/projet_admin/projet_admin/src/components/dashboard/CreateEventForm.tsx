import React, { useEffect } from 'react'; // Import useEffect
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form'; // Import useForm
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver
import * as z from 'zod'; // Import zod
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Import form components
import { EventAPI } from '@/services/api.service'; // Import EventAPI
import { EventDTO } from '@/services/api.types'; // Import EventDTO
import { useToast } from '@/components/ui/use-toast'; // Import useToast

// Define the form schema
const eventFormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  location: z.string().optional(),
  eventDate: z.string().optional(), // Consider using a date picker and Date type
  registrationDeadline: z.string().optional(), // Consider using a date picker and Date type
  price: z.number().optional(), // Consider using a number input
  maxParticipants: z.number().optional(), // Consider using a number input
  type: z.string().optional(),
  companyId: z.number().optional(), // Assuming companyId is a number
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface CreateEventFormProps {
  event?: EventDTO; // Optional event prop for editing
  onSuccess?: () => void; // Optional callback for success
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ event, onSuccess }) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      location: event?.location || '',
      eventDate: event?.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '', // Format date for input
      registrationDeadline: event?.registrationDeadline ? new Date(event.registrationDeadline).toISOString().split('T')[0] : '', // Format date for input
      price: event?.price || undefined,
      maxParticipants: event?.maxParticipants || undefined,
      type: event?.type || '',
      companyId: event?.companyId || undefined,
    },
  });

  // Effect to reset form when event prop changes (for editing)
  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title || '',
        description: event.description || '',
        location: event.location || '',
        eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
        registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline).toISOString().split('T')[0] : '',
        price: event.price || undefined,
        maxParticipants: event.maxParticipants || undefined,
        type: event.type || '',
        companyId: event.companyId || undefined,
      });
    } else {
      form.reset({ // Reset for create mode
        title: '',
        description: '',
        location: '',
        eventDate: '',
        registrationDeadline: '',
        price: undefined,
        maxParticipants: undefined,
        type: '',
        companyId: undefined,
      });
    }
  }, [event, form]);


  const onSubmit = async (values: EventFormValues) => {
    try {
      if (event) {
        // Update existing event
        await EventAPI.updateEvent(event.eventId, values); // Assuming updateEvent exists
        toast({
          title: t('createEventForm.updateSuccessTitle'),
          description: t('createEventForm.updateSuccessDescription'),
        });
      } else {
        // Create new event
        await EventAPI.createEvent(values); // Assuming createEvent exists
        toast({
          title: t('createEventForm.createSuccessTitle'),
          description: t('createEventForm.createSuccessDescription'),
        });
      }
      onSuccess?.(); // Call success callback
    } catch (err: any) {
      toast({
        title: t('createEventForm.errorTitle'),
        description: err.message || t('createEventForm.errorDescription'),
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createEventForm.label.title')}</FormLabel>
              <FormControl>
                <Input placeholder={t('createEventForm.placeholder.title')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createEventForm.label.location')}</FormLabel>
              <FormControl>
                <Input placeholder={t('createEventForm.placeholder.location')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add more FormFields for other fields */}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? t('createEventForm.button.submitting') : (event ? t('createEventForm.button.update') : t('createEventForm.button.create'))}
        </Button>
      </form>
    </Form>
  );
};

export default CreateEventForm;
