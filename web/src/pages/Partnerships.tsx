
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Building, Handshake, Globe } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Partnerships = () => {
  const partners = [
    {
      name: "Industrie Plastique Tunisie",
      logo: "https://placehold.co/200x100/tunisiaBlue/white?text=IPT",
      description: "Leader dans la fabrication de produits plastiques industriels en Tunisie.",
      type: "Industrie"
    },
    {
      name: "TechnoPlast",
      logo: "https://placehold.co/200x100/tunisiaTeal/white?text=TP",
      description: "Spécialiste des technologies d'injection plastique avancées.",
      type: "Technologie"
    },
    {
      name: "FormaTech",
      logo: "https://placehold.co/200x100/gray/white?text=FT",
      description: "Centre de formation technique reconnu dans tout le Maghreb.",
      type: "Éducation"
    },
    {
      name: "Association Tunisienne de Plasturgie",
      logo: "https://placehold.co/200x100/tunisiaBlue/white?text=ATP",
      description: "Organisation professionnelle regroupant les acteurs de la plasturgie.",
      type: "Association"
    },
    {
      name: "Plastique & Environnement",
      logo: "https://placehold.co/200x100/green/white?text=P&E",
      description: "ONG dédiée au recyclage et à la gestion durable des déchets plastiques.",
      type: "ONG"
    },
    {
      name: "Ministère de l'Industrie",
      logo: "https://placehold.co/200x100/red/white?text=Gouv",
      description: "Partenariat institutionnel pour la certification des formations.",
      type: "Gouvernement"
    }
  ];

  const benefits = [
    {
      title: "Formations sur mesure",
      description: "Programmes de formation adaptés aux besoins spécifiques de votre entreprise",
      icon: <Briefcase className="h-10 w-10 text-tunisiaBlue-500" />
    },
    {
      title: "Accès prioritaire",
      description: "Réservations privilégiées aux sessions de formation et événements",
      icon: <Users className="h-10 w-10 text-tunisiaBlue-500" />
    },
    {
      title: "Consulting expert",
      description: "Consultations avec nos experts pour résoudre vos défis techniques",
      icon: <Building className="h-10 w-10 text-tunisiaBlue-500" />
    },
    {
      title: "Réseautage",
      description: "Mise en relation avec notre réseau d'experts et d'entreprises du secteur",
      icon: <Handshake className="h-10 w-10 text-tunisiaBlue-500" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Nos Partenariats</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez notre réseau de partenaires industriels, éducatifs et institutionnels qui nous permettent d'offrir des formations d'excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {partners.map((partner, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:border-tunisiaBlue-300">
                <CardHeader className="pb-2 text-center">
                  <div className="mx-auto mb-4">
                    <img 
                      src={partner.logo} 
                      alt={`Logo ${partner.name}`} 
                      className="h-16 object-contain"
                    />
                  </div>
                  <CardTitle>{partner.name}</CardTitle>
                  <CardDescription className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs mt-2">
                    {partner.type}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">{partner.description}</p>
                  <Button variant="outline" className="mt-4 w-full">
                    En savoir plus
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-tunisiaBlue-50 rounded-lg p-8 mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-4">Pourquoi devenir partenaire?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                En devenant partenaire de Tunisia Formation, vous bénéficiez d'avantages exclusifs et contribuez à l'excellence de la formation technique en Tunisie.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tunisiaBlue-50 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Devenez notre prochain partenaire</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Vous souhaitez collaborer avec Tunisia Formation? Contactez-nous pour discuter des possibilités de partenariat adaptées à vos objectifs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-tunisiaBlue-600 hover:bg-tunisiaBlue-700">
                <Globe className="mr-2 h-5 w-5" />
                Nous contacter
              </Button>
              <Button size="lg" variant="outline">
                Télécharger la brochure
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Partnerships;
