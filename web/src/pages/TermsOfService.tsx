
import React from "react";
import { Separator } from "@/components/ui/separator";
import { FileText, AlertCircle, Scale, Clock, Globe } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TermsOfService = () => {
  const lastUpdated = "10 avril 2025";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center mb-8">
            <FileText className="h-10 w-10 text-tunisiaBlue-500 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold">Conditions Générales d'Utilisation</h1>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-gray-600">Dernière mise à jour: {lastUpdated}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="prose max-w-none">
              <p className="text-lg">
                Bienvenue sur le site web de Tunisia Formation. En accédant et en utilisant ce site, vous acceptez de respecter les conditions générales d'utilisation décrites ci-dessous.
              </p>

              <div className="my-8">
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-6 w-6 text-tunisiaBlue-500 mr-3" />
                  <h2 className="text-xl font-semibold">Utilisation du site</h2>
                </div>
                <Separator className="mb-4" />
                <p>
                  L'utilisation de ce site est soumise aux conditions suivantes:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Vous acceptez d'utiliser ce site uniquement à des fins légales et conformément aux présentes conditions.</li>
                  <li>Vous vous engagez à ne pas utiliser ce site d'une manière qui pourrait endommager, désactiver, surcharger ou altérer le site.</li>
                  <li>Vous acceptez de ne pas tenter d'accéder à des zones non autorisées du site.</li>
                  <li>Vous êtes responsable de maintenir la confidentialité de vos informations de compte et mot de passe.</li>
                </ul>
              </div>

              <div className="my-8">
                <div className="flex items-center mb-4">
                  <Scale className="h-6 w-6 text-tunisiaBlue-500 mr-3" />
                  <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
                </div>
                <Separator className="mb-4" />
                <p>
                  Tous les contenus présents sur ce site (textes, images, logos, vidéos, etc.) sont la propriété exclusive de Tunisia Formation ou de ses partenaires et sont protégés par les lois sur la propriété intellectuelle.
                </p>
                <p className="mt-2">
                  Toute reproduction, distribution, modification ou utilisation des contenus sans autorisation préalable est strictement interdite.
                </p>
              </div>

              <div className="my-8">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-tunisiaBlue-500 mr-3" />
                  <h2 className="text-xl font-semibold">Formations et inscriptions</h2>
                </div>
                <Separator className="mb-4" />
                <p>
                  Les informations concernant nos formations sont fournies à titre indicatif et peuvent être modifiées sans préavis.
                </p>
                <p className="mt-2">
                  L'inscription à une formation est soumise aux conditions spécifiques suivantes:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Toute inscription doit être confirmée par écrit ou via notre plateforme en ligne.</li>
                  <li>Les frais de formation doivent être réglés selon les modalités indiquées lors de l'inscription.</li>
                  <li>Toute annulation doit être notifiée par écrit au moins 10 jours avant la date de la formation pour être remboursée intégralement.</li>
                  <li>Tunisia Formation se réserve le droit d'annuler ou de reporter une formation en cas de nombre insuffisant de participants.</li>
                </ul>
              </div>

              <div className="my-8">
                <div className="flex items-center mb-4">
                  <Globe className="h-6 w-6 text-tunisiaBlue-500 mr-3" />
                  <h2 className="text-xl font-semibold">Liens externes</h2>
                </div>
                <Separator className="mb-4" />
                <p>
                  Notre site peut contenir des liens vers des sites web externes. Ces liens sont fournis uniquement pour votre commodité.
                </p>
                <p className="mt-2">
                  Tunisia Formation n'exerce aucun contrôle sur le contenu de ces sites et décline toute responsabilité concernant:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Le contenu des sites externes</li>
                  <li>Les pratiques de confidentialité de ces sites</li>
                  <li>Les produits ou services offerts par ces sites</li>
                </ul>
              </div>

              <div className="my-8">
                <h2 className="text-xl font-semibold mb-4">Limitation de responsabilité</h2>
                <Separator className="mb-4" />
                <p>
                  Tunisia Formation s'efforce de maintenir les informations de ce site à jour et exactes. Cependant:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Nous ne garantissons pas l'exactitude, l'exhaustivité ou la pertinence des informations fournies.</li>
                  <li>Nous ne sommes pas responsables des erreurs ou omissions dans le contenu du site.</li>
                  <li>Nous déclinons toute responsabilité pour les dommages directs ou indirects résultant de l'accès ou de l'utilisation de ce site.</li>
                </ul>
              </div>

              <div className="my-8">
                <h2 className="text-xl font-semibold mb-4">Modifications des conditions</h2>
                <Separator className="mb-4" />
                <p>
                  Tunisia Formation se réserve le droit de modifier ces conditions générales à tout moment. Les modifications entrent en vigueur dès leur publication sur le site.
                </p>
                <p className="mt-2">
                  Il est de votre responsabilité de consulter régulièrement ces conditions pour vous tenir informé des éventuelles modifications.
                </p>
              </div>

              <div className="my-8">
                <h2 className="text-xl font-semibold mb-4">Droit applicable</h2>
                <Separator className="mb-4" />
                <p>
                  Les présentes conditions sont régies par la législation tunisienne. Tout litige relatif à l'interprétation ou à l'exécution de ces conditions sera soumis à la compétence exclusive des tribunaux de Tunis.
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-200">
                <p className="font-semibold">Contact</p>
                <p className="mt-2">
                  Pour toute question concernant ces conditions générales, veuillez nous contacter:
                </p>
                <p className="mt-2">
                  Tunisia Formation<br />
                  Rue de l'Innovation, Technopole El Ghazala, Ariana, Tunisie<br />
                  Email: contact@tunisiaformation.com<br />
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

export default TermsOfService;
