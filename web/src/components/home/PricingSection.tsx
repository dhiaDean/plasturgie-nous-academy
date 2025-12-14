
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Formation Standard",
    price: "350",
    description: "Pour les individus souhaitant améliorer leurs compétences",
    features: [
      "Accès aux modules de formation",
      "Support par email",
      "Certificat de réussite",
      "Accès à la communauté",
      "6 mois d'accès au contenu",
    ],
    highlighted: false,
  },
  {
    name: "Formation Pro",
    price: "650",
    description: "Pour les professionnels visant l'excellence technique",
    features: [
      "Tout dans Formation Standard",
      "Sessions pratiques avancées",
      "Support prioritaire",
      "Accès aux projets pratiques",
      "Mentorat personnalisé (2h)",
      "Accès à vie au contenu",
    ],
    highlighted: true,
  },
  {
    name: "Formation Entreprise",
    price: "Sur mesure",
    description: "Solutions adaptées aux besoins spécifiques de votre entreprise",
    features: [
      "Formations personnalisées",
      "Formation sur site possible",
      "Consultation avec experts",
      "Évaluation des besoins",
      "Suivi post-formation",
      "Contenu adapté à votre industrie",
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  const handleQuoteRequest = () => {
    navigate('/quote');
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold text-tunisiaTeal-500 uppercase tracking-wider">
            Investissez dans vos compétences
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-tunisiaBlue-800 mt-2">
            Tarifs et Formules
          </h2>
          <div className="h-1 w-24 bg-tunisiaTeal-400 mt-4 mb-6 mx-auto"></div>
          <p className="text-gray-600">
            Nous proposons différentes formules pour répondre au mieux à vos besoins de formation.
            Des offres adaptées aux individus comme aux entreprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${
                plan.highlighted
                  ? "border-tunisiaBlue-500 shadow-lg"
                  : "border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 inset-x-0 transform -translate-y-1/2">
                  <div className="bg-tunisiaBlue-500 text-white text-xs uppercase font-bold py-1 px-4 rounded-full inline-block">
                    Populaire
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-tunisiaBlue-800">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  {plan.price === "Sur mesure" ? (
                    <div className="text-4xl font-bold text-tunisiaBlue-700">
                      {plan.price}
                    </div>
                  ) : (
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-tunisiaBlue-700">{plan.price}</span>
                      <span className="text-lg text-gray-500 ml-2">DT</span>
                    </div>
                  )}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-tunisiaTeal-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-tunisiaBlue-500 to-tunisiaTeal-500 hover:from-tunisiaBlue-600 hover:to-tunisiaTeal-600"
                      : "bg-tunisiaBlue-500 hover:bg-tunisiaBlue-600"
                  }`}
                  onClick={handleQuoteRequest}
                >
                  Demander un devis
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Besoin d'une solution spécifique ? Contactez-nous pour discuter de vos besoins particuliers.
          </p>
          <Button 
            variant="outline" 
            className="border-tunisiaBlue-500 text-tunisiaBlue-600 hover:bg-tunisiaBlue-50"
            onClick={() => navigate('/contact')}
          >
            Nous contacter
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
