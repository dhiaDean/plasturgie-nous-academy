
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download, Book, Link } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useIsMobile } from "@/hooks/use-mobile";

const Resources = () => {
  const isMobile = useIsMobile();
  
  const resourceCategories = [
    {
      title: "Documents techniques",
      description: "Fiches techniques, manuels et guides pour l'industrie plastique",
      icon: <FileText className="h-8 w-8 text-tunisiaBlue-500" />,
      resources: [
        { name: "Guide des matériaux plastiques", type: "PDF", size: "2.4 MB" },
        { name: "Manuel d'injection plastique", type: "PDF", size: "3.8 MB" },
        { name: "Glossaire technique", type: "PDF", size: "1.2 MB" },
      ]
    },
    {
      title: "Vidéos pédagogiques",
      description: "Tutoriels et démonstrations vidéo pour améliorer vos compétences",
      icon: <Video className="h-8 w-8 text-tunisiaBlue-500" />,
      resources: [
        { name: "Introduction à l'extrusion", type: "Vidéo", duration: "18 min" },
        { name: "Techniques avancées de moulage", type: "Vidéo", duration: "25 min" },
        { name: "Maintenance préventive des équipements", type: "Vidéo", duration: "22 min" },
      ]
    },
    {
      title: "Modèles et templates",
      description: "Documents prêts à l'emploi pour vos projets industriels",
      icon: <Download className="h-8 w-8 text-tunisiaBlue-500" />,
      resources: [
        { name: "Plan d'assurance qualité", type: "DOCX", size: "0.8 MB" },
        { name: "Checklist de contrôle qualité", type: "XLSX", size: "0.5 MB" },
        { name: "Modèle de rapport technique", type: "DOCX", size: "1.1 MB" },
      ]
    },
    {
      title: "Bibliothèque d'études",
      description: "Études de cas et recherches dans le domaine de la plasturgie",
      icon: <Book className="h-8 w-8 text-tunisiaBlue-500" />,
      resources: [
        { name: "Innovation en plasturgie durable", type: "Étude", year: "2023" },
        { name: "Tendances du marché tunisien", type: "Rapport", year: "2022" },
        { name: "Analyse comparative des techniques d'injection", type: "Étude", year: "2021" },
      ]
    },
    {
      title: "Liens utiles",
      description: "Ressources externes et partenaires recommandés",
      icon: <Link className="h-8 w-8 text-tunisiaBlue-500" />,
      resources: [
        { name: "Association Tunisienne de Plasturgie", type: "Site web" },
        { name: "Portail des normes industrielles", type: "Site web" },
        { name: "Forum international des professionnels", type: "Forum" },
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Ressources Pédagogiques</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Accédez à notre bibliothèque de ressources pour approfondir vos connaissances dans les domaines de la plasturgie et de l'industrie technique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourceCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-${isMobile ? 'start' : 'center'} gap-4 pb-2`}>
                  <div className={`${isMobile ? 'mb-2' : ''}`}>
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription className="mt-1">{category.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.resources.map((resource, resIndex) => (
                      <li key={resIndex} className="flex justify-between items-center border-b pb-2">
                        <div className="flex-1 mr-2">
                          <p className="font-medium text-sm md:text-base">{resource.name}</p>
                          <p className="text-xs md:text-sm text-gray-500">
                            {resource.type} {resource.size && `• ${resource.size}`}
                            {resource.duration && `• ${resource.duration}`}
                            {resource.year && `• ${resource.year}`}
                          </p>
                        </div>
                        <Button variant="outline" size={isMobile ? "sm" : "default"} className="whitespace-nowrap">
                          <Download className="h-4 w-4 mr-1" />
                          {isMobile ? "Voir" : "Accéder"}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 bg-tunisiaBlue-50 rounded-lg p-4 md:p-8 text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Vous ne trouvez pas ce que vous cherchez?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-sm md:text-base">
              Notre équipe peut vous fournir des ressources personnalisées adaptées à vos besoins spécifiques.
            </p>
            <Button size={isMobile ? "default" : "lg"} className="bg-tunisiaBlue-600 hover:bg-tunisiaBlue-700">
              Nous contacter
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
