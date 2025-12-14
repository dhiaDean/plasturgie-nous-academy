
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
import { isValidPhoneNumber } from "libphonenumber-js";
import ContactInfo from "./ContactInfo";
import ContactFormFields from "./ContactFormFields";
import SubmitButton from "./SubmitButton";

const ContactSection: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    formation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, formation: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate phone number if provided (assuming Tunisian numbers)
    if (formData.phone && !isValidPhoneNumber(formData.phone, "TN")) {
      toast({
        title: "Numéro de téléphone invalide",
        description: "Veuillez entrer un numéro de téléphone valide.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

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
        formation: "",
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
            <ContactInfo />
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

              <ContactFormFields 
                phone={formData.phone}
                formation={formData.formation}
                subject={formData.subject}
                message={formData.message}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
              />

              <SubmitButton isSubmitting={isSubmitting} />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
