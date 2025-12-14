// src/pages/dashboard/CreateCertificatePage.tsx (or src/components/dashboard/CreateCertificationForm.tsx)
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CertificationAPI, UserAPI, CourseAPI } from '@/services/api.service';
// Ensure CourseListDTO has certificationEligible: boolean
import { UserListDTO, CourseListDTO, Role } from '@/services/api.types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const CreateCertificationForm = () => {
  const { t } = useTranslation();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [users, setUsers] = useState<UserListDTO[]>([]);
  const [allCourses, setAllCourses] = useState<CourseListDTO[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState<string>('');
  const [courseSearchTerm, setCourseSearchTerm] = useState<string>('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [issueDate, setIssueDate] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>(''); // Optional

  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { toast } = useToast();

  const canCreateCertificates = useMemo(() => {
    if (!user) return false;
    return user.roles?.includes(Role.ADMIN) || user.roles?.includes(Role.INSTRUCTOR);
  }, [user]);

  const filteredUsers = useMemo(() => {
    if (!userSearchTerm) return users;
    return users.filter(user =>
      user.firstName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  }, [users, userSearchTerm]);

  const eligibleCourses = useMemo(() => {
    // Ensure your CourseListDTO from api.types.ts has certificationEligible: boolean
    return allCourses.filter(course => course.certificationEligible === true);
  }, [allCourses]);

  const filteredEligibleCourses = useMemo(() => {
    if (!courseSearchTerm) return eligibleCourses;
    return eligibleCourses.filter(course =>
      course.title.toLowerCase().includes(courseSearchTerm.toLowerCase())
    );
  }, [eligibleCourses, courseSearchTerm]);


  useEffect(() => {
    const fetchDataForDropdowns = async () => {
      if (isAuthLoading) return; // Wait for authentication to resolve

      if (!user) { // Should not happen if isAuthLoading is false and route is protected
        setFetchError(t('createCertification.error.notLoggedIn', 'You must be logged in.'));
        setIsLoadingData(false);
        return;
      }

      if (!canCreateCertificates) {
        setFetchError(t('createCertification.error.unauthorized', 'You are not authorized to create certificates.'));
        setIsLoadingData(false);
        return;
      }
      
      setIsLoadingData(true);
      setFetchError(null);

      try {
        const [usersResponse, coursesResponse] = await Promise.all([
          UserAPI.getAllUsersForList(),
          CourseAPI.getAllCoursesForList()
        ]);
        
        setUsers(usersResponse.data || []);
        setAllCourses(coursesResponse.data || []);
      } catch (error: any) {
        const errMsg = error.response?.data?.message || error.message || t('createCertification.error.failedToLoadData', 'Failed to load necessary data.');
        setFetchError(errMsg);
        toast({ title: t('createCertification.toast.loadingErrorTitle', 'Loading Error'), description: errMsg, variant: "destructive" });
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchDataForDropdowns();
  }, [user, canCreateCertificates, isAuthLoading, toast, t]); // Added canCreateCertificates to ensure re-fetch if derived auth status changes

  const selectedCourseIsActuallyEligible = useMemo(() => {
    if (!selectedCourseId) return false;
    return eligibleCourses.some(c => String(c.courseId) === selectedCourseId);
  }, [selectedCourseId, eligibleCourses]);

  // Simplified: The Select component only shows eligible courses, so no extra toast needed here.
  // The warning below the select and the submit validation are sufficient.
  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUserId || !selectedCourseId || !issueDate) {
      toast({ 
        title: t('createCertification.toast.requiredFieldsTitle', 'Missing Information'), 
        description: t('createCertification.toast.requiredFieldsDescription', 'Please fill in all required fields (User, Course, Issue Date).'), 
        variant: "destructive" 
      });
      return;
    }

    if (!selectedCourseIsActuallyEligible) {
        toast({ 
            title: t('createCertification.toast.courseNotEligibleTitle', 'Course Not Eligible'), 
            description: t('createCertification.toast.selectedCourseNotEligibleDescription', 'The selected course is not eligible for certification.'), 
            variant: "destructive" 
        });
        return;
    }

    setIsSubmitting(true);
    try {
      const userIdNum = parseInt(selectedUserId, 10);
      const courseIdNum = parseInt(selectedCourseId, 10);
      
      // The datetime-local input value should be directly usable if the backend expects ISO_DATE_TIME
      const formattedIssueDate = issueDate; 
      const formattedExpiryDate = expiryDate ? expiryDate : undefined;

      await CertificationAPI.create(userIdNum, courseIdNum, formattedIssueDate, formattedExpiryDate);
      toast({ 
        title: t('createCertification.toast.successTitle', "Success"), 
        description: t('createCertification.toast.successDescription', "Certification created successfully.") 
      });
      // Reset form
      setSelectedUserId('');
      setSelectedCourseId('');
      setIssueDate('');
      setExpiryDate('');
      // Potentially navigate or refetch a list of certifications if displayed elsewhere
    } catch (error: any) {
      const errorData = error.response?.data;
      let errorMessage = t('createCertification.error.unknown', 'An unknown error occurred.');
      if (errorData) {
        errorMessage = errorData.message ||
                       (errorData.error && typeof errorData.error === 'string' ? errorData.error : null) ||
                       (errorData.errors && typeof errorData.errors === 'object' ? Object.values(errorData.errors).join(', ') : null) ||
                       error.message ||
                       errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({ 
        title: t('createCertification.toast.creationErrorTitle', 'Creation Failed'), 
        description: `${t('createCertification.toast.creationErrorPrefix', 'Could not create certification: ')}${errorMessage}`, 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isAuthLoading || isLoadingData) {
    return (
        <div className="min-h-[calc(100vh-theme('spacing.16'))] flex flex-col items-center justify-center p-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-muted-foreground">
              {isAuthLoading ? t('createCertification.loading.authenticating', 'Authenticating...') : t('createCertification.loading.formData', 'Loading form data...')}
            </p>
        </div>
    );
  }

  if (fetchError) {
    return (
        <div className="min-h-[calc(100vh-theme('spacing.16'))] flex flex-col items-center justify-center p-4 text-center">
            <Alert variant="destructive" className="max-w-lg">
                <AlertTitle>{t('createCertification.error.loadingDataTitle', 'Error Loading Data')}</AlertTitle>
                <AlertDescription>{fetchError}</AlertDescription>
                <Button 
                  onClick={() => window.location.reload()} // Or a more specific refetch function
                  variant="outline" 
                  className="mt-4"
                >
                  {t('createCertification.button.retry', 'Retry')}
                </Button>
            </Alert>
        </div>
    );
  }
  
  if (!canCreateCertificates) {
    return (
        <div className="min-h-[calc(100vh-theme('spacing.16'))] flex flex-col items-center justify-center p-4 text-center">
            <Alert variant="destructive" className="max-w-lg">
                <AlertTitle>{t('createCertification.error.accessDeniedTitle', 'Access Denied')}</AlertTitle>
                <AlertDescription>{t('createCertification.error.accessDeniedDescription', 'You do not have permission to create certifications.')}</AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
        <Card>
        <CardHeader>
            <CardTitle className="text-2xl">{t('createCertification.title', 'Create New Certification')}</CardTitle>
            <CardDescription>
            {t('createCertification.description', 'Fill in the details below to issue a new certification.')}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="user">{t('createCertification.label.user', 'Select User')}</Label>
                <Input
                  id="user-search"
                  type="text"
                  placeholder={t('createCertification.placeholder.searchUsers', 'Search users...')}
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  disabled={isSubmitting || users.length === 0}
                  className="mb-2"
                />
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                  disabled={isSubmitting || filteredUsers.length === 0}
                  required
                >
                  <SelectTrigger id="user"><SelectValue placeholder={t('createCertification.placeholder.selectUser', 'Select a user...')} /></SelectTrigger>
                  <SelectContent>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <SelectItem key={u.userId} value={String(u.userId)}>
                          {u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.username} ({u.email})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-users" disabled>{t('createCertification.emptyState.noUsersFound', 'No users found')}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="course">{t('createCertification.label.course', 'Select Course')}</Label>
                 <Input
                  id="course-search"
                  type="text"
                  placeholder={t('createCertification.placeholder.searchCourses', 'Search courses...')}
                  value={courseSearchTerm}
                  onChange={(e) => setCourseSearchTerm(e.target.value)}
                  disabled={isSubmitting || eligibleCourses.length === 0}
                  className="mb-2"
                />
                <Select
                  value={selectedCourseId}
                  onValueChange={handleCourseChange}
                  disabled={isSubmitting || filteredEligibleCourses.length === 0}
                  required
                >
                  <SelectTrigger id="course"><SelectValue placeholder={t('createCertification.placeholder.selectEligibleCourse', 'Select an eligible course...')} /></SelectTrigger>
                  <SelectContent>
                    {filteredEligibleCourses.length > 0 ? (
                      filteredEligibleCourses.map((course) => (
                        <SelectItem key={course.courseId} value={String(course.courseId)}>{course.title}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-courses" disabled>{t('createCertification.emptyState.noEligibleCoursesFound', 'No eligible courses found')}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {selectedCourseId && !selectedCourseIsActuallyEligible && (
                    <p className="text-sm text-destructive mt-1">{t('createCertification.warning.courseNotEligible', 'The selected course is not eligible for certification.')}</p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="issueDate">{t('createCertification.label.issueDate', 'Issue Date')}</Label>
                    <Input
                      id="issueDate"
                      type="datetime-local"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="expiryDate">{t('createCertification.label.expiryDate', 'Expiry Date (Optional)')}</Label>
                    <Input
                      id="expiryDate"
                      type="datetime-local"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      disabled={isSubmitting}
                    />
                </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !selectedUserId || !issueDate || !selectedCourseIsActuallyEligible}
            >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? t('createCertification.button.submitting', 'Creating...') : t('createCertification.button.create', 'Create Certification')}
            </Button>
            </form>
        </CardContent>
        </Card>
    </div>
  );
};

export default CreateCertificationForm;
