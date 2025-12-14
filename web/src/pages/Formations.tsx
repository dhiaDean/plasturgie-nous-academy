// Formations.tsx

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, ArrowRight, Search, Image as ImageIcon, DollarSign, 
  Star, Users, MapPin, CalendarDays, BarChart3, ListChecks, UserCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { DisplayFormation, SimpleInstructor, SimpleModule } from "@/services/api.types";
import { CourseAPI } from "@/services/api.service";
import { API_BASE_URL } from "@/services/api.constants"; // Import API_BASE_URL

const categories = ["Tous", "Plasturgie", "Technique", "Gestion"];
const levels = ["Tous", "Débutant", "Intermédiaire", "Avancé"];

const Formations = () => {
  console.log("Formations component rendering - TOP LEVEL");

  const [formations, setFormations] = useState<DisplayFormation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedLevel, setSelectedLevel] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Construct the server origin URL for images.
  // API_BASE_URL is like "http://localhost:5000/api"
  // We need "http://localhost:5000" for prepending to image paths like "/api/courses/1/image"
  const API_SERVER_ORIGIN = new URL(API_BASE_URL).origin;

  useEffect(() => {
    console.log("useEffect triggered to fetch formations");
    setIsLoading(true);
    setError(null);

    CourseAPI.getAll()
      .then(res => {
        console.log("API Response Received in .then():", res);

        if (!res || typeof res.data === 'undefined') {
          console.error("API response or res.data is undefined/null.");
          setError("Réponse invalide du serveur. Aucune donnée reçue.");
          setFormations([]);
          setIsLoading(false); 
          return;
        }

        let rawFormationsArray: any[] = [];
        if (Array.isArray(res.data)) {
          rawFormationsArray = res.data;
        } else if (res.data && Array.isArray(res.data.content)) { 
          rawFormationsArray = res.data.content;
        } else if (res.data && Array.isArray(res.data.data)) { 
          rawFormationsArray = res.data.data;
        } else {
          console.warn("API response data is not a direct array or in a known wrapped structure. Content:", res.data);
          setError("Format de données des formations inattendu.");
          setFormations([]);
          setIsLoading(false); 
          return;
        }
        
        console.log("Raw formations array extracted from API response:", rawFormationsArray);
        if (rawFormationsArray.length > 0) {
            console.log("Structure of the FIRST raw formation item from API:", JSON.stringify(rawFormationsArray[0], null, 2));
        }

        if (rawFormationsArray.length === 0) {
            console.log("API returned an empty list of formations.");
        }

        const processedFormations: DisplayFormation[] = rawFormationsArray
          .map((item: any, index: number) => {
            console.log(`Processing item at index ${index}:`, JSON.stringify(item, null, 2));

            const courseId = item.courseId !== undefined && item.courseId !== null ? Number(item.courseId) : undefined;
            const title = typeof item.title === 'string' ? item.title : undefined;
            
            console.log(`Item ${index} - Extracted courseId: ${courseId}, Extracted title: ${title}`);

            if (courseId === undefined || title === undefined) {
              console.warn(`Item at index ${index} is being filtered out due to missing or invalid courseId or title. Original item:`, JSON.stringify(item, null, 2));
              return null; 
            }

            // FIX 1: Map 'imageUrl' from backend to 'image' field in DisplayFormation
            // Also, ensure empty strings become undefined.
            const imagePathFromServer = (typeof item.imageUrl === 'string' && item.imageUrl.trim() !== "") 
                                      ? item.imageUrl 
                                      : undefined;

            const level = typeof item.level === 'string' ? item.level : undefined;
            const startDate = typeof item.startDate === 'string' ? item.startDate : undefined;
            const duration = typeof item.duration === 'string' ? item.duration : undefined;
            const rating = item.rating !== undefined && item.rating !== null ? Number(item.rating) : undefined;
            const reviewCount = item.reviewCount !== undefined && item.reviewCount !== null ? Number(item.reviewCount) : undefined;
            const participants = item.participants !== undefined && item.participants !== null ? Number(item.participants) : undefined;
            const location = typeof item.location === 'string' ? item.location : undefined;
            
            const modules: SimpleModule[] | undefined = Array.isArray(item.modules) 
              ? item.modules.map((m: any) => ({ title: m.title || "Module sans titre" })) 
              : undefined;
            
            // FIX 3: Correctly map instructor data from backend's SimpleInstructorDTO to frontend's SimpleInstructor
            const mappedInstructors: SimpleInstructor[] | undefined = Array.isArray(item.instructors) 
              ? item.instructors.map((i: any) => ({ 
                  id: i.instructorId, // Backend DTO uses 'instructorId'
                  name: i.fullName || "Instructeur inconnu" // Backend DTO uses 'fullName'
                })) 
              : undefined;

            return {
              courseId: courseId,
              title: title,
              category: typeof item.category === 'string' ? item.category : "Non classé",
              mode: item.mode ? String(item.mode) : "N/A",
              price: item.price !== undefined && item.price !== null ? Number(item.price) : 0,
              createdAt: item.createdAt ? String(item.createdAt) : new Date().toISOString(),
              firstInstructorName: typeof item.firstInstructorName === 'string' && item.firstInstructorName.trim() !== "" ? item.firstInstructorName : "Instructeur N/A",
              firstInstructorId: item.firstInstructorId !== undefined && item.firstInstructorId !== null ? Number(item.firstInstructorId) : undefined,
              
              image: imagePathFromServer, // Assign the correctly mapped image path
              level,
              startDate,
              duration,
              rating,
              reviewCount,
              participants,
              location,
              modules,
              instructors: mappedInstructors, // Assign the correctly mapped instructors
            };
          })
          .filter(f => f !== null) as DisplayFormation[]; 

        if (rawFormationsArray.length > 0 && processedFormations.length < rawFormationsArray.length) {
            console.warn("Some raw formation items were filtered out due to missing/invalid essential data (courseId, title).");
        }

        console.log("Processed and validated formations data to set:", processedFormations);
        if (processedFormations.length > 0) {
            console.log("Structure of the first processed formation item:", processedFormations[0]);
        }
        setFormations(processedFormations);

      })
      .catch(err => {
        console.error("Error fetching formations (in .catch()):", err);
        let errorMessage = "Échec de la récupération des formations.";
        // ... (error message construction as before)
        setError(errorMessage);
        setFormations([]);
      })
      .finally(() => {
        console.log("useEffect .finally() reached, setting isLoading to false.");
        setIsLoading(false);
      });
  }, [API_SERVER_ORIGIN]); // Added API_SERVER_ORIGIN to dependency array, though it's stable.

  console.log("Formations component - Before filtering. isLoading:", isLoading, "Error:", error, "Formations count from state:", formations.length);

  const filteredFormations = formations.filter(formation => {
    if (!formation || typeof formation.courseId === 'undefined' || typeof formation.title === 'undefined') {
        console.warn("Filtering out an invalid formation object from state:", formation);
        return false; 
    }
    const categoryMatch = selectedCategory === "Tous" || (typeof formation.category === 'string' && formation.category === selectedCategory);
    const levelMatch = selectedLevel === "Tous" || (typeof formation.level === 'string' && formation.level === selectedLevel);
    const titleMatch = typeof formation.title === 'string' && formation.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && levelMatch && titleMatch;
  });

  console.log("Formations component - After filtering. Filtered count:", filteredFormations.length, "Selected Category:", selectedCategory, "Selected Level:", selectedLevel, "Search Term:", searchTerm);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto"></div>
            <p className="text-lg text-gray-600">Chargement des formations...</p>
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
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Erreur</h2>
            <p className="text-red-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">Réessayer</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  console.log("RENDERING MAIN CONTENT. Filtered formations count:", filteredFormations.length);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="bg-tunisiaBlue-800 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Nos Formations</h1>
            <p className="text-lg text-tunisiaBlue-100 max-w-2xl mx-auto">
              Découvrez notre catalogue complet de formations conçues pour booster vos compétences et votre carrière.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                type="search"
                    placeholder="Rechercher une formation..." 
                className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                  <select 
              className="p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-tunisiaBlue-500 focus:border-tunisiaBlue-500 w-full md:w-auto"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
              {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select 
              className="p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-tunisiaBlue-500 focus:border-tunisiaBlue-500 w-full md:w-auto"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
              {levels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {filteredFormations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFormations.map((formation) => { 
                const cardKey = formation.courseId; 

                const formattedStartDate = formation.startDate 
                  ? new Date(formation.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) 
                  : null;

                return (
                <Card 
                    key={cardKey}
                    className={`overflow-hidden transition-all duration-300 h-full flex flex-col ${
                      hoveredCard === formation.courseId ? "shadow-xl scale-[1.02]" : "shadow-md"
                    }`}
                    onMouseEnter={() => setHoveredCard(formation.courseId)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {/* FIX 2: Construct full image URL using API_SERVER_ORIGIN */}
                      {formation.image ? (
                        <img
                          src={`${API_SERVER_ORIGIN}${formation.image}`}
                          alt={formation.title || 'Image de la formation'}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon size={48} />
                          <span className="ml-2 text-xs">Image Indisponible</span>
                        </div>
                      )}
                      {formation.category && formation.category !== "Non classé" && (
                        <Badge className="absolute top-2 right-2 bg-tunisiaTeal-500 text-white">{formation.category}</Badge>
                      )}
                      {formation.level && (
                        <Badge variant="secondary" className="absolute top-2 left-2">{formation.level}</Badge>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-bold mb-2 text-tunisiaBlue-800 min-h-[2.5em] line-clamp-2">
                        {formation.title || "Titre Indisponible"}
                      </h2>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 text-xs items-center">
                        {formation.price !== undefined && ( 
                          <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded font-semibold text-tunisiaBlue-700">
                            <DollarSign className="h-3 w-3 mr-1.5 text-tunisiaGreen-500" />
                            {formation.price === 0 ? 'Gratuit' : `${formation.price} TND`}
                          </span>
                        )}
                        {formation.mode && formation.mode !== "N/A" && (
                          <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded">
                            <MapPin className="h-3 w-3 mr-1.5 text-tunisiaBlue-500" /> {formation.mode}
                          </span>
                        )}
                    </div>

                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3 text-xs text-gray-600">
                        {formation.duration && (
                          <span className="inline-flex items-center">
                            <Clock className="h-3 w-3 mr-1.5 text-tunisiaOrange-500" /> {formation.duration}
                          </span>
                        )}
                        {formattedStartDate && (
                           <span className="inline-flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1.5 text-tunisiaOrange-500" /> {formattedStartDate}
                          </span>
                        )}
                         {formation.location && formation.mode !== "Online" && formation.mode !== "À distance" && (
                           <span className="inline-flex items-center col-span-2">
                            <MapPin className="h-3 w-3 mr-1.5 text-tunisiaOrange-500" /> {formation.location}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs text-gray-600">
                        {formation.rating !== undefined && formation.reviewCount !== undefined && (
                          <span className="inline-flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-500 fill-yellow-400" /> 
                            {formation.rating.toFixed(1)} ({formation.reviewCount} {formation.reviewCount > 1 ? 'avis' : 'avis'})
                          </span>
                        )}
                        {formation.participants !== undefined && (
                          <span className="inline-flex items-center">
                            <Users className="h-3 w-3 mr-1.5 text-tunisiaBlue-500" /> {formation.participants} participants
                          </span>
                        )}
                      </div>

                      {formation.modules && formation.modules.length > 0 && (
                        <div className="mb-3 text-xs text-gray-600">
                          <span className="inline-flex items-center font-medium">
                            <ListChecks className="h-3.5 w-3.5 mr-1.5 text-tunisiaTeal-600"/>
                            {formation.modules.length} Module{formation.modules.length > 1 ? 's' : ''} Inclus
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-grow"></div>

                      {formation.firstInstructorName && formation.firstInstructorName !== "Instructeur N/A" && (
                        <div className="mt-auto pt-2 text-sm text-gray-700">
                            Par: {' '}
                            {formation.firstInstructorId ? (
                              <a href={`/instructors/${formation.firstInstructorId}`} className="font-medium text-tunisiaBlue-600 hover:text-tunisiaTeal-600 hover:underline">
                                {formation.firstInstructorName}
                              </a>
                            ) : (
                              <span className="font-medium text-tunisiaBlue-700">{formation.firstInstructorName}</span>
                            )}
                            {/* Displaying count of other instructors (uses the corrected formation.instructors mapping) */}
                            {formation.instructors && formation.instructors.length > 1 && (
                                <span className="text-xs text-gray-500"> (+{formation.instructors.length - 1} autre{formation.instructors.length - 1 > 1 ? 's' : ''})</span>
                            )}
                    </div>
                      )}
                      
                      <Button asChild className="mt-4 w-full bg-tunisiaBlue-600 hover:bg-tunisiaTeal-500 text-white">
                        <a href={`/courses/${formation.courseId}`}>
                          Voir les détails <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </Card>
                );
              })
            }
                  </div>
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10 flex flex-col items-center">
              <Search size={48} className="mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Aucune formation trouvée</h3>
              <p>Essayez d'ajuster vos filtres de recherche ou revenez plus tard.</p>
              </div>
            )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Formations;