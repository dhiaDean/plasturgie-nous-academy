
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitContactForm } from "@/services/api.service";
import { ContactRequest } from "@/services/api.types";

const ContactSection: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    formation: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, formation: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const subject = formData.formation 
        ? `${formData.subject} - Formation: ${formData.formation}`
        : formData.subject;
        
      const contactData: ContactRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject,
        message: formData.message,
      };
      
      const response = await submitContactForm(contactData);
      
      toast({
        title: "Message envoyé !",
        description: response.message || "Nous vous répondrons dans les plus brefs délais.",
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        formation: ""
      });
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-tunisiaTeal-500 uppercase tracking-wider">
            Contactez-nous
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-tunisiaBlue-800 mt-2">
            Besoin d'informations ?
          </h2>
          <div className="h-1 w-24 bg-tunisiaTeal-400 mt-4 mb-6 mx-auto"></div>
          <p className="text-gray-600">
            Notre équipe est à votre disposition pour répondre à toutes vos questions concernant nos formations et services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-tunisiaBlue-50 p-8 rounded-lg h-full">
              <h3 className="text-2xl font-semibold text-tunisiaBlue-700 mb-6">
                Informations de contact
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-tunisiaBlue-100 p-3 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-tunisiaBlue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-tunisiaBlue-800">Téléphone</h4>
                    <p className="text-gray-600">+216 70 123 456</p>
                    <p className="text-gray-600">+216 70 987 654</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-tunisiaBlue-100 p-3 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-tunisiaBlue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-tunisiaBlue-800">Email</h4>
                    <p className="text-gray-600">contact@tunisiaformation.com</p>
                    <p className="text-gray-600">info@tunisiaformation.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-tunisiaBlue-100 p-3 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-tunisiaBlue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-tunisiaBlue-800">Adresse</h4>
                    <p className="text-gray-600">
                      Rue de l'Innovation, Technopole El Ghazala, Ariana, Tunisie
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-tunisiaBlue-600 to-tunisiaBlue-800 rounded-lg text-white">
                <h4 className="font-semibold mb-2">Horaires d'ouverture</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Lundi - Vendredi:</span>
                    <span>09:00 - 17:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Samedi:</span>
                    <span>09:00 - 13:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Dimanche:</span>
                    <span>Fermé</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-semibold text-tunisiaBlue-700 mb-6">
                Envoyez-nous un message
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Votre email"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Votre numéro de téléphone"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="formation" className="block text-sm font-medium text-gray-700 mb-1">
                    Formation d'intérêt
                  </label>
                  <Select onValueChange={handleSelectChange} value={formData.formation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionnez une formation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="injection">Techniques d'injection plastique</SelectItem>
                      <SelectItem value="extrusion">Extrusion et soufflage</SelectItem>
                      <SelectItem value="maintenance">Maintenance industrielle</SelectItem>
                      <SelectItem value="qualite">Gestion de la qualité</SelectItem>
                      <SelectItem value="moules">Conception de moules</SelectItem>
                      <SelectItem value="securite">Sécurité en milieu industriel</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Sujet de votre message"
                  required
                  className="w-full"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Votre message"
                  required
                  className="w-full min-h-[120px]"
                />
              </div>

              <Button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="mr-2 h-4 w-4" /> Envoyer le message
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
