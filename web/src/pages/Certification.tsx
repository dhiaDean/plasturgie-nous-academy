// src/pages/CertificationPage.tsx
"use client"; // If using Next.js App Router

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Award, Download, Share2, Calendar, CheckCircle, Clock, XCircle,
  Shield, ExternalLink, Search, BookOpen, User, Building
} from 'lucide-react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CertificationAPI } from '@/services/api.service';
import type { Certification } from '@/services/api.types'; // Ensure this type is correct
import { useToast } from '@/hooks/use-toast';

// Mock data (ensure it matches the Certification type accurately)
const mockCertificationsData: Certification[] = [
  {
    certificationId: 1,
    certificateCode: "CERT-2024-001-TK9",
    course: {
      courseId: 101,
      title: "Advanced React Development",
      category: "Technology",
      duration: "40 hours", // Make sure your Certification type's course.duration matches this
      level: "Advanced"
    },
    user: {
      userId: 201,
      username: "ahmedb",
      firstName: "Ahmed",
      lastName: "Balti",
    },
    issueDate: "2024-03-15T10:30:00",
    expiryDate: "2026-03-15T10:30:00",
    status: "active",
    createdAt: "2024-03-15T10:30:00"
  },
  // ... other mock certifications
];

const CertificationPage = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [filteredCertifications, setFilteredCertifications] = useState<Certification[]>([]);
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('grid');

  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchCertifications = async () => {
      if (!isMounted) return;
      setIsLoading(true);

      try {
        console.log('[Certification] Attempting to fetch certifications...');
        const response = await CertificationAPI.getMyCertifications();

        // --- DETAILED LOGGING ---
        console.log('[Certification] Raw API Response (Full Axios Response Object):', response);
        if (response) {
            console.log('[Certification] Type of response.data:', typeof response.data);
        }
        // --- END DETAILED LOGGING ---

        if (!isMounted) return;

        let certificationsArray: Certification[] = [];

        if (response && typeof response.data !== 'undefined' && response.data !== null) {
            // Log the actual data for inspection, no matter its type initially
            try {
              console.log('[Certification] Content of response.data (raw):', response.data);
              console.log('[Certification] Content of response.data (stringified):', JSON.stringify(response.data, null, 2));
            } catch (stringifyError) {
              console.error('[Certification] Error stringifying response.data:', stringifyError);
            }


          if (typeof response.data === 'string') {
            console.log('[Certification] response.data is a string, attempting JSON.parse...');
            try {
              const parsedData = JSON.parse(response.data);
              if (Array.isArray(parsedData)) {
                console.log('[Certification] Parsed string to array. Count:', parsedData.length);
                certificationsArray = parsedData as Certification[];
              } else {
                console.warn('[Certification] Parsed data from string is not an array:', parsedData);
              }
            } catch (e) {
              console.error('[Certification] Failed to parse response.data string:', e, "Data was:", response.data);
            }
          } else if (Array.isArray(response.data)) {
            console.log('[Certification] response.data IS an array. Count:', response.data.length);
            certificationsArray = response.data as Certification[];
          } else if (typeof response.data === 'object') { // Already checked for null above
            console.warn('[Certification] response.data IS an object but NOT an array. Inspect its structure.');
            // Check for common wrapper patterns (e.g., Spring Data Page)
            if (response.data.content && Array.isArray(response.data.content)) {
                console.log('[Certification] Found array in response.data.content. Count:', response.data.content.length);
                certificationsArray = response.data.content as Certification[];
            } else if (response.data.results && Array.isArray(response.data.results)) {
                console.log('[Certification] Found array in response.data.results. Count:', response.data.results.length);
                certificationsArray = response.data.results as Certification[];
            }
            // Add more checks here if your API uses a different wrapper key
            // else if (response.data.yourCustomKey && Array.isArray(response.data.yourCustomKey)) {
            //     console.log('[Certification] Found array in response.data.yourCustomKey');
            //     certificationsArray = response.data.yourCustomKey as Certification[];
            // }
            else {
                console.warn('[Certification] Could not find a known array structure (like "content" or "results") within the response.data object. Top-level keys present:', Object.keys(response.data));
            }
          } else {
            console.warn('[Certification] response.data is not a string, array, or a non-null object. Type:', typeof response.data, 'Value:', response.data);
          }
        } else {
          console.warn('[Certification] API response object or response.data itself is missing, null, or undefined.');
          if (response) {
              console.log('[Certification] Response status:', response.status);
              console.log('[Certification] response.data actual value:', response.data);
          }
        }

        console.log('[Certification] Final Processed certifications:', certificationsArray);
        setCertifications(certificationsArray);

      } catch (error: any) { // Added :any to inspect AxiosError properties
        if (!isMounted) return;

        console.error("[Certification] Error fetching certifications:", error);
        // Check if error is an Axios error to potentially log more details
        if (error.isAxiosError) {
            console.error("[Certification] Axios error details:", error.toJSON ? error.toJSON() : error);
            if (error.response) {
                console.error("[Certification] Axios error response data:", error.response.data);
                console.error("[Certification] Axios error response status:", error.response.status);
            }
        }
        if (typeof toast === 'function') {
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger vos certifications. Affichage des données de démonstration.",
            variant: "destructive"
          });
        }
        setCertifications(mockCertificationsData); // Fallback to mock data
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCertifications();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  useEffect(() => {
    let filtered = (certifications || []).filter(cert => cert && cert.certificationId != null);

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(cert => {
        const courseTitle = cert.course?.title?.toLowerCase() || '';
        const certificateCode = cert.certificateCode?.toLowerCase() || '';
        const courseCategory = cert.course?.category?.toLowerCase() || '';

        return courseTitle.includes(lowerSearchTerm) ||
          certificateCode.includes(lowerSearchTerm) ||
          courseCategory.includes(lowerSearchTerm);
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(cert => cert.status === statusFilter);
    }

    setFilteredCertifications(filtered);
  }, [searchTerm, statusFilter, certifications]);

  const getStatusColor = (status?: Certification['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'revoked': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status?: Certification['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'expired': return <Clock className="h-4 w-4" />;
      case 'revoked': return <XCircle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Date Invalide";
    }
  };

  const handleDownload = useCallback((certification: Certification) => {
    if (typeof toast === 'function') {
      toast({
        title: "Fonctionnalité à implémenter",
        description: `Téléchargement de ${certification.certificateCode}`
      });
    }
  }, [toast]);

  const handleShare = useCallback((certification: Certification) => {
    if (typeof toast === 'function') {
      toast({
        title: "Fonctionnalité à implémenter",
        description: `Partage de ${certification.certificateCode}`
      });
    }
  }, [toast]);

  const handleVerify = useCallback((certification: Certification) => {
    if (typeof toast === 'function') {
      toast({
        title: "Fonctionnalité à implémenter",
        description: `Vérification de ${certification.certificateCode}`
      });
    }
  }, [toast]);

  const handleViewDetails = useCallback((certification: Certification) => {
    setSelectedCertification(certification);
    setActiveTab('detailed');
  }, []);

  const CertificateCard: React.FC<{ certification: Certification, isDetailed?: boolean }> = React.memo(({ certification, isDetailed = false }) => {
    // Ensure certification and its nested properties exist before trying to access them
    const courseTitle = certification.course?.title || 'Titre du cours indisponible';
    const courseCategory = certification.course?.category || 'N/A';
    const courseLevel = certification.course?.level || 'N/A';
    const courseDuration = certification.course?.duration || 'N/A'; // Match your type definition

    const userName = (certification.user?.firstName && certification.user?.lastName)
      ? `${certification.user.firstName} ${certification.user.lastName}`
      : certification.user?.username || 'Utilisateur inconnu';

    return (
      <Card className={`overflow-hidden transition-all duration-300 ${isDetailed ? 'border-2 border-blue-500' : 'hover:shadow-lg border'}`}>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{courseTitle}</h3>
                <p className="text-blue-100 text-sm">{courseCategory}</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(certification.status)} border`}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(certification.status)}
                <span className="capitalize">{certification.status || 'N/A'}</span>
              </div>
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>Code: {certification.certificateCode || 'N/A'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>{userName}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {/* Example: Handle if duration is number vs string based on your actual type */}
                  <span>{courseLevel} • {typeof courseDuration === 'number' ? `${courseDuration} heures` : courseDuration}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Émis le: {formatDate(certification.issueDate)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Expire le: {formatDate(certification.expiryDate)}</span>
                </div>
              </div>
            </div>

            {isDetailed && (
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-2">Détails de la certification</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Cette certification atteste que {userName} a complété avec succès
                  la formation "{courseTitle}" d'un niveau {courseLevel}
                  pour une durée totale de {courseDuration}.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">
                    Certificat émis le {formatDate(certification.createdAt)} par la plateforme de formation professionnelle.
                    Code de vérification: {certification.certificateCode}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <Button
                size="sm"
                onClick={() => handleDownload(certification)}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Télécharger</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare(certification)}
                className="flex items-center space-x-1"
              >
                <Share2 className="h-4 w-4" />
                <span>Partager</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleVerify(certification)}
                className="flex items-center space-x-1"
              >
                <Shield className="h-4 w-4" />
                <span>Vérifier</span>
              </Button>
              {!isDetailed && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewDetails(certification)}
                  className="flex items-center space-x-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Voir détails</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  });
  CertificateCard.displayName = 'CertificateCard';

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-gray-50 pt-16 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Chargement des certifications...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const validCertifications = (certifications || []).filter(c => c && c.certificationId != null);
  const activeCertificationsCount = validCertifications.filter(c => c.status === 'active').length;
  const totalCertificationsCount = validCertifications.length;
  const expertiseDomainsCount = new Set(
    validCertifications
      .map(c => c.course?.category)
      .filter(Boolean)
  ).size;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 pt-20 md:pt-24">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mes Certifications</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Gérez et partagez vos certificats professionnels</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {filteredCertifications.length} certificat{filteredCertifications.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <TabsList className="grid w-full md:w-auto grid-cols-2">
                <TabsTrigger value="grid">Vue Grille</TabsTrigger>
                <TabsTrigger value="detailed">Vue Détaillée</TabsTrigger>
              </TabsList>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="expired">Expiré</option>
                  <option value="revoked">Révoqué</option>
                </select>
              </div>
            </div>

            <TabsContent value="grid" className="space-y-6">
              {filteredCertifications.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    {isLoading ? "Chargement..." : "Aucune certification ne correspond à vos critères ou vous n'avez pas encore de certifications."}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredCertifications.map((certification) => (
                    <CertificateCard
                      key={certification.certificationId}
                      certification={certification}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              {selectedCertification ? (
                <div className="space-y-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCertification(null);
                      setActiveTab('grid');
                    }}
                    className="mb-4"
                  >
                    ← Retour à la liste
                  </Button>
                  <CertificateCard certification={selectedCertification} isDetailed={true} />
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    Sélectionnez une certification depuis la vue grille pour voir ses détails.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{activeCertificationsCount}</h3>
                <p className="text-gray-600">Certifications Actives</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{totalCertificationsCount}</h3>
                <p className="text-gray-600">Total Certifications</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
                  <Building className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{expertiseDomainsCount}</h3>
                <p className="text-gray-600">Domaines d'Expertise</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CertificationPage;