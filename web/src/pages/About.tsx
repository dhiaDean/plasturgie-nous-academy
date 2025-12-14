
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { MedalIcon, LineChart, GraduationCap, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Header */}
        <div className="bg-tunisiaBlue-800 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">À propos de nous</h1>
            <p className="text-tunisiaBlue-100 max-w-2xl">
              Découvrez notre mission, notre histoire et notre approche unique en matière de formation professionnelle en Tunisie.
            </p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-tunisiaBlue-800 mb-6">
                Notre Mission
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Chez Tunisia Formation, notre mission est de fournir des formations professionnelles de haute qualité adaptées aux besoins spécifiques des industries tunisiennes. Nous nous engageons à développer les compétences et les connaissances des professionnels pour qu'ils puissent exceller dans leurs domaines respectifs.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nous croyons fermement que l'éducation continue et la formation professionnelle sont essentielles pour stimuler l'innovation, accroître la productivité et favoriser la croissance économique en Tunisie.
              </p>
              <div className="bg-tunisiaBlue-50 border-l-4 border-tunisiaBlue-500 p-4 italic text-gray-700">
                "Notre objectif est de devenir le partenaire de formation privilégié pour les entreprises et les professionnels en Tunisie, en offrant des programmes de formation qui répondent aux défis actuels et futurs de l'industrie."
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80" 
                alt="Formation professionnelle" 
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-lg shadow-lg hidden lg:block">
                <p className="text-tunisiaBlue-800 font-bold">+ de 500</p>
                <p className="text-gray-600">Professionnels formés</p>
              </div>
            </div>
          </div>
          
          {/* Company Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-tunisiaTeal-500 hover:shadow-xl transition-shadow">
              <MedalIcon className="text-tunisiaBlue-600 mb-4 h-10 w-10" />
              <h3 className="text-xl font-bold text-tunisiaBlue-800 mb-2">Excellence</h3>
              <p className="text-gray-600">
                Nous nous engageons à offrir des formations de la plus haute qualité, dispensées par des experts reconnus dans leurs domaines.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-tunisiaTeal-500 hover:shadow-xl transition-shadow">
              <LineChart className="text-tunisiaBlue-600 mb-4 h-10 w-10" />
              <h3 className="text-xl font-bold text-tunisiaBlue-800 mb-2">Innovation</h3>
              <p className="text-gray-600">
                Nos programmes de formation sont constamment mis à jour pour refléter les dernières avancées technologiques et les meilleures pratiques du secteur.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-tunisiaTeal-500 hover:shadow-xl transition-shadow">
              <GraduationCap className="text-tunisiaBlue-600 mb-4 h-10 w-10" />
              <h3 className="text-xl font-bold text-tunisiaBlue-800 mb-2">Expertise</h3>
              <p className="text-gray-600">
                Notre équipe de formateurs est composée d'experts qui possèdent une vaste expérience pratique dans leurs domaines respectifs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-tunisiaTeal-500 hover:shadow-xl transition-shadow">
              <Users className="text-tunisiaBlue-600 mb-4 h-10 w-10" />
              <h3 className="text-xl font-bold text-tunisiaBlue-800 mb-2">Approche personnalisée</h3>
              <p className="text-gray-600">
                Nous adaptons nos formations aux besoins spécifiques de chaque entreprise et de chaque apprenant pour maximiser l'impact et les résultats.
              </p>
            </div>
          </div>
          
          {/* History Section */}
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-tunisiaBlue-800 mb-10 text-center">
              Notre Histoire
            </h2>
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-tunisiaBlue-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  2010
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded shadow-md">
                  <h3 className="text-xl font-bold text-tunisiaBlue-800 mb-2">Fondation</h3>
                  <p className="text-gray-600">
                    Tunisia Formation a été fondée avec pour mission d'offrir des formations professionnelles de qualité aux entreprises tunisiennes.
                  </p>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-tunisiaBlue-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  2015
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded shadow-md">
                  <h3 className="text-xl font-bold text-tunisiaBlue-800 mb-2">Expansion</h3>
                  <p className="text-gray-600">
                    Nous avons élargi notre offre de formation pour inclure de nouveaux domaines spécialisés et avons ouvert notre deuxième centre de formation à Sousse.
                  </p>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-tunisiaBlue-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  2020
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded shadow-md">
                  <h3 className="text-xl font-bold text-tunisiaBlue-800 mb-2">Innovation numérique</h3>
                  <p className="text-gray-600">
                    Lancement de notre plateforme de formation en ligne pour offrir une plus grande flexibilité et accessibilité à nos apprenants.
                  </p>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-tunisiaBlue-600 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  2023
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded shadow-md">
                  <h3 className="text-xl font-bold text-tunisiaBlue-800 mb-2">Aujourd'hui</h3>
                  <p className="text-gray-600">
                    Tunisia Formation est désormais reconnue comme un leader dans le domaine de la formation professionnelle en Tunisie, avec un réseau étendu de partenaires industriels et académiques.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default About;
