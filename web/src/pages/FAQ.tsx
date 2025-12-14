
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, HelpCircle, Phone, Mail, MessageSquare } from "lucide-react";

const FAQ = () => {
  // FAQ Data - organized by categories
  const faqData = {
    general: [
      {
        question: "Quels types de formations proposez-vous ?",
        answer: "Tunisia Formation propose des formations dans trois domaines principaux : la plasturgie, les techniques industrielles et la gestion. Nos formations couvrent divers sujets comme l'injection plastique, l'extrusion, la maintenance industrielle, la gestion de la qualité et bien plus encore."
      },
      {
        question: "Vos formations sont-elles certifiantes ?",
        answer: "Oui, toutes nos formations sont certifiantes. Nous délivrons des certificats reconnus par le ministère de la Formation Professionnelle et de l'Emploi en Tunisie, ainsi que par plusieurs organismes internationaux."
      },
      {
        question: "Où se déroulent vos formations ?",
        answer: "Nos formations se déroulent principalement dans notre centre de formation à Tunis. Cependant, nous proposons également des formations sur site pour les entreprises qui souhaitent former leurs employés dans leurs locaux."
      },
      {
        question: "Proposez-vous des formations en ligne ?",
        answer: "Oui, nous proposons des formations en ligne pour certains de nos cours théoriques. Cependant, pour les formations pratiques nécessitant l'utilisation d'équipements spécifiques, nous privilégions les formations en présentiel."
      }
    ],
    inscriptions: [
      {
        question: "Comment puis-je m'inscrire à une formation ?",
        answer: "Vous pouvez vous inscrire à une formation en remplissant le formulaire d'inscription sur notre site web, en nous contactant par téléphone ou en nous envoyant un email. Vous pouvez également vous rendre directement dans notre centre pour vous inscrire."
      },
      {
        question: "Quels sont les prérequis pour suivre vos formations ?",
        answer: "Les prérequis varient selon les formations. Certaines sont accessibles à tous, tandis que d'autres nécessitent des connaissances préalables. Les prérequis sont indiqués sur la page de chaque formation."
      },
      {
        question: "Est-il possible d'annuler mon inscription ?",
        answer: "Oui, vous pouvez annuler votre inscription jusqu'à 7 jours avant le début de la formation sans frais. Au-delà de ce délai, des frais d'annulation peuvent s'appliquer. Veuillez consulter nos conditions générales pour plus de détails."
      },
      {
        question: "Proposez-vous des facilités de paiement ?",
        answer: "Oui, nous proposons des facilités de paiement pour les formations longues. Vous pouvez payer en plusieurs fois sans frais. Contactez-nous pour en savoir plus sur les modalités de paiement."
      }
    ],
    entreprises: [
      {
        question: "Proposez-vous des formations sur mesure pour les entreprises ?",
        answer: "Oui, nous proposons des formations sur mesure adaptées aux besoins spécifiques des entreprises. Nous travaillons avec vous pour élaborer un programme de formation qui répond à vos objectifs et aux défis de votre secteur d'activité."
      },
      {
        question: "Comment organiser une formation pour mes employés ?",
        answer: "Pour organiser une formation pour vos employés, contactez notre service clientèle. Un conseiller vous accompagnera pour définir vos besoins, vous proposer une solution adaptée et planifier la formation."
      },
      {
        question: "Les formations pour entreprises peuvent-elles être financées ?",
        answer: "Oui, les formations pour entreprises peuvent être financées par différents dispositifs selon votre pays. En Tunisie, elles peuvent être prises en charge par la TFP (Taxe de Formation Professionnelle). Nos conseillers peuvent vous aider à identifier les dispositifs de financement adaptés à votre situation."
      },
      {
        question: "Quel est le nombre minimum de participants pour une formation en entreprise ?",
        answer: "Le nombre minimum de participants pour une formation en entreprise est généralement de 5 personnes. Cependant, ce nombre peut varier selon le type de formation. Contactez-nous pour discuter de vos besoins spécifiques."
      }
    ],
    financement: [
      {
        question: "Comment financer ma formation ?",
        answer: "Plusieurs options de financement sont disponibles, notamment : autofinancement, financement par l'employeur, dispositifs publics de formation continue, et programmes spécifiques pour les demandeurs d'emploi. Notre équipe peut vous guider vers la solution la plus adaptée à votre situation."
      },
      {
        question: "Ma formation peut-elle être prise en charge par mon employeur ?",
        answer: "Oui, votre formation peut être prise en charge par votre employeur dans le cadre du plan de développement des compétences de l'entreprise. Parlez-en à votre service des ressources humaines ou à votre responsable."
      },
      {
        question: "Existe-t-il des aides financières pour les demandeurs d'emploi ?",
        answer: "Oui, il existe des aides financières spécifiques pour les demandeurs d'emploi. En Tunisie, vous pouvez vous renseigner auprès de l'ANETI (Agence Nationale pour l'Emploi et le Travail Indépendant) pour connaître les dispositifs disponibles."
      },
      {
        question: "Proposez-vous des réductions pour les étudiants ?",
        answer: "Oui, nous proposons des tarifs réduits pour les étudiants sur présentation d'un justificatif valide. Contactez-nous pour connaître les modalités et les formations éligibles."
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* FAQ Header */}
        <div className="bg-gradient-to-r from-tunisiaBlue-600 to-tunisiaTeal-500 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <HelpCircle className="mx-auto h-16 w-16 mb-4" />
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Comment pouvons-nous vous aider ?</h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Trouvez rapidement des réponses à vos questions sur nos formations et services
            </p>
            <div className="max-w-xl mx-auto relative">
              <Input 
                placeholder="Rechercher une question..." 
                className="pl-10 py-6 text-black rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="general" className="space-y-8">
            <TabsList className="flex justify-center">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="inscriptions">Inscriptions</TabsTrigger>
              <TabsTrigger value="entreprises">Entreprises</TabsTrigger>
              <TabsTrigger value="financement">Financement</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Accordion type="single" collapsible className="space-y-4">
                {faqData.general.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline text-left">
                      <div className="font-medium text-lg">{item.question}</div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-0 text-gray-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="inscriptions">
              <Accordion type="single" collapsible className="space-y-4">
                {faqData.inscriptions.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline text-left">
                      <div className="font-medium text-lg">{item.question}</div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-0 text-gray-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="entreprises">
              <Accordion type="single" collapsible className="space-y-4">
                {faqData.entreprises.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline text-left">
                      <div className="font-medium text-lg">{item.question}</div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-0 text-gray-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="financement">
              <Accordion type="single" collapsible className="space-y-4">
                {faqData.financement.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline text-left">
                      <div className="font-medium text-lg">{item.question}</div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-0 text-gray-600">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Vous n'avez pas trouvé de réponse à votre question ?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Notre équipe est à votre disposition pour répondre à toutes vos questions.
                N'hésitez pas à nous contacter par téléphone, email ou via notre formulaire de contact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Phone className="h-10 w-10 text-tunisiaBlue-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Par téléphone</h3>
                  <p className="text-gray-600 mb-4">Du lundi au vendredi, de 9h à 18h</p>
                  <p className="font-medium">+216 71 123 456</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Mail className="h-10 w-10 text-tunisiaBlue-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Par email</h3>
                  <p className="text-gray-600 mb-4">Nous vous répondrons sous 24h</p>
                  <p className="font-medium">contact@tunisiaformation.com</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <MessageSquare className="h-10 w-10 text-tunisiaBlue-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Formulaire de contact</h3>
                  <p className="text-gray-600 mb-4">Remplissez notre formulaire en ligne</p>
                  <Button>Nous contacter</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
