
import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ArrowRight, Bookmark, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Sample data for formations (same as in FormationsSection)
const formationsData = [
  {
    id: 1,
    title: "Techniques d'injection plastique",
    duration: "35 heures",
    category: "Plasturgie",
    level: "Intermédiaire",
    participants: "8-12",
    image: "https://images.unsplash.com/photo-1611106434399-3559686cf431?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
    description: "Maîtrisez les techniques d'injection plastique et optimisez votre production industrielle.",
  },
  {
    id: 2,
    title: "Extrusion et soufflage",
    duration: "28 heures",
    category: "Plasturgie",
    level: "Avancé",
    participants: "6-10",
    image: "https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    description: "Apprenez les procédés d'extrusion et de soufflage pour la fabrication de produits plastiques.",
  },
  {
    id: 3,
    title: "Maintenance industrielle",
    duration: "42 heures",
    category: "Technique",
    level: "Débutant",
    participants: "10-15",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
    description: "Formation complète sur la maintenance préventive et corrective des équipements industriels.",
  },
  {
    id: 4,
    title: "Gestion de la qualité",
    duration: "21 heures",
    category: "Gestion",
    level: "Intermédiaire",
    participants: "8-12",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
    description: "Implémentez un système de gestion de la qualité efficace dans votre entreprise.",
  },
  {
    id: 5,
    title: "Conception de moules",
    duration: "35 heures",
    category: "Plasturgie",
    level: "Avancé",
    participants: "6-10",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
    description: "Maîtrisez la conception et l'optimisation des moules pour l'injection plastique.",
  },
  {
    id: 6,
    title: "Sécurité en milieu industriel",
    duration: "14 heures",
    category: "Technique",
    level: "Débutant",
    participants: "12-18",
    image: "https://images.unsplash.com/photo-1581094482940-4dcb2666511f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
    description: "Prévention des risques et gestion de la sécurité dans les environnements industriels.",
  },
];

// Valid categories
const validCategories = ["plasturgie", "technique", "gestion"];

const FormationsByCategory = () => {
  const { category } = useParams<{ category: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  // Check if the category is valid
  if (!category || !validCategories.includes(category)) {
    return <Navigate to="/formations" replace />;
  }
  
  // Format the category name for display
  const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  // Filter formations by category
  const filteredFormations = formationsData
    .filter(formation => formation.category.toLowerCase() === category)
    .filter(formation => 
      formation.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      formation.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Header */}
        <div className="bg-tunisiaBlue-800 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Formations {formattedCategory}</h1>
            <p className="text-tunisiaBlue-100 max-w-2xl">
              Découvrez nos formations spécialisées dans le domaine de {category}.
            </p>
          </div>
        </div>
        
        {/* Search */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Rechercher une formation..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Formations Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFormations.length > 0 ? (
              filteredFormations.map((formation) => (
                <Card 
                  key={formation.id}
                  className={`overflow-hidden transition-all duration-300 h-full ${
                    hoveredCard === formation.id ? "shadow-xl scale-[1.02]" : "shadow-md"
                  }`}
                  onMouseEnter={() => setHoveredCard(formation.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={formation.image} 
                      alt={formation.title}
                      className="object-cover w-full h-full transition-transform duration-500 ease-in-out hover:scale-110"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-tunisiaTeal-500">{formation.category}</Badge>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-tunisiaBlue-800 mb-2 hover:text-tunisiaBlue-600 transition-colors">
                        {formation.title}
                      </h3>
                      <Bookmark className="text-tunisiaBlue-300 hover:text-tunisiaBlue-500 cursor-pointer transition-colors" size={20} />
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {formation.description}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-5">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-tunisiaBlue-500" />
                        {formation.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-tunisiaBlue-500" />
                        {formation.participants}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="bg-gray-50">
                        {formation.level}
                      </Badge>
                      <Button variant="link" className="text-tunisiaBlue-600 p-0 font-semibold">
                        Voir plus <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 py-12 text-center">
                <p className="text-gray-600 text-lg">Aucune formation ne correspond à votre recherche.</p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-tunisiaBlue-500 text-tunisiaBlue-600 hover:bg-tunisiaBlue-50"
                  onClick={() => setSearchTerm('')}
                >
                  Réinitialiser la recherche
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default FormationsByCategory;
