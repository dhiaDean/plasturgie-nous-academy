
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Quote, MessageSquare } from "lucide-react";

const Testimonials = () => {
  // Mock data for testimonials
  const testimonials = [
    {
      id: 1,
      name: "Mohamed Ben Ali",
      position: "Technicien en plasturgie, Plastec Tunisia",
      image: null,
      category: "plasturgie",
      rating: 5,
      testimonial: "La formation sur les techniques d'injection plastique a été très complète et pratique. Les formateurs sont de vrais experts du domaine qui partagent leur expérience concrète. J'ai pu mettre en pratique les connaissances acquises dès mon retour en entreprise, ce qui a permis d'améliorer significativement notre productivité."
    },
    {
      id: 2,
      name: "Leila Bouazizi",
      position: "Responsable qualité, Automotive Components",
      image: null,
      category: "technique",
      rating: 5,
      testimonial: "J'ai suivi la formation sur la gestion de la qualité et je ne peux que la recommander. Le contenu est parfaitement adapté aux réalités industrielles tunisiennes tout en intégrant les standards internationaux. La méthodologie d'enseignement favorise l'apprentissage pratique et les échanges entre participants."
    },
    {
      id: 3,
      name: "Karim Hadjeri",
      position: "Chef d'atelier, PlastiMed",
      image: null,
      category: "plasturgie",
      rating: 4,
      testimonial: "Formation très enrichissante sur les moules d'injection. J'apprécie particulièrement l'équilibre entre théorie et pratique, ainsi que la qualité des équipements mis à disposition. Les études de cas réels nous ont permis de mieux comprendre les problématiques quotidiennes et de développer des solutions efficaces."
    },
    {
      id: 4,
      name: "Sonia Maaloul",
      position: "Directrice des opérations, Tuniplast",
      image: null,
      category: "gestion",
      rating: 5,
      testimonial: "J'ai envoyé plusieurs de mes équipes suivre différentes formations chez Tunisia Formation et les résultats sont remarquables. L'amélioration des compétences techniques et managériales a eu un impact direct sur notre performance. Le suivi post-formation proposé est également un vrai plus qui nous aide à consolider les acquis."
    },
    {
      id: 5,
      name: "Ahmed Khaled",
      position: "Ingénieur maintenance, Alpha Industries",
      image: null,
      category: "technique",
      rating: 4,
      testimonial: "La formation en maintenance industrielle a été très bénéfique pour moi et mon équipe. Les formateurs ont une grande expertise et sont très pédagogues. J'ai particulièrement apprécié les sessions pratiques de diagnostic et résolution de pannes sur des équipements similaires à ceux que nous utilisons au quotidien."
    },
    {
      id: 6,
      name: "Nadia Trabelsi",
      position: "Directrice RH, Groupe Plastika",
      image: null,
      category: "gestion",
      rating: 5,
      testimonial: "Tunisia Formation est devenu notre partenaire privilégié pour le développement des compétences de nos collaborateurs. Leur capacité à adapter les programmes selon nos besoins spécifiques et la qualité de leurs intervenants font toute la différence. Nous constatons une réelle progression dans la performance de nos équipes."
    }
  ];

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-tunisiaBlue-600 to-tunisiaTeal-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <Quote className="h-16 w-16 mx-auto mb-6 opacity-50" />
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Ce que nos clients disent de nous</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Découvrez les témoignages de professionnels qui ont suivi nos formations et amélioré leurs compétences.
            </p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mx-auto flex justify-center">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="plasturgie">Plasturgie</TabsTrigger>
              <TabsTrigger value="technique">Technique</TabsTrigger>
              <TabsTrigger value="gestion">Gestion</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="overflow-hidden h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex-grow">
                        <div className="flex mb-4">
                          {renderStars(testimonial.rating)}
                        </div>
                        <blockquote className="text-gray-700 mb-6 italic">
                          "{testimonial.testimonial}"
                        </blockquote>
                      </div>
                      <div className="flex items-center mt-4">
                        <Avatar className="h-12 w-12 mr-4">
                          {testimonial.image ? (
                            <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          ) : (
                            <AvatarFallback className="bg-tunisiaBlue-100 text-tunisiaBlue-800">
                              {getInitials(testimonial.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-sm text-gray-500">{testimonial.position}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="plasturgie" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials
                  .filter(testimonial => testimonial.category === "plasturgie")
                  .map((testimonial) => (
                    <Card key={testimonial.id} className="overflow-hidden h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex-grow">
                          <div className="flex mb-4">
                            {renderStars(testimonial.rating)}
                          </div>
                          <blockquote className="text-gray-700 mb-6 italic">
                            "{testimonial.testimonial}"
                          </blockquote>
                        </div>
                        <div className="flex items-center mt-4">
                          <Avatar className="h-12 w-12 mr-4">
                            {testimonial.image ? (
                              <AvatarImage src={testimonial.image} alt={testimonial.name} />
                            ) : (
                              <AvatarFallback className="bg-tunisiaBlue-100 text-tunisiaBlue-800">
                                {getInitials(testimonial.name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{testimonial.name}</h3>
                            <p className="text-sm text-gray-500">{testimonial.position}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="technique" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials
                  .filter(testimonial => testimonial.category === "technique")
                  .map((testimonial) => (
                    <Card key={testimonial.id} className="overflow-hidden h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex-grow">
                          <div className="flex mb-4">
                            {renderStars(testimonial.rating)}
                          </div>
                          <blockquote className="text-gray-700 mb-6 italic">
                            "{testimonial.testimonial}"
                          </blockquote>
                        </div>
                        <div className="flex items-center mt-4">
                          <Avatar className="h-12 w-12 mr-4">
                            {testimonial.image ? (
                              <AvatarImage src={testimonial.image} alt={testimonial.name} />
                            ) : (
                              <AvatarFallback className="bg-tunisiaBlue-100 text-tunisiaBlue-800">
                                {getInitials(testimonial.name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{testimonial.name}</h3>
                            <p className="text-sm text-gray-500">{testimonial.position}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="gestion" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials
                  .filter(testimonial => testimonial.category === "gestion")
                  .map((testimonial) => (
                    <Card key={testimonial.id} className="overflow-hidden h-full">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex-grow">
                          <div className="flex mb-4">
                            {renderStars(testimonial.rating)}
                          </div>
                          <blockquote className="text-gray-700 mb-6 italic">
                            "{testimonial.testimonial}"
                          </blockquote>
                        </div>
                        <div className="flex items-center mt-4">
                          <Avatar className="h-12 w-12 mr-4">
                            {testimonial.image ? (
                              <AvatarImage src={testimonial.image} alt={testimonial.name} />
                            ) : (
                              <AvatarFallback className="bg-tunisiaBlue-100 text-tunisiaBlue-800">
                                {getInitials(testimonial.name)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{testimonial.name}</h3>
                            <p className="text-sm text-gray-500">{testimonial.position}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Partagez votre expérience</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Vous avez suivi l'une de nos formations ? Nous serions ravis de connaître votre avis et de le partager avec notre communauté.
            </p>
            <Button className="px-6" size="lg">
              <MessageSquare className="mr-2 h-4 w-4" />
              Laisser un témoignage
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Testimonials;
