// src/components/formations/FormationList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseAPI, InstructorAPI } from '@/services/api.service';
import { API_BASE_URL } from '@/services/api.constants';
import {
  CourseDetailResponseDTO as CourseDetail,
  CourseInputDTO as FrontendCourseInputDTO,
  SimpleInstructorDTO,
  CourseListDTO,
  CourseMode,
  Role,
  InstructorListDTO, // Assuming /api/instructors/me returns this or similar with an 'id' field
  InstructorResponseDTO, // If /api/instructors/me returns InstructorResponseDTO, import and use that instead for instructorProfileResponse
} from '@/services/api.types';
import { FormationModal } from './FormationModal'; // Ensure this path is correct
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit3, ImageOff, Loader2, AlertTriangle, PlusCircle, Search } from "lucide-react";
import { AxiosResponse } from 'axios';
import { useAuth } from '@/context/AuthContext';
// import { useToast } from "@/components/ui/use-toast"; // Uncomment if you set up Toasts

const FormationListComponent = () => {
  const { t } = useTranslation();
  // const { toast } = useToast();
  const { user, isLoading: isUserLoading } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState<CourseDetail | null>(null);
  const [formations, setFormations] = useState<CourseListDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For list loading
  const [isSaving, setIsSaving] = useState(false);   // For save operation loading
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFormations = useCallback(async () => {
    if (isUserLoading) {
        console.log("FormationList: Waiting for user auth state to resolve...");
        // Keep isLoading true until user auth state is resolved
        return; 
    }
    if (!user) {
        console.log("FormationList: No user logged in. Clearing formations and error.");
        setFormations([]);
        setError(null); // Clear any previous errors
        setIsLoading(false); 
        return;
    }

    setIsLoading(true);
    setError(null);
    let fetchedCoursesData: CourseListDTO[] = [];

    try {
      let apiResponse: AxiosResponse<CourseListDTO[]>; // Changed name to avoid conflict
      const isAdmin = user.roles?.includes(Role.ADMIN);
      const isInstructorRole = user.roles?.includes(Role.INSTRUCTOR);

      if (isAdmin) {
        console.log("FormationList: Fetching all courses for ADMIN user:", user.username);
        apiResponse = await CourseAPI.getAllCoursesForList();
        if (Array.isArray(apiResponse.data)) {
            fetchedCoursesData = apiResponse.data;
        } else {
            console.warn("Admin fetch: Received non-array data for formations:", apiResponse.data);
        }
      } else if (isInstructorRole) {
        console.log("FormationList: Fetching courses for INSTRUCTOR user:", user.username);
        try {
            // Assumes InstructorAPI.getMe() returns an object like InstructorListDTO or InstructorResponseDTO
            // which contains the instructor's primary ID.
            const instructorProfileResponse = await InstructorAPI.getMe();
            
            // Adapt to the actual structure of instructorProfileResponse.data
            // Based on your log: {id: 1, name: 'ahmed balti', rating: 4, userId: 25}
            // So, we use 'id' as the instructor's primary identifier for courses.
            // Correcting type assertion based on expected data structure and error message.
            const instructorRecord = instructorProfileResponse.data as (InstructorResponseDTO & { id?: number, userId?: number, instructorId?: number }); // Be flexible

            let instructorEntityId: number | undefined = undefined;
            if (instructorRecord) {
                if (typeof instructorRecord.instructorId === 'number') { // Prefer 'instructorId'
                    instructorEntityId = instructorRecord.instructorId;
                } else if (typeof instructorRecord.id === 'number') { // Fallback to 'id'
                    instructorEntityId = instructorRecord.id;
                     console.log(`FormationList: Using 'id' (${instructorEntityId}) as instructorId for user: ${user.username}`);
                }
            }

            if (instructorEntityId) {
                console.log(`FormationList: Fetched instructor ID: ${instructorEntityId} for user: ${user.username}. Fetching their courses.`);
                apiResponse = await CourseAPI.getCoursesByInstructorForList(instructorEntityId);
                if (Array.isArray(apiResponse.data)) {
                    fetchedCoursesData = apiResponse.data;
                } else {
                    console.warn("Instructor fetch: Received non-array data for formations:", apiResponse.data);
                }
            } else {
                console.warn(`User ${user.username} has INSTRUCTOR role but no valid 'instructorId' or 'id' found in profile response. Profile data:`, instructorProfileResponse.data);
                setError(t('formationList.error.instructorProfileIncomplete'));
            }
        } catch (instructorError: any) {
             console.error(`FormationList: Error fetching instructor profile for user ${user.username}:`, instructorError);
             if (instructorError.response?.status === 404) {
                 setError(t('formationList.error.instructorProfileNotFound'));
             } else {
                 const errMsg = instructorError?.response?.data?.message || instructorError?.message || t('formationList.error.failedToLoadInstructorProfile');
                 setError(`${t('formationList.error.instructorProfileErrorPrefix')}${errMsg}`);
             }
        }
      } else {
        console.log("FormationList: User is not Admin or Instructor. Not fetching formations list for dashboard.");
        setError(t('formationList.error.notAuthorized'));
      }
      
      const validFormations = fetchedCoursesData.filter(
        (f): f is CourseListDTO => 
          f && typeof f.courseId === 'number' && typeof f.title === 'string' && f.mode !== undefined
      );
      setFormations(validFormations);

    } catch (err: any) {
      console.error("FormationList: Error fetching formations list:", err);
      const errMsg = err?.response?.data?.message || err?.message || t('formationList.error.failedToLoadFormations');
      setError(errMsg);
      setFormations([]); 
    } finally {
      setIsLoading(false);
    }
  }, [user, isUserLoading, t]);

  useEffect(() => {
    fetchFormations();
  }, [fetchFormations]);

  const handleOpenCreateModal = () => {
    setEditingFormation(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (formationToList: CourseListDTO) => {
    setIsSaving(true); // Indicate loading for fetching details
    setError(null);
    try {
      const response = await CourseAPI.getById(formationToList.courseId);
      setEditingFormation(response.data);
      setIsModalOpen(true);
    } catch (error: any) {
      console.error("Error fetching formation details for edit:", error);
      setError(error?.response?.data?.message || error.message || "Could not load formation details for editing.");
      // toast({ title: "Error", description: "Could not load formation details for editing.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingFormation(null);
  };

  const handleFormationSave = async (
    dataFromModal: Partial<FrontendCourseInputDTO & { courseId?: number; imageFile?: File | null; instructors?: SimpleInstructorDTO[] } >
  ) => {
    setIsSaving(true);
    setError(null);
    
    const formData = new FormData();
    const courseJsonData: Partial<FrontendCourseInputDTO> = {
      title: dataFromModal.title,
      description: dataFromModal.description,
      price: dataFromModal.price,
      category: dataFromModal.category,
      mode: dataFromModal.mode as CourseMode,
      level: dataFromModal.level,
      startDate: dataFromModal.startDate || undefined,
      durationHours: dataFromModal.durationHours,
      location: dataFromModal.location,
      certificationEligible: dataFromModal.certificationEligible,
    };

    if (dataFromModal.instructors && dataFromModal.instructors.length > 0) {
      courseJsonData.instructorIds = dataFromModal.instructors.map(
        (inst: SimpleInstructorDTO) => inst.instructorId
      );
    } else {
      courseJsonData.instructorIds = [];
    }

    const cleanedJsonData = Object.fromEntries(
        Object.entries(courseJsonData).filter(([_,v]) => v !== undefined && v !== null) // Also filter out nulls
    ) as Partial<FrontendCourseInputDTO>;

    try {
      formData.append('courseDto', new Blob([JSON.stringify(cleanedJsonData)], { type: 'application/json' }));
    } catch (e) {
      console.error("Error stringifying course JSON data:", e, cleanedJsonData);
      setError("Error preparing formation data for submission.");
      setIsSaving(false);
      return;
    }

    if (dataFromModal.imageFile) {
      formData.append('imageFile', dataFromModal.imageFile, dataFromModal.imageFile.name);
    }

    try {
      const isEditing = !!dataFromModal.courseId;

      if (isEditing) {
        await CourseAPI.update(dataFromModal.courseId!, formData);
        // toast({ title: "Success", description: "Formation updated successfully!" });
      } else {
        await CourseAPI.create(formData);
        // toast({ title: "Success", description: "Formation created successfully!" });
      }
      handleModalClose();
      fetchFormations(); // Refresh the list
    } catch (err: any) {
      console.error("Error saving formation (V2):", err);
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to save formation.";
      setError(errorMsg); // Display error for user
      // toast({ title: "Save Error", description: errorMsg, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredFormations = formations.filter((formation) => {
    if (!searchTerm) return true;
    const lowerSearchTerm = searchTerm.toLowerCase();
    // Ensure properties exist before calling toLowerCase
    const titleMatch = formation.title && formation.title.toLowerCase().includes(lowerSearchTerm);
    const categoryMatch = formation.category && formation.category.toLowerCase().includes(lowerSearchTerm);
    const instructorMatch = formation.firstInstructorName && formation.firstInstructorName.toLowerCase().includes(lowerSearchTerm);
    return titleMatch || categoryMatch || instructorMatch;
  });

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
        <p className="ml-4 text-xl text-gray-700">{t('formationList.loading.authenticating')}</p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
        <p className="ml-4 text-xl text-gray-700">{t('formationList.loading.formations')}</p>
      </div>
    );
  }

  // Show primary error if list is empty and an error occurred
  if (error && formations.length === 0) {
    return (
      <div className="m-auto text-center p-6 md:p-10 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-md" role="alert">
        <AlertTriangle className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 text-red-500" />
        <p className="text-lg md:text-xl font-bold">{t('formationList.error.somethingWentWrong')}</p>
        <p className="mt-2 mb-4 md:mb-6 text-sm md:text-base">{error}</p>
        <Button variant="destructive" onClick={fetchFormations} disabled={isLoading || isSaving}>
          {(isLoading || isSaving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('formationList.button.tryAgain')}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t('formationList.title')}</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={t('formationList.placeholder.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          {(user?.roles?.includes(Role.ADMIN) || user?.roles?.includes(Role.INSTRUCTOR)) && (
            <Button onClick={handleOpenCreateModal} className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
              <PlusCircle size={18} className="mr-2" /> {t('formationList.button.createFormation')}
            </Button>
          )}
        </div>
      </div>
      
      {/* Inline error for failed refresh if list was previously populated (and not currently in a major error state) */}
      {error && formations.length > 0 && !isLoading && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded-md text-sm mb-4" role="alert">
          <p>{t('formationList.error.couldNotRefresh')}{error}</p>
          <Button variant="link" size="sm" onClick={fetchFormations} className="text-yellow-800 p-0 h-auto mt-1" disabled={isLoading || isSaving}>
            {(isLoading || isSaving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('formationList.button.retry')}
          </Button>
        </div>
      )}

      {!isLoading && filteredFormations.length === 0 && !error ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
          <ImageOff size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            {searchTerm ? t('formationList.emptyState.noMatch') : (user?.roles?.includes(Role.INSTRUCTOR) ? t('formationList.emptyState.noInstructorFormations') : t('formationList.emptyState.noFormationsAvailable'))}
          </h3>
          <p className="text-gray-500 mt-2">
            {searchTerm ? t('formationList.emptyState.tryDifferentSearch') : ((user?.roles?.includes(Role.ADMIN) || user?.roles?.includes(Role.INSTRUCTOR)) ? t('formationList.emptyState.getStarted') : "")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFormations.map((formation) => (
            <Card key={formation.courseId} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
              <FormationCardImage imageUrl={formation.imageUrl} title={formation.title} />
              <CardHeader className="pt-4 pb-2">
                <CardTitle className="text-lg leading-tight truncate hover:text-blue-600 transition-colors cursor-pointer" onClick={() => handleOpenEditModal(formation)}>
                  {formation.title || t('formationList.card.untitledCourse')}
                </CardTitle>
                <div className="flex flex-wrap gap-1 mt-2">
                    {formation.category && <Badge variant="secondary">{formation.category}</Badge>}
                    {formation.mode && <Badge variant="outline" className="capitalize">{formation.mode.toString().replace(/_/g, ' ').toLowerCase()}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-1 pb-3 text-sm text-gray-600 space-y-1">
                {formation.firstInstructorName && <p><strong>{t('formationList.card.by')}</strong> {formation.firstInstructorName}</p>}
                {(formation.price !== null && formation.price !== undefined) && <p><strong>{t('formationList.card.price')}</strong> {formation.price === 0 ? t('formationList.card.priceFree') : `${formation.price.toFixed(2)} DT`}</p>}
                {formation.level && <p><strong>{t('formationList.card.level')}</strong> {formation.level}</p>}
                {formation.duration && <p><strong>{t('formationList.card.duration')}</strong> {formation.duration}</p>}
              </CardContent>
              <CardFooter className="border-t p-3">
                <Button variant="ghost" size="sm" onClick={() => handleOpenEditModal(formation)} className="w-full justify-start text-blue-600 hover:text-blue-700">
                  <Edit3 size={16} className="mr-2" /> {t('formationList.button.editViewDetails')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <FormationModal
          formation={editingFormation}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSave={handleFormationSave}
        />
      )}
    </div>
  );
};

const FormationCardImage = ({ imageUrl, title }: { imageUrl?: string | null; title?: string | null }) => {
  const { t } = useTranslation(); // Add useTranslation here
  const [imgError, setImgError] = useState(false);
  const API_SERVER_ORIGIN = new URL(API_BASE_URL).origin;

  const fullImageUrl = imageUrl && !imgError
    ? (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') 
        ? imageUrl 
        : `${API_SERVER_ORIGIN}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`)
    : null;

  useEffect(() => {
    setImgError(false); 
  }, [imageUrl]);

  if (!fullImageUrl) {
    return (
      <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center" aria-label={t('formationList.image.placeholderAlt')}>
        <ImageOff className="h-16 w-16 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-48">
      <img
        src={fullImageUrl}
        alt={title || t('formationList.image.courseImageAlt')}
        className="w-full h-full object-cover"
        onError={() => {
          console.warn("Image failed to load from src:", fullImageUrl);
          setImgError(true);
        }}
        loading="lazy"
      />
    </div>
  );
};

export default FormationListComponent;
