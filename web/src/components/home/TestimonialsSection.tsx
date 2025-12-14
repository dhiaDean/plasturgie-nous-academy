
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: "Mohamed Ben Ali",
    role: "Technicien de production, STIP",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text: "La formation en techniques d'injection plastique a révolutionné ma façon de travailler. Les concepts appris sont directement applicables dans mon travail quotidien.",
  },
  {
    id: 2,
    name: "Leila Mansour",
    role: "Responsable qualité, Polychimie Tunisie",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    text: "Formation très complète sur la gestion de la qualité avec des formateurs experts dans leur domaine. Excellente pédagogie et accompagnement personnalisé.",
  },
  {
    id: 3,
    name: "Karim Trabelsi",
    role: "Ingénieur maintenance, Groupe SIFCOL",
    image: "https://randomuser.me/api/portraits/men/28.jpg",
    rating: 4,
    text: "J'ai beaucoup apprécié l'approche pratique de la formation en maintenance industrielle. Les études de cas réels étaient particulièrement instructives.",
  },
  {
    id: 4,
    name: "Sonia Gharbi",
    role: "Directrice de production, Plastipack",
    image: "https://randomuser.me/api/portraits/women/56.jpg",
    rating: 5,
    text: "La formation en extrusion et soufflage m'a permis d'optimiser significativement notre ligne de production. Un retour sur investissement immédiat pour notre entreprise.",
  },
  {
    id: 5,
    name: "Amine Mahjoub",
    role: "Concepteur industriel, Plastika",
    image: "https://randomuser.me/api/portraits/men/18.jpg",
    rating: 5,
    text: "Formation exceptionnelle sur la conception de moules. Les outils et méthodes enseignés sont à la pointe de la technologie actuelle.",
  },
];

const TestimonialsSection = () => {
  const maxVisibleCards = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const testimonialContainerRef = useRef<HTMLDivElement>(null);

  const totalTestimonials = testimonials.length;
  const maxIndex = totalTestimonials - maxVisibleCards;

  const handlePrevious = () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < maxIndex && !isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    if (isAnimating && testimonialContainerRef.current) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Match this with the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Testimonials visible in the current view
  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + maxVisibleCards
  );

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-tunisiaTeal-500 uppercase tracking-wider">
            Témoignages
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-tunisiaBlue-800 mt-2">
            Ce que disent nos apprenants
          </h2>
          <div className="h-1 w-24 bg-tunisiaTeal-400 mt-4 mb-6 mx-auto"></div>
          <p className="text-gray-600">
            Découvrez les expériences de nos participants qui ont suivi nos formations et développé leurs compétences professionnelles.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex <= 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md ${
              currentIndex <= 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6 text-tunisiaBlue-600" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md ${
              currentIndex >= maxIndex
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6 text-tunisiaBlue-600" />
          </button>

          {/* Testimonials Container */}
          <div
            ref={testimonialContainerRef}
            className="overflow-hidden"
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / maxVisibleCards)}%)`,
                width: `${(totalTestimonials * 100) / maxVisibleCards}%`,
              }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="px-2 md:px-4"
                  style={{ width: `${100 / totalTestimonials}%` }}
                >
                  <Card className="h-full p-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full mr-4 object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-tunisiaBlue-800">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex mb-4">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonial.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                      </div>

                      <p className="text-gray-600 flex-grow">
                        "{testimonial.text}"
                      </p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array(maxIndex + 1)
            .fill(0)
            .map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-tunisiaBlue-600 w-6"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial set ${index + 1}`}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
