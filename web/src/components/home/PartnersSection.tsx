
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const partnersData = [
  {
    id: 1,
    name: "Groupe Chimique Tunisien",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
    description: "Leader dans l'industrie chimique en Tunisie",
  },
  {
    id: 2,
    name: "Plastex Industries",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1574&q=80",
    description: "Spécialiste de la transformation plastique",
  },
  {
    id: 3,
    name: "Technica Tunisia",
    logo: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "Expert en solutions techniques industrielles",
  },
  {
    id: 4,
    name: "FormaPro Consulting",
    logo: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "Cabinet de conseil en formation professionnelle",
  },
  {
    id: 5,
    name: "Eurotunisie Industrie",
    logo: "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
    description: "Entreprise industrielle franco-tunisienne",
  },
  {
    id: 6,
    name: "Ministère de l'Industrie",
    logo: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    description: "Partenaire institutionnel",
  },
];

const PartnersSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const partnersPerPage = 3;
  const totalPages = Math.ceil(partnersData.length / partnersPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visiblePartners = partnersData.slice(
    currentPage * partnersPerPage,
    (currentPage + 1) * partnersPerPage
  );

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <span className="text-sm font-semibold text-tunisiaTeal-500 uppercase tracking-wider">
              Confiance et Collaboration
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-tunisiaBlue-800 mt-2">
              Nos Partenaires
            </h2>
            <div className="h-1 w-24 bg-tunisiaTeal-400 mt-4 mb-6"></div>
            <p className="text-gray-600 max-w-2xl">
              Nous travaillons avec les meilleurs acteurs de l'industrie pour offrir des formations de qualité
              et rester à la pointe de l'innovation.
            </p>
          </div>

          <div className="flex space-x-2 mt-6 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevPage}
              className="border-tunisiaBlue-300 text-tunisiaBlue-500 hover:bg-tunisiaBlue-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              className="border-tunisiaBlue-300 text-tunisiaBlue-500 hover:bg-tunisiaBlue-50"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visiblePartners.map((partner) => (
            <Card
              key={partner.id}
              className="overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-white font-semibold text-xl p-4">
                    {partner.name}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600">{partner.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-3 h-3 rounded-full mx-1 ${
                currentPage === i
                  ? "bg-tunisiaBlue-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Page ${i + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
