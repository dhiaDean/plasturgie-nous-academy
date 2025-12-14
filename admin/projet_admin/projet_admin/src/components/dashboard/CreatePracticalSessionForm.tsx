"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, ArrowLeft, Calendar, MapPin, Clock, BookOpen, User as UserIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Role, PracticalSessionStatus, CourseListDTO, InstructorListDTO } from '@/services/api.types';
import { CourseAPI, PracticalSessionAPI, InstructorAPI } from '@/services/api.service';

interface CreatePracticalSessionFormData {
  title: string;
  description: string;
  sessionDateTime: string;
  durationMinutes: number;
  location: string;
  courseId: number | null;
  maxParticipants: number;
  status: PracticalSessionStatus;
  conductingInstructorIdForAdmin: number | null;
}

interface Course extends CourseListDTO {}
interface Instructor extends InstructorListDTO {}

const CreatePracticalSessionForm: React.FC = () => {
  const { t } = useTranslation();
  const { user, instructorProfile, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreatePracticalSessionFormData>({
    title: '',
    description: '',
    sessionDateTime: '',
    durationMinutes: 60,
    location: '',
    courseId: null,
    maxParticipants: 20,
    status: PracticalSessionStatus.UPCOMING,
    conductingInstructorIdForAdmin: null,
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<CreatePracticalSessionFormData>>({});

  const isUserAdmin = user?.roles?.includes(Role.ADMIN);
  const isUserInstructor = user?.roles?.includes(Role.INSTRUCTOR);
  const canCreateSession = isUserInstructor || isUserAdmin;

  useEffect(() => {
    if (!isAuthLoading && !canCreateSession) {
      toast({
        title: t('createSession.error.unauthorized'),
        description: t('createSession.error.noPermission'),
        variant: "destructive",
      });
      navigate('/dashboard/practical-sessions');
    }
  }, [user, isAuthLoading, canCreateSession, navigate, toast, t]);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const coursePromise = CourseAPI.getAllCoursesForList();
        const instructorPromise = isUserAdmin ? InstructorAPI.getAllInstructorsForList() : Promise.resolve(null);

        const [courseResponse, instructorResponse] = await Promise.all([coursePromise, instructorPromise]);

        setCourses(courseResponse.data || []);
        if (instructorResponse) {
          setInstructors(instructorResponse.data || []);
        }

      } catch (err) {
        console.error('Error fetching initial data:', err);
        toast({
          title: t('createSession.error.dataLoadFailed'),
          variant: "destructive",
        });
      } finally {
        setDataLoading(false);
      }
    };

    if (canCreateSession) {
      fetchData();
    }
  }, [isAuthLoading, canCreateSession, isUserAdmin, t, toast]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreatePracticalSessionFormData> = {};
    if (!formData.title.trim()) newErrors.title = t('createSession.validation.titleRequired');
    if (!formData.sessionDateTime) newErrors.sessionDateTime = t('createSession.validation.dateTimeRequired');
    else {
      const sessionDate = new Date(formData.sessionDateTime);
      if (sessionDate <= new Date()) newErrors.sessionDateTime = t('createSession.validation.futureDateTime');
    }
    if (!formData.location.trim()) newErrors.location = t('createSession.validation.locationRequired');
    if (formData.durationMinutes <= 0) newErrors.durationMinutes = t('createSession.validation.durationPositive');
    if (formData.maxParticipants <= 0) newErrors.maxParticipants = t('createSession.validation.maxParticipantsPositive');
    if (!formData.courseId) newErrors.courseId = t('createSession.validation.courseRequired');

    if (isUserAdmin && !formData.conductingInstructorIdForAdmin) {
      newErrors.conductingInstructorIdForAdmin = t('createSession.validation.instructorRequiredAdmin');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CreatePracticalSessionFormData,
    value: string | number | null | PracticalSessionStatus // Explicitly define possible types
  ) => {
    let processedValue: string | number | null | PracticalSessionStatus = value;

    // Explicitly parse number fields from string inputs
    if (typeof value === 'string') {
      if (field === 'durationMinutes' || field === 'maxParticipants') {
        processedValue = parseInt(value, 10) || 0; // Use radix 10
      } else if (field === 'courseId' || field === 'conductingInstructorIdForAdmin') {
         // For select components, value might be string or null
         processedValue = value === '' ? null : parseInt(value, 10); // Use radix 10
         if (isNaN(processedValue as number) && value !== '') processedValue = null; // Handle cases where parsing fails, but allow empty string for null
      }
    }


    setFormData(prev => ({ ...prev, [field]: processedValue as any })); // Use as any for now, refine type later if needed
    
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: t('createSession.error.validationFailed'),
        description: t('createSession.error.checkFields'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    let actualConductingInstructorId: number | undefined = undefined;

    if (isUserInstructor) {
      if (!instructorProfile?.instructorId) {
        toast({
          title: t('createSession.error.instructorProfileError'),
          description: t('createSession.error.instructorIdMissing'),
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      actualConductingInstructorId = instructorProfile.instructorId;
    } else if (isUserAdmin) {
      if (formData.conductingInstructorIdForAdmin) {
        actualConductingInstructorId = formData.conductingInstructorIdForAdmin;
      } else {
        toast({ title: t('createSession.error.validationFailedTitle'), description: t('createSession.validation.instructorRequiredAdmin'), variant: "destructive" });
        setLoading(false);
        return;
      }
    }

    if (actualConductingInstructorId === undefined) {
        toast({ title: t('createSession.error.unknown'), description: t('createSession.error.instructorCouldNotBeDetermined'), variant: "destructive" });
        setLoading(false);
        return;
    }

    try {
      const sessionPayload = {
        title: formData.title,
        description: formData.description,
        sessionDateTime: formData.sessionDateTime,
        durationMinutes: formData.durationMinutes,
        location: formData.location,
        courseId: formData.courseId!,
        maxParticipants: formData.maxParticipants,
        status: formData.status,
        conductingInstructorId: actualConductingInstructorId,
      };

      await PracticalSessionAPI.createPracticalSession(sessionPayload);
      
      toast({
        title: t('createSession.success.title'),
        description: t('createSession.success.description', { title: formData.title }),
      });
      navigate('/dashboard/practical-sessions');
    } catch (err: any) {
      console.error('Error creating practical session:', err);
      const errMsg = err?.response?.data?.message || err?.message || t('createSession.error.createFailed');
      toast({
        title: t('createSession.error.createFailedTitle'),
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate('/dashboard/practical-sessions');

  if (isAuthLoading || (dataLoading && canCreateSession)) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
        <p className="ml-4 text-xl text-gray-700">
          {isAuthLoading ? t('loading.authenticating') : t('loading.data')}
        </p>
      </div>
    );
  }

  if (!canCreateSession) return null;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft size={20} />
          {t('createSession.button.back')}
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {t('createSession.title')}
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {t('createSession.form.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                {t('createSession.form.sessionTitle')} *
              </Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder={t('createSession.form.titlePlaceholder')}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                {t('createSession.form.description')}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={t('createSession.form.descriptionPlaceholder')}
                rows={4}
              />
            </div>

            {/* Session Date and Time & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionDateTime" className="text-sm font-medium flex items-center gap-2">
                  <Calendar size={16} />
                  {t('createSession.form.dateTime')} *
                </Label>
                <Input
                  id="sessionDateTime"
                  type="datetime-local"
                  value={formData.sessionDateTime}
                  onChange={(e) => handleInputChange('sessionDateTime', e.target.value)}
                  className={errors.sessionDateTime ? 'border-red-500' : ''}
                />
                {errors.sessionDateTime && (
                  <p className="text-sm text-red-600">{errors.sessionDateTime}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationMinutes" className="text-sm font-medium flex items-center gap-2">
                  <Clock size={16} />
                  {t('createSession.form.duration')} *
                </Label>
                <Input
                  id="durationMinutes"
                  type="number"
                  min="1"
                  value={formData.durationMinutes}
                  onChange={(e) => handleInputChange('durationMinutes', parseInt(e.target.value, 10) || 0)}
                  placeholder="60"
                  className={errors.durationMinutes ? 'border-red-500' : ''}
                />
                {errors.durationMinutes && (
                  <p className="text-sm text-red-600">{errors.durationMinutes}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                <MapPin size={16} />
                {t('createSession.form.location')} *
              </Label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder={t('createSession.form.locationPlaceholder')}
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && (
                  <p className="text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              {/* Course Selection */}
              <div className="space-y-2">
                <Label htmlFor="courseId" className="text-sm font-medium flex items-center gap-2">
                  <BookOpen size={16} />
                  {t('createSession.form.course')} *
                </Label>
                <Select
                  value={formData.courseId?.toString() || ''}
                  onValueChange={(value) => handleInputChange('courseId', value === '' ? null : parseInt(value, 10))}
                >
                  <SelectTrigger className={errors.courseId ? 'border-red-500' : ''}>
                    <SelectValue placeholder={
                      dataLoading 
                        ? t('createSession.form.loadingCourses')
                        : t('createSession.form.selectCourse')
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.courseId} value={course.courseId.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.courseId && (
                  <p className="text-sm text-red-600">{errors.courseId}</p>
                )}
              </div>

              {/* Conducting Instructor Selection (Only for Admin) */}
              {isUserAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="conductingInstructorIdForAdmin" className="text-sm font-medium flex items-center gap-2">
                    <UserIcon size={16} />
                    {t('createSession.form.conductingInstructor')} *
                  </Label>
                  <Select
                    value={formData.conductingInstructorIdForAdmin?.toString() || ''}
                    onValueChange={(value) => handleInputChange('conductingInstructorIdForAdmin', value === '' ? null : parseInt(value, 10))}
                  >
                    <SelectTrigger className={errors.conductingInstructorIdForAdmin ? 'border-red-500' : ''}>
                      <SelectValue placeholder={
                        dataLoading 
                          ? t('createSession.form.loadingInstructors')
                          : t('createSession.form.selectInstructor')
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id.toString()}>
                          {instructor.name} (ID: {instructor.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.conductingInstructorIdForAdmin && (
                    <p className="text-sm text-red-600">{errors.conductingInstructorIdForAdmin}</p>
                  )}
                </div>
              )}

              {/* Max Participants and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants" className="text-sm font-medium flex items-center gap-2">
                    <UserIcon size={16} />
                    {t('createSession.form.maxParticipants')} *
                  </Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    min="1"
                    value={formData.maxParticipants}
                    onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value, 10) || 0)}
                    placeholder="20"
                    className={errors.maxParticipants ? 'border-red-500' : ''}
                  />
                  {errors.maxParticipants && (
                    <p className="text-sm text-red-600">{errors.maxParticipants}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium">
                    {t('createSession.form.status')} *
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: PracticalSessionStatus) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PracticalSessionStatus.UPCOMING}>
                        {t('createSession.status.upcoming')}
                      </SelectItem>
                      <SelectItem value={PracticalSessionStatus.COMPLETED}>
                        {t('createSession.status.completed')}
                      </SelectItem>
                      <SelectItem value={PracticalSessionStatus.CANCELLED}>
                        {t('createSession.status.cancelled')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={loading || dataLoading}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {loading ? t('createSession.button.creating') : t('createSession.button.create')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading || dataLoading}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('createSession.button.cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  export default CreatePracticalSessionForm;
