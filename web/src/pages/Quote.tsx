
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Send, FileText, CheckCircle } from "lucide-react";

const Quote = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    formationType: "",
    participants: "",
    details: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      toast({
        title: "Demande de devis envoyée!",
        description: "Nous vous contacterons prochainement avec notre offre personnalisée.",
      });
      setIsSubmitting(false);
      setStep(3);
      window.scrollTo(0, 0);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-sm font-semibold text-tunisiaTeal-500 uppercase tracking-wider">
                Demande de devis
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-tunisiaBlue-800 mt-2">
                Votre formation sur mesure
              </h1>
              <div className="h-1 w-24 bg-tunisiaTeal-400 mt-4 mb-6 mx-auto"></div>
              <p className="text-gray-600 text-lg">
                Obtenez un devis personnalisé pour vos besoins de formation. Notre équipe d'experts vous proposera une solution adaptée à vos objectifs.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="flex justify-between items-center relative">
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10"></div>
                {[1, 2, 3].map((stepNumber) => (
                  <div 
                    key={stepNumber} 
                    className={`flex flex-col items-center ${step >= stepNumber ? "text-tunisiaBlue-600" : "text-gray-400"}`}
                  >
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium mb-2 ${
                        step >= stepNumber 
                          ? "bg-tunisiaBlue-500" 
                          : "bg-gray-300"
                      }`}
                    >
                      {stepNumber}
                    </div>
                    <span className="text-sm font-medium">
                      {stepNumber === 1 && "Informations"}
                      {stepNumber === 2 && "Détails"}
                      {stepNumber === 3 && "Confirmation"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              {step === 1 && (
                <div className="bg-white p-8 rounded-xl shadow-md">
                  <h2 className="text-2xl font-bold text-tunisiaBlue-800 mb-6">
                    Vos informations
                  </h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Nom complet
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Votre nom complet"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="company" className="text-sm font-medium text-gray-700">
                          Entreprise (Optionnel)
                        </label>
                        <Input
                          id="company"
                          name="company"
                          placeholder="Nom de votre entreprise"
                          value={formData.company}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Votre adresse email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                          Téléphone
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="Votre numéro de téléphone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button 
                        onClick={handleNextStep}
                        className="bg-tunisiaBlue-500 hover:bg-tunisiaBlue-600"
                      >
                        Continuer
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white p-8 rounded-xl shadow-md">
                  <h2 className="text-2xl font-bold text-tunisiaBlue-800 mb-6">
                    Détails de votre formation
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="formationType" className="text-sm font-medium text-gray-700">
                        Type de formation
                      </label>
                      <Select 
                        onValueChange={(value) => handleSelectChange("formationType", value)}
                        value={formData.formationType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le type de formation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plasturgie">Plasturgie</SelectItem>
                          <SelectItem value="technique">Technique</SelectItem>
                          <SelectItem value="gestion">Gestion</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="participants" className="text-sm font-medium text-gray-700">
                        Nombre de participants
                      </label>
                      <Select 
                        onValueChange={(value) => handleSelectChange("participants", value)}
                        value={formData.participants}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Nombre de participants" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 personnes</SelectItem>
                          <SelectItem value="6-10">6-10 personnes</SelectItem>
                          <SelectItem value="11-20">11-20 personnes</SelectItem>
                          <SelectItem value="21+">Plus de 20 personnes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="details" className="text-sm font-medium text-gray-700">
                        Détails de votre demande
                      </label>
                      <Textarea
                        id="details"
                        name="details"
                        placeholder="Décrivez vos besoins spécifiques, objectifs de formation, disponibilités, etc."
                        rows={6}
                        value={formData.details}
                        onChange={handleInputChange}
                        required
                        className="resize-none"
                      />
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={handlePrevStep}
                      >
                        Retour
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-tunisiaBlue-500 hover:bg-tunisiaBlue-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Envoi en cours..."
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" /> Envoyer la demande
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {step === 3 && (
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                  <div className="flex justify-center mb-6">
                    <div className="bg-green-100 p-4 rounded-full">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-tunisiaBlue-800 mb-3">
                    Demande envoyée avec succès!
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Merci pour votre demande de devis. Notre équipe étudiera votre besoin et vous contactera dans un délai de 48 heures ouvrables.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = "/"}
                    >
                      Retour à l'accueil
                    </Button>
                    <Button 
                      className="bg-tunisiaBlue-500 hover:bg-tunisiaBlue-600"
                      onClick={() => window.location.href = "/formations"}
                    >
                      <FileText className="mr-2 h-4 w-4" /> Voir nos formations
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Quote;
