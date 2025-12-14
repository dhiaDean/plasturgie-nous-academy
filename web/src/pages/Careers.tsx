
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, MapPin, Clock, DollarSign, BookOpen, Award, Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Careers = () => {
  const jobs = [
    {
      id: 1,
      title: "Formateur en Plasturgie",
      location: "Tunis, Tunisie",
      type: "Temps plein",
      category: "Formation",
      salary: "Compétitif",
      description: "Nous recherchons un formateur expérimenté dans le domaine de la plasturgie pour animer des sessions de formation théoriques et pratiques.",
      responsibilities: [
        "Élaborer et mettre à jour des programmes de formation en plasturgie",
        "Animer des sessions de formation pour différents publics",
        "Évaluer les progrès des apprenants et adapter les méthodes pédagogiques",
        "Rester à jour sur les dernières innovations du secteur",
      ],
      requirements: [
        "Diplôme d'ingénieur en plasturgie ou équivalent",
        "Minimum 5 ans d'expérience dans l'industrie plastique",
        "Expérience pédagogique appréciée",
        "Excellentes capacités de communication",
      ]
    },
    {
      id: 2,
      title: "Responsable Développement Commercial",
      location: "Sfax, Tunisie",
      type: "Temps plein",
      category: "Commercial",
      salary: "Selon profil + commission",
      description: "Dans le cadre de notre expansion, nous recherchons un Responsable Développement Commercial pour promouvoir notre offre de formation auprès des entreprises.",
      responsibilities: [
        "Prospecter de nouveaux clients dans le secteur industriel",
        "Élaborer des propositions commerciales adaptées aux besoins clients",
        "Assurer le suivi des relations clients existants",
        "Participer aux événements professionnels pour promouvoir nos services",
      ],
      requirements: [
        "Formation supérieure en commerce ou marketing",
        "Expérience de 3 ans minimum dans la vente B2B",
        "Connaissance du secteur industriel tunisien",
        "Permis de conduire et mobilité",
      ]
    },
    {
      id: 3,
      title: "Technicien en Maintenance Industrielle",
      location: "Sousse, Tunisie",
      type: "Temps plein",
      category: "Technique",
      salary: "Selon expérience",
      description: "Nous recherchons un technicien en maintenance industrielle pour entretenir nos équipements de formation pratique et assister les formateurs.",
      responsibilities: [
        "Assurer la maintenance préventive et corrective des équipements",
        "Préparer les matériels pour les sessions de formation",
        "Assister les formateurs pendant les démonstrations pratiques",
        "Gérer les stocks de pièces détachées et consommables",
      ],
      requirements: [
        "BTS ou diplôme équivalent en maintenance industrielle",
        "Expérience de 2 ans minimum dans un environnement industriel",
        "Connaissances en électromécanique et hydraulique",
        "Rigueur et autonomie",
      ]
    },
    {
      id: 4,
      title: "Coordinateur Pédagogique",
      location: "Tunis, Tunisie",
      type: "Temps plein",
      category: "Formation",
      salary: "Selon profil",
      description: "Le coordinateur pédagogique sera responsable de l'organisation et du suivi des formations, ainsi que de la coordination avec les formateurs.",
      responsibilities: [
        "Planifier et organiser les sessions de formation",
        "Coordonner l'équipe de formateurs",
        "Assurer le suivi administratif des formations",
        "Veiller à la qualité des formations dispensées",
      ],
      requirements: [
        "Formation supérieure en sciences de l'éducation ou gestion",
        "Expérience de 3 ans dans la coordination de formations",
        "Excellentes capacités organisationnelles",
        "Maîtrise des outils informatiques de gestion",
      ]
    },
  ];

  const benefits = [
    {
      title: "Développement professionnel",
      description: "Formations continues et opportunités d'évolution",
      icon: <BookOpen className="h-8 w-8 text-tunisiaBlue-500" />
    },
    {
      title: "Environnement stimulant",
      description: "Travaillez avec des experts et partagez vos connaissances",
      icon: <Award className="h-8 w-8 text-tunisiaBlue-500" />
    },
    {
      title: "Package attractif",
      description: "Rémunération compétitive et avantages sociaux",
      icon: <DollarSign className="h-8 w-8 text-tunisiaBlue-500" />
    },
    {
      title: "Équilibre vie pro/perso",
      description: "Horaires flexibles et possibilité de télétravail partiel",
      icon: <Clock className="h-8 w-8 text-tunisiaBlue-500" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Rejoignez Notre Équipe</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez les opportunités de carrière chez Tunisia Formation et contribuez à l'excellence de la formation technique en Tunisie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-tunisiaBlue-50 rounded-lg p-6 col-span-1 md:sticky md:top-24 md:self-start h-fit">
              <h2 className="text-xl font-bold mb-4">Pourquoi nous rejoindre?</h2>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-tunisiaBlue-100">
                <p className="font-semibold mb-2">Candidature spontanée</p>
                <p className="text-sm text-gray-600 mb-4">
                  Vous ne trouvez pas de poste correspondant à votre profil? Envoyez-nous votre candidature spontanée.
                </p>
                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Postuler
                </Button>
              </div>
            </div>

            <div className="col-span-1 md:col-span-3">
              <Tabs defaultValue="all" className="mb-8">
                <TabsList>
                  <TabsTrigger value="all">Tous les postes</TabsTrigger>
                  <TabsTrigger value="formation">Formation</TabsTrigger>
                  <TabsTrigger value="commercial">Commercial</TabsTrigger>
                  <TabsTrigger value="technique">Technique</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="space-y-6">
                    {jobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="formation" className="mt-6">
                  <div className="space-y-6">
                    {jobs.filter(job => job.category === "Formation").map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="commercial" className="mt-6">
                  <div className="space-y-6">
                    {jobs.filter(job => job.category === "Commercial").map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="technique" className="mt-6">
                  <div className="space-y-6">
                    {jobs.filter(job => job.category === "Technique").map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="bg-tunisiaBlue-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Processus de recrutement</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div className="bg-tunisiaBlue-700 rounded-lg p-6">
                <div className="bg-white text-tunisiaBlue-600 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
                <h3 className="font-semibold mb-2">Candidature</h3>
                <p className="text-sm opacity-80">Envoyez votre CV et lettre de motivation</p>
              </div>
              <div className="bg-tunisiaBlue-700 rounded-lg p-6">
                <div className="bg-white text-tunisiaBlue-600 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
                <h3 className="font-semibold mb-2">Présélection</h3>
                <p className="text-sm opacity-80">Nous examinons votre profil</p>
              </div>
              <div className="bg-tunisiaBlue-700 rounded-lg p-6">
                <div className="bg-white text-tunisiaBlue-600 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
                <h3 className="font-semibold mb-2">Entretiens</h3>
                <p className="text-sm opacity-80">Rencontre avec notre équipe</p>
              </div>
              <div className="bg-tunisiaBlue-700 rounded-lg p-6">
                <div className="bg-white text-tunisiaBlue-600 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-4 font-bold text-xl">4</div>
                <h3 className="font-semibold mb-2">Intégration</h3>
                <p className="text-sm opacity-80">Bienvenue dans l'équipe!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

interface JobProps {
  job: {
    id: number;
    title: string;
    location: string;
    type: string;
    category: string;
    salary: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
  };
}

const JobCard = ({ job }: JobProps) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <CardDescription className="mt-1">
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full">
                  <MapPin className="h-3 w-3 mr-1" />
                  {job.location}
                </span>
                <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full">
                  <Clock className="h-3 w-3 mr-1" />
                  {job.type}
                </span>
                <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {job.category}
                </span>
                <span className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {job.salary}
                </span>
              </div>
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? "Réduire" : "Détails"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{job.description}</p>
        
        {expanded && (
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Responsabilités</h3>
              <ul className="list-disc pl-5 space-y-1">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="text-gray-600 text-sm">{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Exigences</h3>
              <ul className="list-disc pl-5 space-y-1">
                {job.requirements.map((item, index) => (
                  <li key={index} className="text-gray-600 text-sm">{item}</li>
                ))}
              </ul>
            </div>
            
            <Button className="mt-4 w-full sm:w-auto">
              Postuler maintenant
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Careers;
