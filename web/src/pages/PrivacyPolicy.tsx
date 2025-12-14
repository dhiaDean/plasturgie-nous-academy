
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, FileText, Lock, Key } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
  const lastUpdated = "10 avril 2025";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center mb-8">
            <Shield className="h-10 w-10 text-tunisiaBlue-500 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold">Politique de Confidentialité</h1>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-gray-600">Dernière mise à jour: {lastUpdated}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="prose max-w-none">
              <p className="text-lg">
                Tunisia Formation s'engage à protéger la vie privée des utilisateurs de son site web. 
                Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles.
              </p>

              <div className="my-8">
                <div className="flex items-center mb-4">
                  <Eye className="h-6 w-6 text-tunisiaBlue-500 mr-3" />
                  <h2 className="text-xl font-semibold">Collecte d'informations</h2>
                </div>
                <Separator className="mb-4" />
                <p>
                  Nous collectons les informations suivantes lorsque vous interagissez avec notre site web:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Informations d'identification (nom, prénom, adresse e-mail)</li>
                  <li>Informations professionnelles (entreprise, poste)</li>
                  <li>Coordonnées (numéro de téléphone, adresse)</li>
                  <li>Préférences de formation et centres d'intérêt</li>
                  <li>Données de navigation et d'utilisation du site</li>
                </ul>
              </div>

              <div className="my-8">
                <div className="flex items-center mb-4">
                  <FileText className="h-6 w-6 text-tunisiaBlue-500 mr-3" />
                  <h2 className="text-xl font-semibold">Utilisation des informations</h2>
                </div>
                <Separator className="mb-4" />
                <p>
                  Les informations collectées sont utilisées aux fins suivantes:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Traitement des demandes de formation et de devis</li>
                  <li>Communication concernant nos services et offres</li>
                  <li>Amélioration de notre site web et de nos services</li>
                  <li>Personnalisation de votre expérience utilisateur</li>
                  <li>Envoi de newsletters (avec votre consentement)</li>
                  <li>Réponse à vos questions et demandes</li>
                </ul>
              </div>

              <div className="my-8">
                <div className="flex items-center mb-4">
                  <Lock className="h-6 w-6 text-tunisiaBlue-500 mr-3" />
                  <h2 className="text-xl font-semibold">Protection des données</h2>
                </div>
                <Separator className="mb-4" />
                <p>
                  Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre tout accès non autorisé, modification, divulgation ou destruction.
                </p>
                <p className="mt-2">
                  Ces mesures comprennent:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Utilisation de connexions sécurisées (SSL/TLS)</li>
                  <li>Accès limité aux données personnelles</li>
                  <li>Politiques strictes de conservation des données</li>
                  <li>Formation du personnel sur la protection des données</li>
                </ul>
              </div>

              <div className="my-8">
                <div className="flex items-center mb-4">
                  <Key className="h-6 w-6 text-tunisiaBlue-500 mr-3" />
                  <h2 className="text-xl font-semibold">Vos droits</h2>
                </div>
                <Separator className="mb-4" />
                <p>
                  Conformément aux lois sur la protection des données, vous disposez des droits suivants:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Droit d'accès à vos données personnelles</li>
                  <li>Droit de rectification de vos données</li>
                  <li>Droit à l'effacement de vos données</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d'opposition au traitement</li>
                </ul>
                <p className="mt-4">
                  Pour exercer l'un de ces droits, veuillez nous contacter à l'adresse: <span className="text-tunisiaBlue-600">privacy@tunisiaformation.com</span>
                </p>
              </div>

              <div className="my-8">
                <h2 className="text-xl font-semibold mb-4">Cookies</h2>
                <Separator className="mb-4" />
                <p>
                  Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter certaines fonctionnalités de notre site.
                </p>
              </div>

              <div className="my-8">
                <h2 className="text-xl font-semibold mb-4">Modifications de la politique</h2>
                <Separator className="mb-4" />
                <p>
                  Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec la date de mise à jour.
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <p className="font-semibold">Contact</p>
                <p className="mt-2">
                  Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter:
                </p>
                <p className="mt-2">
                  Tunisia Formation<br />
                  Rue de l'Innovation, Technopole El Ghazala, Ariana, Tunisie<br />
                  Email: privacy@tunisiaformation.com<br />
                  Téléphone: +216 70 123 456
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
