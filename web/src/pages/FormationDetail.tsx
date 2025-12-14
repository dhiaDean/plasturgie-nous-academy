// FormationDetail.tsx - Enhanced with Practical Sessions

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    Clock, Users, BookOpen, Calendar, MapPin, Star, MessageSquare,
    Image as ImageIcon, User, AlertTriangle, RefreshCw
} from "lucide-react";
import { CourseAPI, PracticalSessionAPI } from "@/services/api.service";
import type { Course, Review, Instructor, CourseModule, PracticalSessionDTO, SimpleInstructorDTO } from "@/services/api.types";
import { API_BASE_URL } from "@/services/api.constants";

import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

// Practical Sessions Hook
const usePracticalSessions = (courseId: number | null) => {
    const [sessions, setSessions] = useState<PracticalSessionDTO[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchSessions = useCallback(async () => {
        if (!courseId) return;

        setLoading(true);
        setError(null);

        try {
            const response = await PracticalSessionAPI.getPracticalSessionsByCourse(courseId);
            setSessions(response.data || []);
        } catch (err: any) {
            console.error("Error fetching practical sessions:", err);
            const errMsg = err?.response?.data?.message || err?.message || "Impossible de charger les sessions pratiques";
            setError(errMsg);
            setSessions([]);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    return { sessions, loading, error, fetchSessions };
};

// Session Card Component
const SessionCard: React.FC<{ session: PracticalSessionDTO }> = ({ session }) => {
    const formatDateTime = (dateTime: string) => {
        try {
            return session.sessionDateTimeFormatted || format(new Date(dateTime), 'PPP p');
        } catch {
            return 'Date invalide';
        }
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-lg line-clamp-2">
                        {session.title || 'Session pratique'}
                    </h4>
                    {session.status && (
                        <Badge
                            variant={session.status.toLowerCase() === 'active' ? 'default' : 'secondary'}
                            className="capitalize ml-2"
                        >
                            {session.status.toLowerCase()}
                        </Badge>
                    )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                    {session.sessionDateTime && (
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-blue-500 flex-shrink-0" />
                            <span>{formatDateTime(session.sessionDateTime)}</span>
                        </div>
                    )}

                    {session.location && (
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-green-500 flex-shrink-0" />
                            <span className="break-words">{session.location}</span>
                        </div>
                    )}

                    {session.durationMinutes != null && (
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-orange-500 flex-shrink-0" />
                            <span>{session.durationMinutes} minutes</span>
                        </div>
                    )}

                    {session.conductingInstructorName && (
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-purple-500 flex-shrink-0" />
                            <span>Formateur: {session.conductingInstructorName}</span>
                        </div>
                    )}
                </div>

                {session.description && (
                    <p className="text-xs text-gray-500 mt-3 line-clamp-3 leading-relaxed border-t pt-3">
                        {session.description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

const FormationDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [course, setCourse] = useState<Course | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEnrolling, setIsEnrolling] = useState<boolean>(false);
    const [imageLoadError, setImageLoadError] = useState<boolean>(false);

    const API_SERVER_ORIGIN = new URL(API_BASE_URL).origin;

    // Get course ID as number for practical sessions
    const courseId = id ? parseInt(id, 10) : null;
    const { sessions, loading: sessionsLoading, error: sessionsError, fetchSessions } = usePracticalSessions(courseId);

    useEffect(() => {
        setCourse(null);
        setReviews([]);
        setError(null);
        setImageLoadError(false);
        setIsLoading(true);

        if (!id) {
            setError("Identifiant de la formation manquant.");
            setIsLoading(false);
            return;
        }

        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
            setError("Identifiant de la formation invalide.");
            setIsLoading(false);
            return;
        }

        const fetchFormationData = async () => {
            try {
                console.log(`Fetching course details for ID: ${numericId}`);
                const courseResponse = await CourseAPI.getById(numericId);
                const fetchedCourseData = courseResponse.data as Course;
                console.log("Course response data:", fetchedCourseData);
                console.log("Course modules data:", fetchedCourseData.modules); // Add this line
                setCourse(fetchedCourseData);

                if (fetchedCourseData.reviews && fetchedCourseData.reviews.length > 0) {
                    setReviews(fetchedCourseData.reviews);
                } else {
                    setReviews([]);
                }
            } catch (err: unknown) {
                console.error("Failed to fetch formation details:", err);
                if (err && typeof err === 'object' && 'response' in err) {
                    const errorResponse = err as { response: { status: number } };
                    if (errorResponse.response && errorResponse.response.status === 404) {
                        setError(`La formation avec l'identifiant ${numericId} n'a pas été trouvée.`);
                    } else {
                        setError("Impossible de charger les détails de la formation. Veuillez réessayer plus tard.");
                    }
                } else {
                    setError("Une erreur inattendue s'est produite. Veuillez réessayer plus tard.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchFormationData();
    }, [id]);

    const handleEnroll = async () => {
        if (!course) return;
        setIsEnrolling(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Enrollment successful (Placeholder)");
            alert("Inscription réussie !");
        } catch (err) {
            console.error("Enrollment failed:", err);
            alert("Échec de l'inscription. Veuillez réessayer.");
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleRequestInfo = () => {
        if (!course) return;
        alert("Demande d'informations envoyée ! Nous vous recontacterons bientôt.");
    };

    const mainInstructor: Instructor | undefined = course?.instructors?.[0];

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-12">
                    <div className="space-y-4 mt-4">
                        <Skeleton className="h-10 w-3/4 mb-4" />
                        <Skeleton className="h-6 w-1/2 mb-6" />
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-2/3 space-y-4">
                                <Skeleton className="h-20 w-full" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-32" />
                                    <Skeleton className="h-12 w-48" />
                                </div>
                            </div>
                            <div className="md:w-1/3 space-y-4">
                                <Skeleton className="h-48 w-full" />
                                <Skeleton className="h-8 w-1/2" />
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-1/4 mt-10" />
                        <Skeleton className="h-32 w-full mt-4" />
                        <Skeleton className="h-32 w-full mt-4" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
                    <Alert variant="destructive" className="max-w-2xl mx-auto">
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                        <Button
                            onClick={() => window.location.reload()}
                            className="mt-4"
                            variant="outline"
                        >
                            Réessayer
                        </Button>
                    </Alert>
                </main>
                <Footer />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
                    <Alert className="max-w-2xl mx-auto">
                        <AlertTitle>Formation introuvable</AlertTitle>
                        <AlertDescription>
                            La formation demandée n'a pas pu être trouvée ou les données sont invalides.
                        </AlertDescription>
                        <Button
                            onClick={() => window.history.back()}
                            className="mt-4"
                            variant="outline"
                        >
                            Retour
                        </Button>
                    </Alert>
                </main>
                <Footer />
            </div>
        );
    }

    const calculatedAverageRating = reviews?.length > 0
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length)
        : (course.rating ?? 0);
    const averageRatingString = calculatedAverageRating > 0 ? calculatedAverageRating.toFixed(1) : 'N/A';
    const reviewCount = reviews?.length > 0 ? reviews.length : (course.reviewCount ?? 0);

    const fullImageUrl = course.imageUrl && !imageLoadError
        ? `${API_SERVER_ORIGIN}${course.imageUrl}`
        : null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Date non disponible';
        try {
            return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch { return 'Date non disponible'; }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white pt-24 pb-10">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                            {/* Left Column */}
                            <div className="lg:w-2/3">
                                <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
                                <p className="text-lg mb-5 text-blue-100">{course.description || "Description non disponible."}</p>
                                {course.instructors && course.instructors.length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-white mb-2">{course.instructors.length === 1 ? 'Instructeur' : 'Instructeurs'}</h2>
                                        <ul className="list-disc list-inside ml-4">
                                            {course.instructors.map((instructor) => (
                                                <li key={`instructor-${instructor.id}`} className="mb-1">
                                                    <span className="font-medium">{instructor.name}</span>
                                                    {instructor.expertise && (<span className="ml-2 text-blue-200">- {instructor.expertise}</span>)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-x-6 gap-y-3 mb-6 text-blue-100">
                                    {course.duration && (<div className="flex items-center text-sm"><Clock className="mr-1.5 h-4 w-4" /><span>{course.duration}</span></div>)}
                                    {course.participants != null && (<div className="flex items-center text-sm"><Users className="mr-1.5 h-4 w-4" /><span>{course.participants} participants inscrits</span></div>)}
                                    {course.level && (<div className="flex items-center text-sm"><BookOpen className="mr-1.5 h-4 w-4" /><span>Niveau: {course.level}</span></div>)}
                                    <div className="flex items-center text-sm"><Star className="mr-1.5 h-4 w-4 text-yellow-300" /><span>{averageRatingString} ({reviewCount} avis)</span></div>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow" onClick={handleEnroll} disabled={isEnrolling}>{isEnrolling ? "Inscription..." : "S'inscrire"}</Button>
                                    <Button size="lg" variant="outline" className="border-white text-blue-600 hover:bg-white/10" onClick={handleRequestInfo}>Demander plus d'informations</Button>
                                </div>
                            </div>

                            {/* Right Column: Image & Summary Card */}
                            <div className="lg:w-1/3 mt-6 lg:mt-0">
                                <Card className="overflow-hidden shadow-lg">
                                    {fullImageUrl ? (
                                        <img
                                            src={fullImageUrl}
                                            alt={course.title}
                                            className="w-full h-48 sm:h-56 object-cover"
                                            onError={() => {
                                                console.warn(`Image failed to load: ${fullImageUrl}. Displaying fallback.`);
                                                setImageLoadError(true);
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white" aria-label="Image de la formation indisponible">
                                            <div className="text-center">
                                                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-80" />
                                                <p className="text-lg font-medium">Image Indisponible</p>
                                            </div>
                                        </div>
                                    )}
                                    <CardContent className="p-5 bg-white text-gray-800">
                                        <div className="space-y-3.5">
                                            {course.price != null && (<div className="flex justify-between items-center border-b pb-3"><span className="font-medium text-gray-600">Prix:</span><span className="text-xl font-bold text-blue-600">{course.price === 0 ? 'Gratuit' : `${course.price} DT`}</span></div>)}
                                            {course.startDate && (<div className="flex items-center text-sm text-gray-600"><Calendar className="mr-2 h-4 w-4 text-gray-400" /><span>Début: {formatDate(course.startDate)}</span></div>)}
                                            {course.location && (<div className="flex items-center text-sm text-gray-600"><MapPin className="mr-2 h-4 w-4 text-gray-400" /><span>{course.location}</span></div>)}
                                            <Button size="lg" className="w-full mt-2" onClick={handleEnroll} disabled={isEnrolling}>{isEnrolling ? "Traitement..." : "Réserver ma place"}</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area with Tabs */}
                <div className="container mx-auto px-4 py-10 sm:py-14">
                    <Tabs defaultValue="programme" className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                            <TabsTrigger value="programme">Programme</TabsTrigger>
                            <TabsTrigger value="sessions">Sessions ({sessions.length})</TabsTrigger>
                            <TabsTrigger value="instructor" disabled={!mainInstructor}>Formateur</TabsTrigger>
                            <TabsTrigger value="reviews">Avis ({reviewCount})</TabsTrigger>
                        </TabsList>





                        <TabsContent value="programme" className="mt-6 space-y-5">
                            <h2 className="text-xl sm:text-2xl font-semibold mb-5 border-b pb-3">Programme de la formation</h2>
                            {/* Use course.modules (which should be Array<ModuleResponseDTO> now) */}
                            {course.modules && course.modules.length > 0 ? (
                                <div className="space-y-5">
                                    {course.modules.map((module, moduleIndex) => (
                                        // Use module.moduleId for the key
                                        <Card key={module.moduleId || `module-${moduleIndex}`} className="overflow-hidden border">
                                            <div className="bg-gray-50 p-3 sm:p-4 border-b">
                                                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                                                    Module {moduleIndex + 1}: {module.title || "Titre du module non disponible"}
                                                </h3>
                                            </div>
                                            <CardContent className="p-4 sm:p-5 text-sm">
                                                {/* Display Module Description */}
                                                {module.description ? (
                                                    <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">{module.description}</p>
                                                ) : (
                                                    <p className="text-gray-500 mb-4 italic">Aucune description pour ce module.</p>
                                                )}

                                                {/* Display Lessons if they exist and are part of your ModuleResponseDTO */}
                                                {module.lessons && module.lessons.length > 0 && (
                                                    <>
                                                        <h4 className="text-md font-semibold text-gray-700 mb-2 mt-3">Leçons :</h4>
                                                        <ul className="space-y-1.5 text-gray-600 list-disc list-inside pl-1">
                                                            {module.lessons.map((lesson, lessonIdx) => (
                                                                <li key={`module-${module.moduleId || moduleIndex}-lesson-${lessonIdx}`}>
                                                                    {lesson}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}
                                                
                                                {/* PDF and Video Links/Buttons - Use hasPdf and hasVideo flags */}
                                                {(module.hasPdf || module.hasVideo) && module.moduleId ? (
                                                    <div className="mt-5 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                                                        {module.hasPdf && module.pdfFilename && ( // Check for filename too
                                                            <a
                                                                href={`${API_BASE_URL}/modules/${module.moduleId}/pdf`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                                title={`Télécharger PDF: ${module.pdfFilename}`}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                                </svg>
                                                                {/* Truncate filename for display */}
                                                                PDF: {module.pdfFilename.length > 20 ? module.pdfFilename.substring(0,17) + '...' : module.pdfFilename }
                                                            </a>
                                                        )}
                                                        {module.hasVideo && module.videoFilename && ( // Check for filename too
                                                            <a
                                                                href={`${API_BASE_URL}/modules/${module.moduleId}/video`}
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                                                title={`Voir Vidéo: ${module.videoFilename}`}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                                                    <path d="M14.553 10.06A1.999 1.999 0 0115 11v2a1.996 1.996 0 01-.447 1.34L18.01 16.93A2.001 2.001 0 0020 15V5a2.002 2.002 0 00-1.99-2.001h-1.388z" />
                                                                </svg>
                                                                Vidéo: {module.videoFilename.length > 20 ? module.videoFilename.substring(0,16) + '...' : module.videoFilename }
                                                            </a>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (<p className="text-gray-500 text-center py-4">Le programme détaillé sera bientôt disponible.</p>)}
                        </TabsContent>



                        <TabsContent value="sessions" className="mt-6 space-y-6">
                            <div className="flex justify-between items-center border-b pb-3">
                                <h2 className="text-xl sm:text-2xl font-semibold">Sessions pratiques</h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchSessions}
                                    disabled={sessionsLoading}
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${sessionsLoading ? 'animate-spin' : ''}`} />
                                    Actualiser
                                </Button>
                            </div>

                            {sessionsLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[...Array(3)].map((_, i) => (
                                        <Card key={i} className="p-4">
                                            <Skeleton className="h-6 w-3/4 mb-3" />
                                            <Skeleton className="h-4 w-full mb-2" />
                                            <Skeleton className="h-4 w-2/3 mb-2" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </Card>
                                    ))}
                                </div>
                            ) : sessionsError ? (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Erreur</AlertTitle>
                                    <AlertDescription>{sessionsError}</AlertDescription>
                                </Alert>
                            ) : sessions.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {sessions.map((session) => (
                                        <SessionCard key={session.id} session={session} />
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-dashed border-2 border-gray-300">
                                    <CardContent className="text-center py-12">
                                        <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                            Aucune session pratique planifiée
                                        </h3>
                                        <p className="text-gray-500">
                                            Les sessions pratiques pour cette formation seront bientôt disponibles.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </TabsContent>

                        {mainInstructor && (
                            <TabsContent value="instructor" className="mt-6">
                                <h2 className="text-xl sm:text-2xl font-semibold mb-5 border-b pb-3">Présentation du Formateur</h2>
                                <div className="p-4 sm:p-6 rounded-md border bg-gray-50">
                                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 bg-blue-500 text-white text-2xl flex-shrink-0">
                                            <AvatarFallback>{mainInstructor.name?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{mainInstructor.name}</h3>
                                            {mainInstructor.title && (<p className="text-blue-700 text-sm font-medium mb-3">{mainInstructor.title}</p>)}
                                            {mainInstructor.bio && (<p className="text-gray-600 text-sm leading-relaxed">{mainInstructor.bio}</p>)}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        )}

                        <TabsContent value="reviews" className="mt-6 space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3 border-b pb-3">
                                <h2 className="text-xl sm:text-2xl font-semibold">Avis des participants</h2>
                                {reviewCount > 0 && (
                                    <div className="flex items-center flex-shrink-0">
                                        <div className="flex mr-2">
                                            {[...Array(5)].map((_, i) => (<Star key={i} className={`h-5 w-5 ${i < Math.round(calculatedAverageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />))}
                                        </div>
                                        <span className="font-semibold text-gray-700">{averageRatingString}/5</span>
                                        <span className="text-sm text-gray-500 ml-2">({reviewCount} avis)</span>
                                    </div>
                                )}
                            </div>
                            {reviews && reviews.length > 0 ? (
                                <div className="space-y-5">
                                    {reviews.map((review) => (
                                        <Card key={review.id} className="p-4 border shadow-sm">
                                            <div className="flex items-center mb-2.5">
                                                <Avatar className="h-9 w-9 mr-3"><AvatarFallback className="bg-gray-200 text-xs">{review.user?.username?.substring(0, 2)?.toUpperCase() || 'P'}</AvatarFallback></Avatar>
                                                <div className="flex-grow">
                                                    <span className="font-semibold text-sm text-gray-800">{review.user?.username || 'Participant Anonyme'}</span>
                                                    <div className="flex mt-0.5">
                                                        {[...Array(5)].map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />))}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{formatDate(review.createdAt)}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed pl-12">{review.comment}</p>
                                        </Card>
                                    ))}
                                </div>
                            ) : (<p className="text-gray-500 text-center py-6">Aucun avis pour cette formation pour le moment.</p>)}
                            <div className="flex justify-center pt-6 border-t mt-8"><Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" />Laisser un avis</Button></div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FormationDetail;
